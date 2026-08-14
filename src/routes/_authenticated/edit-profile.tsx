import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Camera, Loader2, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { myProfileQueryOptions, useMyProfile } from "@/hooks/useProfile";
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
  const [avatarPath, setAvatarPath] = useState<string | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const loadSignedUrl = async (path: string) => {
    const { data } = await supabase.storage.from("avatars").createSignedUrl(path, 3600);
    setAvatarUrl(data?.signedUrl ?? null);
  };

  const onPickFile = async (file: File) => {
    const { data: userRes } = await supabase.auth.getUser();
    const id = userRes.user?.id;
    if (!id) return;
    setUploading(true);
    const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
    const path = `${id}/avatar-${Date.now()}.${ext}`;
    const { error: upErr } = await supabase.storage
      .from("avatars")
      .upload(path, file, { upsert: true, contentType: file.type });
    if (upErr) {
      setUploading(false);
      toast.error(upErr.message);
      return;
    }
    const { error } = await supabase.from("profiles").update({ avatar_url: path }).eq("id", id);
    setUploading(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    setAvatarPath(path);
    await loadSignedUrl(path);
    toast.success("Profile photo updated");
  };

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const { data: userRes } = await supabase.auth.getUser();
      const id = userRes.user?.id;
      if (!id) return;
      const { data } = await supabase
        .from("profiles")
        .select("username, full_name, instagram_id, bio, avatar_url")
        .eq("id", id)
        .maybeSingle();
      if (cancelled) return;
      setUsername(data?.username ?? "");
      setFullName(data?.full_name ?? "");
      setInstagram(data?.instagram_id ?? "");
      setBio(data?.bio ?? "");
      setAvatarPath(data?.avatar_url ?? null);
      setLoading(false);
      if (data?.avatar_url) void loadSignedUrl(data.avatar_url);
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
        <Link to="/profile" preload="render" aria-label="Close" className="p-1 transition-transform active:scale-90">
          <X className="h-7 w-7" />
        </Link>
        <h1 className="text-lg font-semibold">edit profile</h1>
        <button onClick={save} disabled={saving || loading} className="p-1 text-lg disabled:opacity-60">
          Done
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        {/* Avatar */}
        <div className="flex justify-center py-8">
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            aria-label="Change profile photo"
            className="relative h-32 w-32 overflow-hidden rounded-full bg-background transition-transform active:scale-95"
          >
            {avatarUrl ? (
              <img src={avatarUrl} alt="Your profile photo" className="h-full w-full object-cover" />
            ) : (
              <span className="flex h-full w-full items-center justify-center text-6xl">😊</span>
            )}
            <span className="absolute inset-x-0 bottom-0 flex items-center justify-center gap-1 bg-black/50 py-1.5 text-xs text-white">
              {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Camera className="h-4 w-4" />}
              {uploading ? "uploading" : "change"}
            </span>
          </button>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              e.target.value = "";
              if (f) void onPickFile(f);
            }}
          />
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
