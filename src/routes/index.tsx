import { createFileRoute, Link } from "@tanstack/react-router";
import { Header } from "../components/Header";
import { ProductCard } from "../components/ProductCard";
import { categories, products } from "../lib/products";

type Search = { q?: string; category?: string };

export const Route = createFileRoute("/")({
  component: Index,
  validateSearch: (s: Record<string, unknown>): Search => ({
    q: typeof s.q === "string" ? s.q : undefined,
    category: typeof s.category === "string" ? s.category : undefined,
  }),
});

function Index() {
  const { q, category } = Route.useSearch();
  const filtered = products.filter((p) => {
    if (q && !p.title.toLowerCase().includes(q.toLowerCase())) return false;
    if (category && p.category !== category) return false;
    return true;
  });

  return (
    <div className="min-h-screen bg-[#e3e6e6]">
      <Header />

      {/* Hero band */}
      <div className="relative h-[160px] md:h-[260px] bg-gradient-to-b from-[#232f3e] to-[#e3e6e6] overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://m.media-amazon.com/images/I/61TD5JLGhIL._SX3000_.jpg')] bg-cover bg-center opacity-90" />
      </div>

      {/* Category cards */}
      <div className="max-w-7xl mx-auto px-4 -mt-24 md:-mt-40 relative grid grid-cols-2 lg:grid-cols-4 gap-3">
        {categories.map((c) => (
          <div key={c.name} className="bg-white p-3">
            <h2 className="text-sm md:text-base font-bold mb-2 line-clamp-1">{c.name}</h2>
            <div className="h-24 md:h-32 overflow-hidden mb-2 flex items-center justify-center bg-gray-50">
              <img src={c.image} alt={c.name} className="max-h-full max-w-full object-contain" />
            </div>
            <Link
              to="/"
              search={{ category: c.name }}
              className="text-xs text-[#007185] hover:text-[#c7511f] hover:underline"
            >
              Shop {c.name}
            </Link>
          </div>
        ))}
      </div>

      {/* Product grid */}
      <section className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-baseline justify-between mb-4 flex-wrap gap-2">
          <h1 className="text-2xl font-bold">
            {q
              ? `Results for "${q}"`
              : category
                ? category
                : "Featured products"}
          </h1>
          {(q || category) && (
            <Link to="/" className="text-sm text-[#007185] hover:text-[#c7511f] hover:underline">
              Clear filter
            </Link>
          )}
        </div>
        {filtered.length === 0 ? (
          <p className="text-gray-700">No products matched.</p>
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
