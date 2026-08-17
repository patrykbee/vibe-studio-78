import { createFileRoute, Link } from "@tanstack/react-router";
import { ChevronLeft, Send, Loader2 } from "lucide-react";
import { BottomNav } from "@/components/BottomNav";

export const Route = createFileRoute("/_authenticated/tag/$tag")({
  head: ({ params }) => ({
    meta: [
      { title: `#${params.tag} — tapes` },
      { name: "description", content: `Browse tapes tagged #${params.tag} and post your own video to the spot.` },
      { property: "og:title", content: `#${params.tag} — tapes` },
      { property: "og:description", content: `Browse tapes tagged #${params.tag} and post your own video to the spot.` },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: TagPage,
});

const TAPES_GRADIENT =
  "linear-gradient(170deg, #ff2e93 0%, #ff4fa3 35%, #d95bd0 65%, #b26bff 100%)";

function TagPage() {
  const { tag } = Route.useParams();

  return (
    <div className="fixed inset-0 flex flex-col" style={{ background: TAPES_GRADIENT }}>
      <div className="flex-1 overflow-y-auto">
        <div className="flex items-center justify-between px-4 pt-4 text-white">
          <Link to="/search" aria-label="Back" preload="render" className="p-1 transition-transform active:scale-90">
            <ChevronLeft className="h-8 w-8" strokeWidth={3} />
          </Link>
          <h1 className="text-2xl font-bold">#{tag}</h1>
          <button aria-label="Share" className="p-1 transition-transform active:scale-90">
            <Send className="h-7 w-7" />
          </button>
        </div>

        <p className="px-6 pt-3 text-center text-lg text-white/95">
          Create a spot with the Tapes 2026 vibe :)
        </p>

        <div className="flex justify-center pt-5">
          <button className="rounded-full bg-[#ffd400] px-10 py-3 text-xl font-semibold text-black shadow-[0_0_20px_rgba(255,212,0,0.4)] transition-transform active:scale-95">
            post video
          </button>
        </div>

        <div className="flex flex-col items-center justify-center py-24 text-white/85">
          <Loader2 className="h-12 w-12 animate-spin" strokeWidth={2.5} />
        </div>
      </div>

      <BottomNav active="search" />
    </div>
  );
}
