import { createFileRoute } from "@tanstack/react-router";
import { Inbox, Bell } from "lucide-react";
import { BottomNav } from "@/components/BottomNav";

export const Route = createFileRoute("/_authenticated/notifications")({
  head: () => ({
    meta: [
      { title: "Notifications — tapes" },
      { name: "description", content: "Your tapes activity: likes, comments, followers and messages." },
      { property: "og:title", content: "Notifications — tapes" },
      { property: "og:description", content: "Your tapes activity: likes, comments, followers and messages." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: NotificationsPage,
});

const TAPES_GRADIENT =
  "linear-gradient(100deg, #ff2e93 0%, #ff4fa3 40%, #ff7ad9 70%, #b26bff 100%)";

function NotificationsPage() {
  return (
    <div className="fixed inset-0 flex flex-col bg-background">
      <header
        className="flex items-center justify-between px-4 py-4 text-white"
        style={{ background: TAPES_GRADIENT }}
      >
        <span className="w-6" />
        <h1 className="text-2xl font-bold">notifications</h1>
        <button aria-label="Inbox" className="p-1 transition-transform active:scale-90">
          <Inbox className="h-6 w-6" />
        </button>
      </header>

      <div className="flex flex-1 flex-col items-center justify-center gap-3 px-8 text-center">
        <Bell className="h-12 w-12 text-muted-foreground" />
        <p className="text-lg font-semibold text-foreground">No notifications yet</p>
        <p className="text-sm text-muted-foreground">
          Likes, comments and new followers will show up here.
        </p>
      </div>

      <BottomNav active="activity" />
    </div>
  );
}
