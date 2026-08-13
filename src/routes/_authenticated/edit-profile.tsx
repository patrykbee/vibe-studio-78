import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/edit-profile")({
  head: () => ({
    meta: [
      { title: "Edit profile — tapes" },
      { name: "description", content: "Edit your tapes profile: username, name, Instagram ID and bio." },
      { property: "og:title", content: "Edit profile — tapes" },
      { property: "og:description", content: "Edit your tapes profile: username, name, Instagram ID and bio." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: EditProfilePage,
});

const TAPES_GRADIENT =
  "linear-gradient(100deg, #ff2e93 0%, #ff4fa3 40%, #ff7ad9 70%, #b26bff 100%)";

function Field({
  label,
  value,
  onChange,
  placeholder,
  multiline,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  multiline?: boolean;
}) {
  return (
    <div>
      <div className="bg-muted px-4 py-2 text-sm text-muted-foreground">{label}</div>
      <div className="bg-background px-4">
        {multiline ? (
          <textarea
            aria-label={label}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            rows={3}
            className="w-full resize-none bg-transparent py-3 text-lg text-foreground outline-none placeholder:text-muted-foreground"
          />
        ) : (
          <input
            aria-label={label}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="w-full bg-transparent py-3 text-lg text-foreground outline-none placeholder:text-muted-foreground"
          />
        )}
      </div>
    </div>
  );
}

function EditProfilePage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [username, setUsername] = useState("");
  const [fullName, setFullName] = useState("");
  const [instagram, setInstagram] = useState("");
  const [bio, setBio] = useState("");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const { data: userRes } = await supabase.auth.getUser();
      const id = userRes.user?.id;
      if (!id) return;
      const { data } = await supabase
        .from("profiles")
        .select("username, full_name, instagram_id, bio")
        .eq("id", id)
        .maybeSingle();
      if (cancelled) return;
      setUsername(data?.username ?? "");
      setFullName(data?.full_name ?? "");
      setInstagram(data?.instagram_id ?? "");
      setBio(data?.bio ?? "");
      setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const save = async () => {
    if (!username.trim()) {
      toast.error("Username can't be empty");
      return;
    }
    setSaving(true);
    const { data: userRes } = await supabase.auth.getUser();
    const id = userRes.user?.id;
    if (!id) return;
    const { error } = await supabase
      .from("profiles")
      .update({
        username: username.trim(),
        full_name: fullName.trim() || null,
        instagram_id: instagram.trim() || null,
        bio: bio.trim() || null,
      })
      .eq("id", id);
    setSaving(false);
    if (error) {
      toast.error(error.message.includes("duplicate") ? "Username already taken" : error.message);
      return;
    }
    navigate({ to: "/profile" });
  };

  return (
    <div className="fixed inset-0 flex flex-col bg-muted">
      {/* Header */}
      <div
        className="flex items-center justify-between px-4 py-4 text-white"
        style={{ background: TAPES_GRADIENT }}
      >
        <button onClick={() => navigate({ to: "/profile" })} aria-label="Close" className="p-1">
          <X className="h-7 w-7" />
        </button>
        <h1 className="text-lg font-semibold">edit profile</h1>
        <button onClick={save} disabled={saving || loading} className="p-1 text-lg disabled:opacity-60">
          Done
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        {/* Avatar */}
        <div className="flex justify-center py-8">
          <div className="flex h-32 w-32 items-center justify-center rounded-full bg-background text-6xl">
            😊
          </div>
        </div>

        <Field label="musername" value={username} onChange={setUsername} placeholder="username" />
        <Field label="full name" value={fullName} onChange={setFullName} placeholder="full name" />
        <Field label="instagram ID" value={instagram} onChange={setInstagram} placeholder="instagram" />
        <div className="mt-4">
          <Field
            label="short bio"
            value={bio}
            onChange={setBio}
            placeholder='"nagrywaj z pasji, żyj z Tapes"'
            multiline
          />
        </div>
      </div>
    </div>
  );
}
