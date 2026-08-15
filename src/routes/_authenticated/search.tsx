import { createFileRoute } from "@tanstack/react-router";
import { Flame, Search, Trophy, UserPlus, Disc3 } from "lucide-react";
import { BottomNav } from "@/components/BottomNav";

export const Route = createFileRoute("/_authenticated/search")({
  head: () => ({
    meta: [
      { title: "Discover — tapes" },
      { name: "description", content: "Discover popular tapes, song charts, leaderboard, categories and trending tags." },
      { property: "og:title", content: "Discover — tapes" },
      { property: "og:description", content: "Discover popular tapes, song charts, leaderboard, categories and trending tags." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: SearchPage,
});

const TAPES_GRADIENT =
  "linear-gradient(100deg, #ff2e93 0%, #ff4fa3 40%, #ff7ad9 70%, #b26bff 100%)";

function SearchPage() {
  return (
    <div className="fixed inset-0 flex flex-col bg-background">
      {/* Search bar */}
      <div className="flex items-center gap-3 px-3 py-3 text-white" style={{ background: TAPES_GRADIENT }}>
        <div className="flex flex-1 items-center gap-2 rounded-md bg-white/15 px-3 py-2">
          <Search className="h-5 w-5" />
          <input
            aria-label="Search"
            placeholder="search"
            className="w-full bg-transparent text-lg outline-none placeholder:text-white/85"
          />
        </div>
        <button aria-label="Find friends" className="p-1 transition-transform active:scale-90">
          <UserPlus className="h-6 w-6" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        {/* Contest banner */}
        <div
          className="flex h-52 flex-col items-center justify-center gap-3"
          style={{ background: "linear-gradient(160deg, #2a0b2e 0%, #7a1350 55%, #b26bff 100%)" }}
        >
          <span className="rounded bg-[#ff2e93] px-3 py-1 text-sm font-semibold text-white">contest</span>
          <h1 className="text-3xl font-bold text-white">#Tapes2026</h1>
          <button className="rounded-full border-2 border-white px-8 py-2 text-lg font-semibold text-white transition-transform active:scale-95">
            details
          </button>
        </div>

        {/* Shortcuts */}
        <div className="grid grid-cols-3 divide-x divide-border bg-background py-6">
          {[
            { icon: <Flame className="h-9 w-9 text-[#ff2e93]" />, label: "popular" },
            { icon: <Disc3 className="h-9 w-9 text-foreground" />, label: "song chart" },
            { icon: <Trophy className="h-9 w-9 text-[#b26bff]" />, label: "leaderboard" },
          ].map((s) => (
            <button key={s.label} className="flex flex-col items-center gap-3 transition-transform active:scale-95">
              {s.icon}
              <span className="text-base font-semibold text-foreground">{s.label}</span>
            </button>
          ))}
        </div>

        <div className="bg-muted py-3 text-center text-lg text-muted-foreground">categories</div>
        <div className="h-40 bg-background" />
        <div className="bg-muted py-3 text-center text-lg text-muted-foreground">trending tags</div>
        <div className="h-40 bg-muted" />
      </div>

      <BottomNav active="search" />
    </div>
  );
}
