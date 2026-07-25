import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import logo from "@/assets/logo_tapes.png.asset.json";
import video from "@/assets/homeVideo.mp4.asset.json";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "tapes — nagrywaj z pasji" },
      { name: "description", content: "Dołącz do tapes. Nagrywaj z pasji, żyj z Tapes." },
      { property: "og:title", content: "tapes — nagrywaj z pasji" },
      { property: "og:description", content: "Dołącz do tapes. Nagrywaj z pasji, żyj z Tapes." },
    ],
  }),
  component: Index,
});

function Index() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [needsUnmute, setNeedsUnmute] = useState(false);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = false;
    v.volume = 1;
    v.play()
      .then(() => setNeedsUnmute(false))
      .catch(() => {
        // Browser blocked autoplay with sound — fall back to muted playback
        v.muted = true;
        v.play().catch(() => {});
        setNeedsUnmute(true);
      });
  }, []);

  const enableSound = () => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = false;
    v.volume = 1;
    v.play().catch(() => {});
    setNeedsUnmute(false);
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-black">
      <video
        ref={videoRef}
        src={video.url}
        autoPlay
        loop
        playsInline
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-black/30" />

      <div className="relative z-10 flex min-h-screen flex-col justify-end px-6 pb-8">
        <div className="mb-8 flex justify-center">
          <img src={logo.url} alt="tapes" className="h-72 w-auto object-contain" />
        </div>

        <button className="mb-3 w-full rounded-md bg-[#ff2e93] py-4 text-xl font-medium text-white shadow-[0_0_20px_rgba(255,46,147,0.7)] transition-opacity hover:opacity-90">
          sign up
        </button>
        <button className="w-full rounded-md border-2 border-white bg-transparent py-4 text-xl font-medium text-white transition-colors hover:bg-white/10">
          log in
        </button>

        <p className="mt-6 text-center text-xs text-white/90">
          by signing up, you agree to the <span className="font-semibold">Terms of Use</span> &{" "}
          <span className="font-semibold">Privacy Policy</span>.
        </p>
      </div>

      {needsUnmute && (
        <button
          onClick={enableSound}
          className="absolute right-4 top-4 z-20 rounded-full bg-black/60 px-4 py-2 text-sm font-medium text-white backdrop-blur-sm"
        >
          🔊 włącz dźwięk
        </button>
      )}
    </div>
  );
}
