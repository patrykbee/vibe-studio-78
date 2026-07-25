import { createFileRoute } from "@tanstack/react-router";
import logo from "@/assets/logo_tapes.png.asset.json";

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
  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-black">
      <div className="relative z-10 flex min-h-screen flex-col justify-end px-6 pb-8">
        <div className="mb-6 flex justify-center">
          <img src={logo.url} alt="tapes" className="h-48 w-auto object-contain" />
        </div>
        <p className="mb-8 text-center text-lg text-white/95">
          nagrywaj z pasji, żyj z Tapes
        </p>

        <button className="mb-3 w-full rounded-md bg-[#2dd4bf] py-4 text-xl font-medium text-white transition-opacity hover:opacity-90">
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
    </div>
  );
}
