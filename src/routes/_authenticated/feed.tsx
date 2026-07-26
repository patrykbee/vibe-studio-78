import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Home, Search, Plus, Zap, User, Heart, MessageCircle, MoreHorizontal, Music } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import video from "@/assets/homeVideo.mp4.asset.json";

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

type Clip = {
  id: number;
  username: string;
  caption: string;
  song: string;
  likes: number;
  comments: number;
  videoUrl: string;
};

const CLIPS: Clip[] = [
  {
    id: 1,
    username: "lianev",
    caption: "#HeyNowChallenge lianevvvv heyyy",
    song: "original sound - indra_muser993",
    likes: 8,
    comments: 0,
    videoUrl: video.url,
  },
  {
    id: 2,
    username: "tapes_official",
    caption: "nagrywaj z pasji 🎬",
    song: "original sound - tapes",
    likes: 124,
    comments: 12,
    videoUrl: video.url,
  },
  {
    id: 3,
    username: "user_demo",
    caption: "#tapes #fyp",
    song: "trending sound - demo",
    likes: 42,
    comments: 3,
    videoUrl: video.url,
  },
];

function FeedPage() {
  const navigate = useNavigate();
  const [tab, setTab] = useState<"feed" | "mycity">("feed");
  const [active, setActive] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const [liked, setLiked] = useState<Record<number, boolean>>({});

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const onScroll = () => {
      const i = Math.round(el.scrollTop / el.clientHeight);
      setActive(i);
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
    navigate({ to: "/" });
  };

  return (
    <div className="fixed inset-0 flex flex-col bg-black text-white">
      {/* Top tabs */}
      <div className="pointer-events-none absolute inset-x-0 top-0 z-20 flex flex-col items-center pt-3">
        <div className="mb-2 h-[3px] w-16 rounded-full bg-white/80" />
        <div className="pointer-events-auto flex items-center gap-8 text-lg font-semibold">
          <button
            onClick={() => setTab("feed")}
            className={tab === "feed" ? "text-white" : "text-white/60"}
          >
            feed
          </button>
          <button
            onClick={() => setTab("mycity")}
            className={tab === "mycity" ? "text-white" : "text-white/60"}
          >
            my city
          </button>
        </div>
      </div>

      {/* Vertical snap feed */}
      <div
        ref={containerRef}
        className="flex-1 snap-y snap-mandatory overflow-y-scroll"
      >
        {CLIPS.map((clip, i) => (
          <ClipView
            key={clip.id}
            clip={clip}
            isActive={i === active}
            liked={!!liked[clip.id]}
            onToggleLike={() =>
              setLiked((prev) => ({ ...prev, [clip.id]: !prev[clip.id] }))
            }
          />
        ))}
      </div>

      {/* Bottom nav */}
      <nav className="z-20 flex items-center justify-around border-t border-white/10 bg-black px-2 pb-[env(safe-area-inset-bottom)] pt-2">
        <button className="p-3 text-white">
          <Home className="h-6 w-6" />
        </button>
        <button className="p-3 text-white/80">
          <Search className="h-6 w-6" />
        </button>
        <button className="rounded-full bg-[#ffd400] p-3 text-black shadow-[0_0_20px_rgba(255,212,0,0.5)]">
          <Plus className="h-6 w-6" strokeWidth={3} />
        </button>
        <button className="p-3 text-white/80">
          <Zap className="h-6 w-6" />
        </button>
        <button onClick={signOut} className="p-3 text-white/80">
          <User className="h-6 w-6" />
        </button>
      </nav>
    </div>
  );
}

function ClipView({
  clip,
  isActive,
  liked,
  onToggleLike,
}: {
  clip: Clip;
  isActive: boolean;
  liked: boolean;
  onToggleLike: () => void;
}) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    if (isActive) {
      v.currentTime = 0;
      v.play().catch(() => {});
    } else {
      v.pause();
    }
  }, [isActive]);

  return (
    <section className="relative h-full w-full snap-start snap-always" style={{ height: "100%" }}>
      <div className="relative h-full w-full">
        <video
          ref={ref}
          src={clip.videoUrl}
          loop
          muted
          playsInline
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60" />

        {/* Right actions */}
        <div className="absolute right-3 bottom-28 z-10 flex flex-col items-center gap-5">
          <div className="flex flex-col items-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-2xl">
              😊
            </div>
          </div>
          <button onClick={onToggleLike} className="flex flex-col items-center">
            <div
              className={`flex h-12 w-12 items-center justify-center rounded-full ${
                liked ? "bg-[#ff2e93]" : "bg-[#ff2e93]"
              }`}
            >
              <Heart className="h-6 w-6 text-white" fill="white" />
            </div>
            <span className="mt-1 text-sm font-semibold text-white">
              {clip.likes + (liked ? 1 : 0)}
            </span>
          </button>
          <button className="flex flex-col items-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white">
              <MessageCircle className="h-6 w-6 text-black" />
            </div>
            <span className="mt-1 text-sm font-semibold text-white">{clip.comments}</span>
          </button>
          <button className="flex flex-col items-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white">
              <MoreHorizontal className="h-6 w-6 text-black" />
            </div>
          </button>
          <div className="mt-2 flex h-12 w-12 items-center justify-center rounded-full bg-black ring-2 ring-white/40">
            <div className="h-3 w-3 rounded-full bg-[#ffd400]" />
          </div>
        </div>

        {/* Bottom caption */}
        <div className="absolute inset-x-0 bottom-4 z-10 px-4">
          <span className="inline-block rounded-sm bg-[#ff2e93] px-2 py-1 text-sm font-semibold text-white">
            featured
          </span>
          <p className="mt-2 pr-24 text-base font-medium text-white">{clip.caption}</p>
          <div className="mt-1 flex items-center gap-2 pr-24 text-sm text-white/90">
            <Music className="h-3.5 w-3.5" />
            <span className="truncate">{clip.song}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
