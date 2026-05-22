import { createFileRoute, Link } from "@tanstack/react-router";
import { Header } from "@/components/Header";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/_authenticated/account")({
  component: AccountPage,
});

function AccountPage() {
  const { user } = useAuth();
  return (
    <div className="min-h-screen bg-[#e3e6e6]">
      <Header />
      <div className="max-w-5xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-4">Your Account</h1>
        <p className="text-sm text-gray-700 mb-6">Signed in as {user?.email}</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { to: "/", label: "Continue shopping" },
            { to: "/cart", label: "Your Cart" },
          ].map((l) => (
            <Link key={l.to} to={l.to} className="bg-white border border-gray-300 rounded p-4 hover:shadow">
              <div className="font-bold">{l.label}</div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
