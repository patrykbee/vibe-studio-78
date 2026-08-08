import { supabase } from "@/integrations/supabase/client";

export async function resolveEmailByUsername(username: string): Promise<string | null> {
  const { data, error } = await supabase.rpc("email_for_username", {
    _username: username.trim(),
  });
  if (error) throw new Error(error.message);
  return (data as string | null) ?? null;
}
