import { queryOptions, useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export type ProfileData = {
  id: string;
  username: string;
  fullName: string;
  instagram: string;
  bio: string;
  avatarPath: string | null;
  avatarUrl: string | null;
};

async function fetchMyProfile(): Promise<ProfileData | null> {
  const { data: userRes } = await supabase.auth.getUser();
  const id = userRes.user?.id;
  if (!id) return null;

  const { data } = await supabase
    .from("profiles")
    .select("username, full_name, instagram_id, bio, avatar_url")
    .eq("id", id)
    .maybeSingle();

  let avatarUrl: string | null = null;
  if (data?.avatar_url) {
    const { data: signed } = await supabase.storage
      .from("avatars")
      .createSignedUrl(data.avatar_url, 3600);
    avatarUrl = signed?.signedUrl ?? null;
  }

  return {
    id,
    username: data?.username ?? "",
    fullName: data?.full_name ?? "",
    instagram: data?.instagram_id ?? "",
    bio: data?.bio ?? "",
    avatarPath: data?.avatar_url ?? null,
    avatarUrl,
  };
}

export const myProfileQueryOptions = queryOptions({
  queryKey: ["my-profile"],
  queryFn: fetchMyProfile,
  staleTime: 5 * 60 * 1000,
  gcTime: 30 * 60 * 1000,
});

export function useMyProfile() {
  return useQuery(myProfileQueryOptions);
}
