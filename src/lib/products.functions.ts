import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export type ProductDTO = {
  id: string;
  title: string;
  description: string;
  price: number;
  image: string;
  category: string;
  stock: number;
  rating: number;
  reviews_count: number;
  prime: boolean;
};

export const listProducts = createServerFn({ method: "GET" })
  .inputValidator((d: { q?: string; category?: string }) => d)
  .handler(async ({ data }): Promise<ProductDTO[]> => {
    let q = supabaseAdmin.from("products").select("*").order("created_at", { ascending: true });
    if (data.category) q = q.eq("category", data.category);
    if (data.q) q = q.ilike("title", `%${data.q}%`);
    const { data: rows, error } = await q;
    if (error) throw new Error(error.message);
    return (rows ?? []).map((r: any) => ({ ...r, price: Number(r.price), rating: Number(r.rating) }));
  });

export const getProduct = createServerFn({ method: "GET" })
  .inputValidator((d: { id: string }) => d)
  .handler(async ({ data }): Promise<ProductDTO | null> => {
    const { data: row, error } = await supabaseAdmin
      .from("products")
      .select("*")
      .eq("id", data.id)
      .maybeSingle();
    if (error) throw new Error(error.message);
    if (!row) return null;
    return { ...(row as any), price: Number(row.price), rating: Number(row.rating) };
  });

export const getProductsByIds = createServerFn({ method: "POST" })
  .inputValidator((d: { ids: string[] }) => d)
  .handler(async ({ data }): Promise<ProductDTO[]> => {
    if (!data.ids.length) return [];
    const { data: rows, error } = await supabaseAdmin
      .from("products")
      .select("*")
      .in("id", data.ids);
    if (error) throw new Error(error.message);
    return (rows ?? []).map((r: any) => ({ ...r, price: Number(r.price), rating: Number(r.rating) }));
  });

const productInput = z.object({
  title: z.string().min(1).max(300),
  description: z.string().max(5000).default(""),
  price: z.number().min(0),
  image: z.string().max(2000).default(""),
  category: z.string().min(1).max(100),
  stock: z.number().int().min(0).default(100),
  prime: z.boolean().default(true),
});

async function assertAdmin(supabase: any, userId: string) {
  const { data } = await supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", userId)
    .eq("role", "admin")
    .maybeSingle();
  if (!data) throw new Error("Admin only");
}

export const createProduct = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d) => productInput.parse(d))
  .handler(async ({ data, context }) => {
    await assertAdmin(context.supabase, context.userId);
    const { data: row, error } = await supabaseAdmin
      .from("products")
      .insert(data)
      .select()
      .single();
    if (error) throw new Error(error.message);
    return row;
  });

export const updateProduct = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d) => z.object({ id: z.string().uuid() }).merge(productInput).parse(d))
  .handler(async ({ data, context }) => {
    await assertAdmin(context.supabase, context.userId);
    const { id, ...rest } = data;
    const { error } = await supabaseAdmin.from("products").update(rest).eq("id", id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const deleteProduct = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d) => z.object({ id: z.string().uuid() }).parse(d))
  .handler(async ({ data, context }) => {
    await assertAdmin(context.supabase, context.userId);
    const { error } = await supabaseAdmin.from("products").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });
