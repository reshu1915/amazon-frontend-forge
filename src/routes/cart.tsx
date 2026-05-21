import { createFileRoute, Link } from "@tanstack/react-router";
import { Header } from "../components/Header";
import { useCart } from "../lib/cart";
import { getProduct } from "../lib/products";

export const Route = createFileRoute("/cart")({
  component: CartPage,
});

function CartPage() {
  const { items, setQty, remove, count } = useCart();

  const lines = items
    .map((i) => ({ item: i, product: getProduct(i.id) }))
    .filter((l) => l.product);

  const subtotal = lines.reduce((s, l) => s + l.product!.price * l.item.qty, 0);

  return (
    <div className="min-h-screen bg-[#e3e6e6]">
      <Header />
      <div className="max-w-7xl mx-auto p-4 grid grid-cols-1 lg:grid-cols-12 gap-4">
        <div className="bg-white p-5 lg:col-span-9">
          <div className="flex justify-between items-baseline border-b pb-3">
            <h1 className="text-3xl">Shopping Cart</h1>
            <span className="text-sm text-gray-600">Price</span>
          </div>

          {lines.length === 0 ? (
            <div className="py-8">
              <p className="text-lg">Your Amazon Cart is empty.</p>
              <Link to="/" className="text-[#007185] hover:text-[#c7511f] hover:underline">
                Continue shopping
              </Link>
            </div>
          ) : (
            lines.map(({ item, product }) => (
              <div key={item.id} className="flex gap-4 py-4 border-b">
                <div className="w-32 h-32 flex items-center justify-center">
                  <img
                    src={product!.image}
                    alt={product!.title}
                    className="max-h-full max-w-full object-contain"
                  />
                </div>
                <div className="flex-1">
                  <Link
                    to="/product/$id"
                    params={{ id: product!.id }}
                    className="text-base hover:text-[#c7511f] hover:underline"
                  >
                    {product!.title}
                  </Link>
                  <div className="text-sm text-[#007600] mt-1">In Stock</div>
                  {product!.prime && (
                    <div className="text-xs text-gray-700 mt-1">
                      <span className="text-[#00a8e1] font-bold">prime</span> Eligible for FREE Shipping
                    </div>
                  )}
                  <div className="flex items-center gap-3 mt-2 text-sm">
                    <div className="flex items-center border rounded-full overflow-hidden">
                      <button
                        onClick={() => setQty(item.id, item.qty - 1)}
                        className="px-3 py-1 hover:bg-gray-100"
                      >
                        −
                      </button>
                      <span className="px-3">{item.qty}</span>
                      <button
                        onClick={() => setQty(item.id, item.qty + 1)}
                        className="px-3 py-1 hover:bg-gray-100"
                      >
                        +
                      </button>
                    </div>
                    <span className="text-gray-400">|</span>
                    <button
                      onClick={() => remove(item.id)}
                      className="text-[#007185] hover:text-[#c7511f] hover:underline"
                    >
                      Delete
                    </button>
                  </div>
                </div>
                <div className="font-bold">${product!.price.toFixed(2)}</div>
              </div>
            ))
          )}

          <div className="text-right pt-4 text-lg">
            Subtotal ({count} items):{" "}
            <span className="font-bold">${subtotal.toFixed(2)}</span>
          </div>
        </div>

        <aside className="bg-white p-5 lg:col-span-3 h-fit">
          <div className="text-lg">
            Subtotal ({count} items): <span className="font-bold">${subtotal.toFixed(2)}</span>
          </div>
          <label className="flex items-center gap-2 text-sm mt-2">
            <input type="checkbox" /> This order contains a gift
          </label>
          <button
            disabled={lines.length === 0}
            className="w-full mt-3 bg-[#ffd814] hover:bg-[#f7ca00] disabled:opacity-50 text-black rounded-full py-2 text-sm font-medium"
          >
            Proceed to checkout
          </button>
        </aside>
      </div>
    </div>
  );
}
