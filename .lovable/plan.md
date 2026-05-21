A "full Amazon clone" is huge — here's the scoped plan I'll build in one pass on top of the existing storefront. Mock checkout (no real payments).

## 1. Enable Lovable Cloud
Real users, persisted data (products, cart server-synced optional, orders, reviews, addresses, wishlist, roles).

## 2. Database schema
- `profiles` (id, full_name, avatar, created_at) — auto-created on signup via trigger
- `user_roles` (user_id, role: 'admin' | 'user') + `has_role()` security definer
- `products` (id, title, description, price, image, category, stock, rating cache, reviews_count cache, prime, created_by)
- `addresses` (id, user_id, name, line1, line2, city, state, zip, country, phone, is_default)
- `wishlist` (user_id, product_id, created_at) PK composite
- `orders` (id, user_id, address_id snapshot fields, subtotal, status: placed/shipped/delivered/cancelled, created_at)
- `order_items` (id, order_id, product_id, title, price, qty, image)
- `reviews` (id, product_id, user_id, rating 1-5, title, body, created_at) unique(product_id,user_id)

RLS: users see/edit own data; products & reviews public read; admins write products & update order status. Seed initial 8 products from current static list.

## 3. Auth
- `/login` and `/signup` pages — email/password + Google (via Lovable broker)
- `_authenticated` layout for protected routes
- Header shows "Hello, {name}" + dropdown (Account, Orders, Sign out) when signed in
- `onAuthStateChange` listener at root for cache invalidation

## 4. Shopping flow
- Homepage: search + category filter (already done) — switch to DB-backed products
- Product detail: server-fetched, "Add to Cart", "Add to Wishlist", reviews list + write-review form (signed-in only)
- Cart: keeps localStorage for guests, syncs to server on sign-in (simple merge)
- `/checkout`: pick/add address → review → "Place order" → creates order + order_items, clears cart, redirects to order confirmation
- `/orders`: list user's past orders with status badges
- `/orders/$id`: detail with items, total, address, status timeline
- `/wishlist`: items with move-to-cart / remove

## 5. Account section (`/account`)
Hub linking to: Your Orders, Your Addresses (CRUD), Your Wishlist, Account Settings (name/avatar), Sign out.

## 6. Admin dashboard (`/admin`, role-gated)
- `/admin/products`: list + create/edit/delete with image URL
- `/admin/orders`: all orders, update status
- `/admin/users`: list users, grant/revoke admin role

## 7. Reviews
- Star rating + title + body
- Aggregate rating recomputed via trigger after insert/update/delete

## 8. Polish
- Toaster notifications (already installed sonner) for add-to-cart, order placed, etc.
- Empty states everywhere
- Loading skeletons on async pages
- Header search wires into homepage (already done)

## Technical notes
- All data via `createServerFn` + `requireSupabaseAuth` (RLS-respecting) — admin ops use admin client gated by `has_role` check
- Mock payments: no Stripe — order is created directly on "Place order"
- Keep Amazon visual style (navy `#131921` header, yellow `#ffd814` CTAs)
- Roles stored in separate `user_roles` table (security best practice)
- First signed-up user can be promoted to admin via a one-time SQL note shown after first signup, or I'll add a "make me admin" dev helper on `/admin` when no admins exist

## Out of scope (tell me if you want any of these next)
Real payments, shipping calculation, multi-seller marketplace, Q&A, recommendations engine, returns flow, gift cards, Prime subscription, video reviews.

Approve this and I'll build it.