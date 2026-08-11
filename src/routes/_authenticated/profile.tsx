import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowLeft, Settings, UserPlus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated/profile")({
  head: () => ({
    meta: [
      { title: "Profile — tapes" },
      { name: "description", content: "Your tapes profile: followers, fans and likes." },
      { property: "og:title", content: "Profile — tapes" },
      { property: "og:description", content: "Your tapes profile: followers, fans and likes." },
    ],
  }),
  component: ProfilePage,
});

function ProfilePage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState<string>("");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const { data: userRes } = await supabase.auth.getUser();
      const id = userRes.user?.id;
      if (!id) return;
      const { data } = await supabase.from("profiles").select("username").eq("id", id).maybeSingle();
      if (!cancelled) setUsername(data?.username ?? "");
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
    navigate({ to: "/" });
  };

  return (
    <div
      className="fixed inset-0 overflow-y-auto text-white"
      style={{
        background:
          "linear-gradient(160deg, #ff2e93 0%, #ff4fa3 30%, #ff7ad9 55%, #b26bff 100%)",
      }}
    >
      {/* Top bar */}
      <div className="flex items-center justify-between px-4 pt-4">
        <button onClick={() => navigate({ to: "/feed" })} aria-label="Back to feed" className="p-1">
          <ArrowLeft className="h-7 w-7" />
        </button>
        <h1 className="text-lg font-semibold">{username || "Your Name"}</h1>
        <button onClick={signOut} aria-label="Settings" className="p-1">
          <Settings className="h-7 w-7" />
        </button>
      </div>

      <div className="flex flex-col items-center px-6 pb-16 pt-6">
        {/* Avatar */}
        <div className="relative h-28 w-28 overflow-hidden rounded-full bg-black/30 ring-2 ring-white/50">
          <div className="flex h-full w-full items-center justify-center text-4xl">😊</div>
          <button
            aria-label="Add friends"
            className="absolute -right-1 -bottom-1 rounded-full bg-[#ffd400] p-1.5 text-black"
          >
            <UserPlus className="h-4 w-4" />
          </button>
        </div>

        <p className="mt-3 text-base font-medium">@{username || "yourname"}</p>
        <p className="mt-3 text-sm text-white/85">"nagrywaj z pasji, żyj z Tapes"</p>

        {/* Stats */}
        <div className="mt-5 flex w-full max-w-xs items-center justify-around">
          {[
            { value: 0, label: "following" },
            { value: 0, label: "fans" },
            { value: 0, label: "likes" },
          ].map((s) => (
            <div key={s.label} className="flex flex-col items-center">
              <span className="text-xl font-semibold">{s.value}</span>
              <span className="text-sm text-white/85">{s.label}</span>
            </div>
          ))}
        </div>

        <button className="mt-6 rounded-full border-2 border-white px-8 py-2.5 text-lg font-semibold">
          edit profile
        </button>

        <p className="mt-24 text-base text-white/85">no tapes yet</p>
      </div>
    </div>
  );
}
