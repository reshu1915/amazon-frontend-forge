import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const addressInput = z.object({
  name: z.string().min(1).max(200),
  line1: z.string().min(1).max(300),
  line2: z.string().max(300).default(""),
  city: z.string().min(1).max(120),
  state: z.string().min(1).max(120),
  zip: z.string().min(1).max(20),
  country: z.string().min(1).max(120).default("United States"),
  phone: z.string().min(1).max(40),
  is_default: z.boolean().default(false),
});

export const listAddresses = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase
      .from("addresses")
      .select("*")
      .order("is_default", { ascending: false })
      .order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    return data;
  });

export const createAddress = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d) => addressInput.parse(d))
  .handler(async ({ data, context }) => {
    if (data.is_default) {
      await context.supabase
        .from("addresses")
        .update({ is_default: false })
        .eq("user_id", context.userId);
    }
    const { data: row, error } = await context.supabase
      .from("addresses")
      .insert({ ...data, user_id: context.userId })
      .select()
      .single();
    if (error) throw new Error(error.message);
    return row;
  });

export const deleteAddress = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d) => z.object({ id: z.string().uuid() }).parse(d))
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase.from("addresses").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });
