import { supabase } from "@/integrations/supabase/client";

export async function resolveEmailByUsername(username: string): Promise<string | null> {
  const { data, error } = await (
    supabase as unknown as {
      rpc: (
        fn: string,
        args: Record<string, unknown>,
      ) => Promise<{ data: unknown; error: { message: string } | null }>;
    }
  ).rpc("email_for_username", { _username: username.trim() });
  if (error) throw new Error(error.message);
  return (data as string | null) ?? null;
}
