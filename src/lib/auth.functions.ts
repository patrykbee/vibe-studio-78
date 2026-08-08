import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const inputSchema = z.object({
  username: z
    .string()
    .trim()
    .min(1)
    .max(50)
    .regex(/^[a-zA-Z0-9_.]+$/),
});

export const resolveEmailByUsername = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => inputSchema.parse(data))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const { data: profile, error: profileError } = await supabaseAdmin
      .from("profiles")
      .select("id")
      .ilike("username", data.username)
      .maybeSingle();

    if (profileError) throw new Error(profileError.message);
    if (!profile) return { email: null as string | null };

    const { data: userRes, error: userError } = await supabaseAdmin.auth.admin.getUserById(
      profile.id,
    );
    if (userError) throw new Error(userError.message);
    return { email: userRes.user?.email ?? null };
  });
