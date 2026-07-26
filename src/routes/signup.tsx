import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import logo from "@/assets/logo_tapes.png.asset.json";

export const Route = createFileRoute("/signup")({
  head: () => ({
    meta: [
      { title: "Sign up — tapes" },
      { name: "description", content: "Create your tapes account and join the community." },
      { property: "og:title", content: "Sign up — tapes" },
      { property: "og:description", content: "Create your tapes account and join the community." },
    ],
  }),
  component: SignUpPage,
});

const schema = z.object({
  email: z.string().trim().email({ message: "Invalid e-mail" }).max(255),
  username: z
    .string()
    .trim()
    .min(3, { message: "Min. 3 characters" })
    .max(30, { message: "Max. 30 characters" })
    .regex(/^[a-zA-Z0-9_.]+$/, { message: "Allowed: letters, digits, _ and ." }),
  password: z.string().min(6, { message: "Min. 6 characters" }).max(72),
  birthDate: z.string().refine((v) => !Number.isNaN(Date.parse(v)), {
    message: "Enter your date of birth",
  }),
});

function SignUpPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", username: "", password: "", birthDate: "" });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const parsed = schema.safeParse(form);
    if (!parsed.success) {
      setError(parsed.error.issues[0].message);
      return;
    }
    setLoading(true);
    const { data, error: signUpError } = await supabase.auth.signUp({
      email: parsed.data.email,
      password: parsed.data.password,
      options: {
        emailRedirectTo: `${window.location.origin}/feed`,
        data: {
          username: parsed.data.username,
          birth_date: parsed.data.birthDate,
        },
      },
    });
    if (signUpError) {
      setError(signUpError.message);
      setLoading(false);
      return;
    }
    if (data.session) {
      navigate({ to: "/feed" });
    } else {
      // If auto-confirm somehow off, try sign-in immediately
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: parsed.data.email,
        password: parsed.data.password,
      });
      if (signInError) {
        setError(signInError.message);
        setLoading(false);
        return;
      }
      navigate({ to: "/feed" });
    }
  };

  return (
    <div className="min-h-screen w-full bg-black text-white">
      <div className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-6 py-10">
        <div className="mb-8 flex justify-center">
          <img src={logo.url} alt="tapes" className="h-32 w-auto object-contain" />
        </div>
        <h1 className="mb-6 text-center text-2xl font-semibold">sign up</h1>
        <form onSubmit={onSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="e-mail"
            autoComplete="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="w-full rounded-md border border-white/20 bg-white/5 px-4 py-3 text-white placeholder-white/50 outline-none focus:border-[#ff2e93]"
          />
          <input
            type="text"
            placeholder="username"
            autoComplete="username"
            value={form.username}
            onChange={(e) => setForm({ ...form, username: e.target.value })}
            className="w-full rounded-md border border-white/20 bg-white/5 px-4 py-3 text-white placeholder-white/50 outline-none focus:border-[#ff2e93]"
          />
          <input
            type="password"
            placeholder="password"
            autoComplete="new-password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            className="w-full rounded-md border border-white/20 bg-white/5 px-4 py-3 text-white placeholder-white/50 outline-none focus:border-[#ff2e93]"
          />
          <label className="block text-sm text-white/70">
            date of birth
            <input
              type="date"
              value={form.birthDate}
              onChange={(e) => setForm({ ...form, birthDate: e.target.value })}
              className="mt-1 w-full rounded-md border border-white/20 bg-white/5 px-4 py-3 text-white outline-none focus:border-[#ff2e93]"
            />
          </label>

          {error && <p className="text-sm text-red-400">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-md bg-[#ff2e93] py-4 text-xl font-medium text-white shadow-[0_0_20px_rgba(255,46,147,0.7)] transition-opacity hover:opacity-90 disabled:opacity-60"
          >
            {loading ? "..." : "sign up"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-white/70">
          already have an account?{" "}
          <Link to="/login" className="font-semibold text-white underline">
            log in
          </Link>
        </p>
      </div>
    </div>
  );
}
