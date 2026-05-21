import { Link } from "@tanstack/react-router";
import { Star } from "lucide-react";
import type { Product } from "../lib/products";

export function ProductCard({ product }: { product: Product }) {
  return (
    <Link
      to="/product/$id"
      params={{ id: product.id }}
      className="bg-white p-4 flex flex-col hover:shadow-lg transition"
    >
      <div className="aspect-square flex items-center justify-center mb-3">
        <img src={product.image} alt={product.title} className="max-h-full max-w-full object-contain" />
      </div>
      <h3 className="text-sm text-[#007185] hover:text-[#c7511f] hover:underline line-clamp-2">
        {product.title}
      </h3>
      <div className="flex items-center gap-1 mt-1">
        <div className="flex">
          {[1, 2, 3, 4, 5].map((i) => (
            <Star
              key={i}
              className={`w-4 h-4 ${
                i <= Math.round(product.rating) ? "fill-[#ffa41c] text-[#ffa41c]" : "text-gray-300"
              }`}
            />
          ))}
        </div>
        <span className="text-xs text-[#007185]">{product.reviews.toLocaleString()}</span>
      </div>
      <div className="mt-1">
        <span className="text-xs align-top">$</span>
        <span className="text-xl font-medium">{Math.floor(product.price)}</span>
        <span className="text-xs">{(product.price % 1).toFixed(2).slice(1)}</span>
      </div>
      {product.prime && (
        <div className="text-xs text-gray-700 mt-1">
          <span className="text-[#00a8e1] font-bold">prime</span> FREE delivery
        </div>
      )}
    </Link>
  );
}
