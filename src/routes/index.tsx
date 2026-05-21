import { createFileRoute } from "@tanstack/react-router";
import { Header } from "../components/Header";
import { ProductCard } from "../components/ProductCard";
import { categories, products } from "../lib/products";

type Search = { q?: string };

export const Route = createFileRoute("/")({
  component: Index,
  validateSearch: (s: Record<string, unknown>): Search => ({
    q: typeof s.q === "string" ? s.q : undefined,
  }),
});

function Index() {
  const { q } = Route.useSearch();
  const filtered = q
    ? products.filter((p) => p.title.toLowerCase().includes(q.toLowerCase()))
    : products;

  return (
    <div className="min-h-screen bg-[#e3e6e6]">
      <Header />

      {/* Hero band */}
      <div className="relative h-[280px] md:h-[400px] bg-gradient-to-b from-[#232f3e] to-[#e3e6e6] overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://m.media-amazon.com/images/I/61TD5JLGhIL._SX3000_.jpg')] bg-cover bg-center opacity-90" />
      </div>

      {/* Category cards */}
      <div className="max-w-7xl mx-auto px-4 -mt-40 md:-mt-56 relative grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {categories.map((c) => (
          <div key={c.name} className="bg-white p-5">
            <h2 className="text-xl font-bold mb-3">{c.name}</h2>
            <div className="aspect-square overflow-hidden mb-3 flex items-center justify-center bg-gray-50">
              <img src={c.image} alt={c.name} className="max-h-full max-w-full object-contain" />
            </div>
            <a className="text-sm text-[#007185] hover:text-[#c7511f] hover:underline cursor-pointer">
              Shop {c.name}
            </a>
          </div>
        ))}
      </div>

      {/* Product grid */}
      <section className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-4">
          {q ? `Results for "${q}"` : "Featured products"}
        </h1>
        {filtered.length === 0 ? (
          <p className="text-gray-700">No products matched your search.</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {filtered.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </section>

      <footer className="bg-[#232f3e] text-white text-center py-6 text-sm">
        Amazon clone built with Lovable · Demo only
      </footer>
    </div>
  );
}
