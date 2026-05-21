
-- Roles
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role app_role NOT NULL DEFAULT 'user',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, role)
);
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

CREATE POLICY "view own roles" ON public.user_roles FOR SELECT TO authenticated
  USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "admins manage roles" ON public.user_roles FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Profiles
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "view own profile" ON public.profiles FOR SELECT TO authenticated
  USING (auth.uid() = id OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "update own profile" ON public.profiles FOR UPDATE TO authenticated
  USING (auth.uid() = id);
CREATE POLICY "insert own profile" ON public.profiles FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = id);

-- Auto-create profile + default role on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email));
  INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'user');
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Products
CREATE TABLE public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  price NUMERIC(10,2) NOT NULL CHECK (price >= 0),
  image TEXT NOT NULL DEFAULT '',
  category TEXT NOT NULL DEFAULT 'General',
  stock INT NOT NULL DEFAULT 100,
  rating NUMERIC(2,1) NOT NULL DEFAULT 0,
  reviews_count INT NOT NULL DEFAULT 0,
  prime BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "products public read" ON public.products FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "admins manage products" ON public.products FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Addresses
CREATE TABLE public.addresses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  line1 TEXT NOT NULL,
  line2 TEXT DEFAULT '',
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  zip TEXT NOT NULL,
  country TEXT NOT NULL DEFAULT 'United States',
  phone TEXT NOT NULL,
  is_default BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.addresses ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own addresses" ON public.addresses FOR ALL TO authenticated
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Wishlist
CREATE TABLE public.wishlist (
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, product_id)
);
ALTER TABLE public.wishlist ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own wishlist" ON public.wishlist FOR ALL TO authenticated
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Orders
CREATE TYPE public.order_status AS ENUM ('placed','shipped','delivered','cancelled');

CREATE TABLE public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  status order_status NOT NULL DEFAULT 'placed',
  subtotal NUMERIC(10,2) NOT NULL,
  ship_name TEXT NOT NULL,
  ship_line1 TEXT NOT NULL,
  ship_line2 TEXT DEFAULT '',
  ship_city TEXT NOT NULL,
  ship_state TEXT NOT NULL,
  ship_zip TEXT NOT NULL,
  ship_country TEXT NOT NULL,
  ship_phone TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "own orders read" ON public.orders FOR SELECT TO authenticated
  USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "own orders insert" ON public.orders FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);
CREATE POLICY "admins update orders" ON public.orders FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Order items
CREATE TABLE public.order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  price NUMERIC(10,2) NOT NULL,
  qty INT NOT NULL CHECK (qty > 0),
  image TEXT NOT NULL DEFAULT ''
);
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "view items of own orders" ON public.order_items FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM public.orders o WHERE o.id = order_id AND (o.user_id = auth.uid() OR public.has_role(auth.uid(),'admin'))));
CREATE POLICY "insert items of own orders" ON public.order_items FOR INSERT TO authenticated
  WITH CHECK (EXISTS (SELECT 1 FROM public.orders o WHERE o.id = order_id AND o.user_id = auth.uid()));

-- Reviews
CREATE TABLE public.reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  rating INT NOT NULL CHECK (rating BETWEEN 1 AND 5),
  title TEXT NOT NULL DEFAULT '',
  body TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(product_id, user_id)
);
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
CREATE POLICY "reviews public read" ON public.reviews FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "own reviews write" ON public.reviews FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);
CREATE POLICY "own reviews update" ON public.reviews FOR UPDATE TO authenticated
  USING (auth.uid() = user_id);
CREATE POLICY "own reviews delete" ON public.reviews FOR DELETE TO authenticated
  USING (auth.uid() = user_id);

-- Recompute product rating cache after review changes
CREATE OR REPLACE FUNCTION public.recompute_product_rating()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE pid UUID;
BEGIN
  pid := COALESCE(NEW.product_id, OLD.product_id);
  UPDATE public.products
  SET rating = COALESCE((SELECT ROUND(AVG(rating)::numeric, 1) FROM public.reviews WHERE product_id = pid), 0),
      reviews_count = (SELECT COUNT(*) FROM public.reviews WHERE product_id = pid)
  WHERE id = pid;
  RETURN NULL;
END;
$$;

CREATE TRIGGER reviews_recompute
AFTER INSERT OR UPDATE OR DELETE ON public.reviews
FOR EACH ROW EXECUTE FUNCTION public.recompute_product_rating();

-- Seed products
INSERT INTO public.products (title, description, price, image, category, rating, reviews_count, prime) VALUES
('Echo Dot (5th Gen) Smart Speaker with Alexa','Our most popular smart speaker with a fabric design.',49.99,'https://m.media-amazon.com/images/I/71xoR4A6q-L._AC_SL1500_.jpg','Electronics',4.7,234112,true),
('Apple AirPods Pro (2nd Generation) Wireless Earbuds','Up to 2x more Active Noise Cancellation.',199.00,'https://m.media-amazon.com/images/I/61SUj2aKoEL._AC_SL1500_.jpg','Electronics',4.8,88450,true),
('Kindle Paperwhite (16 GB)','Thinnest, lightest Kindle Paperwhite with 300 ppi glare-free display.',149.99,'https://m.media-amazon.com/images/I/61Ww4abZqWL._AC_SL1000_.jpg','Electronics',4.6,42010,true),
('Instant Pot Duo 7-in-1 Electric Pressure Cooker','America''s most loved multi cooker.',89.95,'https://m.media-amazon.com/images/I/71V1LrY1MSL._AC_SL1500_.jpg','Home & Kitchen',4.7,178902,true),
('Ninja AF101 Air Fryer, 4 Quart','Healthier fried foods with up to 75% less fat.',99.99,'https://m.media-amazon.com/images/I/71+8uTMDRFL._AC_SL1500_.jpg','Home & Kitchen',4.7,51230,true),
('Atomic Habits by James Clear','Tiny changes, remarkable results.',11.98,'https://m.media-amazon.com/images/I/81wgcld4wxL._SL1500_.jpg','Books',4.8,152300,true),
('Sony WH-1000XM5 Wireless Noise Canceling Headphones','Industry-leading noise canceling with two processors.',348.00,'https://m.media-amazon.com/images/I/61+btxzpfDL._AC_SL1500_.jpg','Electronics',4.6,18920,true),
('LEGO Star Wars The Mandalorian''s N-1 Starfighter','Buildable model with Grogu, IG-11 and Peli Motto minifigures.',59.99,'https://m.media-amazon.com/images/I/81fHJ2Cv9NL._AC_SL1500_.jpg','Toys & Games',4.9,4321,true);

-- Helper: first user becomes admin
CREATE OR REPLACE FUNCTION public.claim_admin_if_none()
RETURNS BOOLEAN LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE has_admin BOOLEAN;
BEGIN
  IF auth.uid() IS NULL THEN RETURN false; END IF;
  SELECT EXISTS(SELECT 1 FROM public.user_roles WHERE role = 'admin') INTO has_admin;
  IF NOT has_admin THEN
    INSERT INTO public.user_roles (user_id, role) VALUES (auth.uid(), 'admin')
    ON CONFLICT (user_id, role) DO NOTHING;
    RETURN true;
  END IF;
  RETURN false;
END;
$$;
