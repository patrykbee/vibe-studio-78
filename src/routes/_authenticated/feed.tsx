import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated/feed")({
  head: () => ({
    meta: [
      { title: "Feed — tapes" },
      { name: "description", content: "Twój feed na tapes." },
      { property: "og:title", content: "Feed — tapes" },
      { property: "og:description", content: "Twój feed na tapes." },
    ],
  }),
  component: FeedPage,
});

type Profile = { username: string | null };

function FeedPage() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<Profile | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data }) => {
      if (!data.user) return;
      const { data: p } = await supabase
        .from("profiles")
        .select("username")
        .eq("id", data.user.id)
        .maybeSingle();
      setProfile(p ?? { username: null });
    });
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
    navigate({ to: "/" });
  };

  const mockClips = Array.from({ length: 6 }).map((_, i) => ({ id: i, title: `Clip #${i + 1}` }));

  return (
    <div className="min-h-screen w-full bg-black text-white">
      <header className="sticky top-0 z-10 flex items-center justify-between border-b border-white/10 bg-black/80 px-4 py-3 backdrop-blur">
        <span className="text-lg font-semibold">tapes feed</span>
        <div className="flex items-center gap-3 text-sm">
          {profile?.username && <span className="text-white/70">@{profile.username}</span>}
          <button
            onClick={signOut}
            className="rounded-md border border-white/20 px-3 py-1 text-xs hover:bg-white/10"
          >
            wyloguj
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-md space-y-4 px-4 py-6">
        {mockClips.map((c) => (
          <div
            key={c.id}
            className="flex aspect-[9/16] items-end rounded-lg bg-gradient-to-br from-[#ff2e93]/40 via-black to-black p-4 shadow-lg"
          >
            <div>
              <p className="text-lg font-semibold">{c.title}</p>
              <p className="text-sm text-white/70">Twój feed startowy — zacznij nagrywać!</p>
            </div>
          </div>
        ))}
      </main>
    </div>
  );
}
