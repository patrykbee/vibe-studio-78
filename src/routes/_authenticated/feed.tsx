import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { BottomNav } from "@/components/BottomNav";

export const Route = createFileRoute("/_authenticated/feed")({
  head: () => ({
    meta: [
      { title: "Feed — tapes" },
      { name: "description", content: "Your tapes feed." },
      { property: "og:title", content: "Feed — tapes" },
      { property: "og:description", content: "Your tapes feed." },
    ],
  }),
  component: FeedPage,
});

function FeedPage() {
  const [tab, setTab] = useState<"feed" | "mycity">("feed");

  return (
    <div className="fixed inset-0 flex flex-col bg-black text-white">
      {/* Top tabs */}
      <div className="pointer-events-none absolute inset-x-0 top-0 z-20 flex justify-center pt-3">
        <div className="pointer-events-auto flex items-start gap-8 text-lg font-semibold">
          <button onClick={() => setTab("feed")} className="flex flex-col items-center">
            <span className={`mb-2 h-[3px] w-12 rounded-full ${tab === "feed" ? "bg-white" : "bg-white/30"}`} />
            <span className={tab === "feed" ? "text-white" : "text-white/60"}>feed</span>
          </button>
          <button onClick={() => setTab("mycity")} className="flex flex-col items-center">
            <span className={`mb-2 h-[3px] w-12 rounded-full ${tab === "mycity" ? "bg-white" : "bg-white/30"}`} />
            <span className={tab === "mycity" ? "text-white" : "text-white/60"}>my city</span>
          </button>
        </div>
      </div>

      {/* Empty feed */}
      <div className="flex flex-1 flex-col items-center justify-center px-8 text-center">
        <p className="text-lg font-semibold text-white">No tapes yet</p>
        <p className="mt-2 text-sm text-white/60">
          Videos will show up here as new users start posting.
        </p>
      </div>

      <BottomNav active="home" />
    </div>
  );
}
