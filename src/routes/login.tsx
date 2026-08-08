import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { resolveEmailByUsername } from "@/lib/auth.functions";
import logo from "@/assets/logo_tapes.png.asset.json";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Log in — tapes" },
      { name: "description", content: "Log in to tapes." },
      { property: "og:title", content: "Log in — tapes" },
      { property: "og:description", content: "Log in to tapes." },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!identifier.trim() || !password) {
      setError("Enter your username and password");
      return;
    }
    setLoading(true);
    try {
      let email = identifier.trim();
      if (!email.includes("@")) {
        const resolved = await resolveEmailByUsername({ data: { username: email } });
        if (!resolved.email) {
          setError("User not found");
          setLoading(false);
          return;
        }
        email = resolved.email;
      }
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (signInError) {
        setError("Invalid credentials");
        setLoading(false);
        return;
      }
      navigate({ to: "/feed" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-black text-white">
      <Link
        to="/"
        aria-label="Back"
        className="absolute left-4 top-4 z-20 rounded-full bg-white/10 p-2 text-white backdrop-blur-sm transition-colors hover:bg-white/20"
      >
        <ArrowLeft size={24} />
      </Link>
      <div className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-6 py-10">
        <div className="mb-8 flex justify-center">
          <img src={logo.url} alt="tapes" className="h-32 w-auto object-contain" />
        </div>
        <h1 className="mb-6 text-center text-2xl font-semibold">log in</h1>
        <form onSubmit={onSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="username or e-mail"
            autoComplete="username"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            className="w-full rounded-md border border-white/20 bg-white/5 px-4 py-3 text-white placeholder-white/50 outline-none focus:border-[#ff2e93]"
          />
          <input
            type="password"
            placeholder="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-md border border-white/20 bg-white/5 px-4 py-3 text-white placeholder-white/50 outline-none focus:border-[#ff2e93]"
          />

          {error && <p className="text-sm text-red-400">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-md bg-[#ff2e93] py-4 text-xl font-medium text-white shadow-[0_0_20px_rgba(255,46,147,0.7)] transition-opacity hover:opacity-90 disabled:opacity-60"
          >
            {loading ? "..." : "log in"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-white/70">
          don't have an account?{" "}
          <Link to="/signup" className="font-semibold text-white underline">
            sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
