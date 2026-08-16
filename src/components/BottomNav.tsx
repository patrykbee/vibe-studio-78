import { Link } from "@tanstack/react-router";
import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Home, Search, Plus, Zap, User } from "lucide-react";
import { myProfileQueryOptions } from "@/hooks/useProfile";

export function BottomNav({ active }: { active?: "home" | "search" | "activity" | "profile" }) {
  const queryClient = useQueryClient();

  useEffect(() => {
    void queryClient.prefetchQuery(myProfileQueryOptions);
  }, [queryClient]);

  return (
    <nav className="z-20 flex items-center justify-around border-t border-white/10 bg-black px-2 pb-[env(safe-area-inset-bottom)] pt-2">

      <Link
        to="/feed"
        aria-label="Home"
        className={active === "home" ? "p-3 text-white" : "p-3 text-white/80"}
      >
        <Home className="h-6 w-6" />
      </Link>
      <Link
        to="/search"
        aria-label="Search"
        className={active === "search" ? "p-3 text-white" : "p-3 text-white/80"}
      >
        <Search className="h-6 w-6" />
      </Link>
      <button
        aria-label="Create"
        className="rounded-full bg-[#ffd400] p-3 text-black shadow-[0_0_20px_rgba(255,212,0,0.5)]"
      >
        <Plus className="h-6 w-6" strokeWidth={3} />
      </button>
      <Link
        to="/notifications"
        aria-label="Activity"
        className={active === "activity" ? "p-3 text-white" : "p-3 text-white/80"}
      >
        <Zap className="h-6 w-6" />
      </Link>
      <Link
        to="/profile"
        aria-label="Profile"
        className={active === "profile" ? "p-3 text-white" : "p-3 text-white/80"}
      >
        <User className="h-6 w-6" />
      </Link>
    </nav>
  );
}
