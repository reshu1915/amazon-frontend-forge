import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Star } from "lucide-react";
import { Header } from "../components/Header";
import { useCart } from "../lib/cart";
import { getProduct } from "../lib/products";

export const Route = createFileRoute("/product/$id")({
  component: ProductPage,
  loader: ({ params }) => {
    const product = getProduct(params.id);
    if (!product) throw notFound();
    return { product };
  },
});

function ProductPage() {
  const { product } = Route.useLoaderData();
  const { add } = useCart();

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <div className="max-w-7xl mx-auto p-4 grid grid-cols-1 md:grid-cols-12 gap-6">
        <div className="md:col-span-5 flex items-center justify-center bg-white">
          <img src={product.image} alt={product.title} className="max-h-[500px] object-contain" />
        </div>

        <div className="md:col-span-4">
          <h1 className="text-2xl font-medium">{product.title}</h1>
          <div className="flex items-center gap-2 mt-2 pb-3 border-b">
            <div className="flex">
              {[1, 2, 3, 4, 5].map((i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${
                    i <= Math.round(product.rating)
                      ? "fill-[#ffa41c] text-[#ffa41c]"
                      : "text-gray-300"
                  }`}
                />
              ))}
            </div>
            <span className="text-sm text-[#007185]">
              {product.reviews.toLocaleString()} ratings
            </span>
          </div>

          <div className="py-3">
            <span className="text-xs align-top">$</span>
            <span className="text-3xl">{Math.floor(product.price)}</span>
            <span className="text-xs">{(product.price % 1).toFixed(2).slice(1)}</span>
          </div>

          <p className="text-sm mt-3 leading-relaxed text-gray-800">{product.description}</p>
        </div>

        <aside className="md:col-span-3 border rounded p-4 h-fit">
          <div className="text-2xl">
            <span className="text-xs align-top">$</span>
            {product.price.toFixed(2)}
          </div>
          {product.prime && (
            <div className="text-sm text-gray-700 mt-1">
              <span className="text-[#00a8e1] font-bold">prime</span> FREE delivery tomorrow
            </div>
          )}
          <div className="text-lg text-[#007600] mt-2">In Stock</div>
          <button
            onClick={() => add(product.id)}
            className="w-full mt-3 bg-[#ffd814] hover:bg-[#f7ca00] text-black rounded-full py-2 text-sm font-medium"
          >
            Add to Cart
          </button>
          <Link
            to="/cart"
            className="block text-center w-full mt-2 bg-[#ffa41c] hover:bg-[#fa8900] text-black rounded-full py-2 text-sm font-medium"
          >
            Buy Now
          </Link>
        </aside>
      </div>
    </div>
  );
}
