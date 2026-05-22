import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";

export const Route = createFileRoute("/login")({
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Signed in");
    navigate({ to: "/" });
  };

  const google = async () => {
    const result = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin,
    });
    if (result.error) toast.error(result.error.message);
    if (result.redirected) return;
    navigate({ to: "/" });
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center pt-8 px-4">
      <Link to="/" className="text-3xl font-bold text-black mb-6">
        amazon<span className="text-[#ff9900]">.</span>
      </Link>
      <div className="w-full max-w-sm border border-gray-300 rounded p-5">
        <h1 className="text-2xl font-medium mb-4">Sign in</h1>
        <form onSubmit={submit} className="space-y-3">
          <label className="block text-sm font-bold">
            Email
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full border border-gray-400 rounded px-2 py-1.5 outline-none focus:border-[#e77600] focus:ring-2 focus:ring-[#f8d8a8]"
            />
          </label>
          <label className="block text-sm font-bold">
            Password
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full border border-gray-400 rounded px-2 py-1.5 outline-none focus:border-[#e77600] focus:ring-2 focus:ring-[#f8d8a8]"
            />
          </label>
          <button
            disabled={loading}
            className="w-full bg-[#ffd814] hover:bg-[#f7ca00] text-black text-sm rounded py-1.5 border border-[#fcd200] disabled:opacity-60"
          >
            {loading ? "Signing in…" : "Sign in"}
          </button>
        </form>
        <div className="flex items-center my-4 text-xs text-gray-500">
          <div className="flex-1 h-px bg-gray-300" />
          <span className="px-2">or</span>
          <div className="flex-1 h-px bg-gray-300" />
        </div>
        <button
          onClick={google}
          className="w-full border border-gray-400 rounded py-1.5 text-sm hover:bg-gray-50"
        >
          Continue with Google
        </button>
      </div>
      <div className="w-full max-w-sm text-center text-sm mt-4">
        New to Amazon?{" "}
        <Link to="/signup" className="text-[#007185] hover:text-[#c7511f] hover:underline">
          Create your account
        </Link>
      </div>
    </div>
  );
}
