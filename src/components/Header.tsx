import { Link, useNavigate } from "@tanstack/react-router";
import { MapPin, Search, ShoppingCart } from "lucide-react";
import { useState } from "react";
import { useCart } from "../lib/cart";

export function Header() {
  const { count } = useCart();
  const navigate = useNavigate();
  const [q, setQ] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate({ to: "/", search: { q } as any });
  };

  return (
    <header className="w-full text-white">
      {/* Top bar */}
      <div className="bg-[#131921] flex items-center gap-2 px-3 py-2">
        <Link to="/" className="border border-transparent hover:border-white px-2 py-1">
          <span className="text-2xl font-bold">
            amazon<span className="text-[#ff9900]">.</span>
          </span>
        </Link>

        <div className="hidden md:flex items-center text-sm border border-transparent hover:border-white px-2 py-1">
          <MapPin className="w-4 h-4 mr-1" />
          <div className="leading-tight">
            <div className="text-[11px] text-gray-300">Deliver to</div>
            <div className="font-bold">United States</div>
          </div>
        </div>

        <form onSubmit={submit} className="flex flex-1 h-10 rounded overflow-hidden">
          <select className="bg-gray-200 text-black text-xs px-2 hidden sm:block">
            <option>All</option>
          </select>
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search Amazon"
            className="flex-1 px-3 text-black outline-none"
          />
          <button className="bg-[#febd69] hover:bg-[#f3a847] px-4 text-black" aria-label="Search">
            <Search className="w-5 h-5" />
          </button>
        </form>

        <div className="hidden md:block text-sm border border-transparent hover:border-white px-2 py-1">
          <div className="text-[11px]">Hello, sign in</div>
          <div className="font-bold">Account & Lists</div>
        </div>

        <div className="hidden lg:block text-sm border border-transparent hover:border-white px-2 py-1">
          <div className="text-[11px]">Returns</div>
          <div className="font-bold">& Orders</div>
        </div>

        <Link to="/cart" className="flex items-end border border-transparent hover:border-white px-2 py-1">
          <div className="relative">
            <ShoppingCart className="w-8 h-8" />
            <span className="absolute -top-1 left-4 text-[#f08804] font-bold text-sm">{count}</span>
          </div>
          <span className="font-bold ml-1">Cart</span>
        </Link>
      </div>

      {/* Sub nav */}
      <div className="bg-[#232f3e] flex items-center gap-4 px-4 py-1 text-sm overflow-x-auto">
        <span className="font-bold">All</span>
        <span>Today's Deals</span>
        <span>Customer Service</span>
        <span>Registry</span>
        <span>Gift Cards</span>
        <span>Sell</span>
      </div>
    </header>
  );
}
