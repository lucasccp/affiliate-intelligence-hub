import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { communitySchema, profileSchema, workspaceSchema } from "./hub-schema";
import type { Json } from "@/integrations/supabase/types";

const idSchema = z.object({ id: z.uuid() });
function dbError(error: { code?: string; message: string } | null) {
  if (!error) return;
  if (error.code === "23505") throw new Error("Já existe uma comunidade com esse slug neste workspace.");
  if (error.code === "42501") throw new Error("Você não tem permissão para esta alteração.");
  throw new Error("Não foi possível concluir a operação. Tente novamente.");
}
export const getHub = createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).handler(async ({ context }) => {
  const { supabase, userId } = context;
  const profileResult = await supabase.from("profiles").select("*").eq("id", userId).single();
  dbError(profileResult.error);
  const membershipResult = await supabase.from("workspace_members").select("workspace_id,role").eq("user_id", userId).order("created_at").limit(1).single();
  dbError(membershipResult.error);
  if (!membershipResult.data || !profileResult.data) throw new Error("Seu workspace ainda não está disponível.");
  const workspaceId = membershipResult.data.workspace_id;
  const [workspaceResult, communitiesResult, countResult, activeResult, logsResult] = await Promise.all([
    supabase.from("workspaces").select("*").eq("id", workspaceId).single(),
    supabase.from("communities").select("*,community_categories(name),marketplace_connections(name,status),channels(name,status)").eq("workspace_id", workspaceId).order("created_at", { ascending: false }).limit(1000),
    supabase.from("communities").select("id", { head: true, count: "exact" }).eq("workspace_id", workspaceId),
    supabase.from("communities").select("id", { head: true, count: "exact" }).eq("workspace_id", workspaceId).eq("status", "active"),
    supabase.from("audit_logs").select("*").eq("workspace_id", workspaceId).order("created_at", { ascending: false }).limit(5),
  ]);
  for (const result of [workspaceResult, communitiesResult, countResult, activeResult, logsResult]) dbError(result.error);
  if (!workspaceResult.data) throw new Error("Workspace não encontrado.");
  return { profile: profileResult.data, workspace: workspaceResult.data, role: membershipResult.data.role,
    communities: communitiesResult.data ?? [], communityCount: countResult.count ?? 0, activeCount: activeResult.count ?? 0,
    logs: logsResult.data ?? [], userId };
});
export type HubData = Awaited<ReturnType<typeof getHub>>;
export type Community = HubData["communities"][number];
export const getCommunityPage = createServerFn({ method: "GET" }).middleware([requireSupabaseAuth])
  .inputValidator((value) => z.object({ workspaceId: z.uuid(), communityId: z.uuid().nullable().default(null), search: z.string().max(100).default(""), status: z.enum(["all", "draft", "configuring", "ready", "active", "paused", "archived"]).default("all"), page: z.number().int().min(0).default(0) }).parse(value))
  .handler(async ({ data, context }) => {
    let query = context.supabase.from("communities").select("*,community_categories(name),marketplace_connections(name,status),channels(name,status)", { count: "exact" }).eq("workspace_id", data.workspaceId);
    if (data.communityId) query = query.eq("id", data.communityId);
    const safeSearch = data.search.replace(/[%_,()]/g, " ").trim();
    if (safeSearch) query = query.or(`name.ilike.%${safeSearch}%,niche.ilike.%${safeSearch}%`);
    if (data.status !== "all") query = query.eq("status", data.status);
    const result = await query.order("created_at", { ascending: false }).range(data.page * 8, data.page * 8 + 7);
    dbError(result.error);
    return { rows: result.data ?? [], total: result.count ?? 0 };
  });
export const saveCommunity = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth])
  .inputValidator((value) => z.object({ workspaceId: z.uuid(), id: z.uuid().nullable(), community: communitySchema }).parse(value))
  .handler(async ({ data, context }) => {
    const limit = await context.supabase.from("workspaces").select("daily_offer_limit").eq("id", data.workspaceId).single();
    dbError(limit.error);
    if (!limit.data || data.community.daily_offer_limit > limit.data.daily_offer_limit) throw new Error("O limite da comunidade excede o limite diário do workspace.");
    const result = await context.supabase.rpc("save_community", { _workspace: data.workspaceId, _id: data.id as string, _data: data.community as Json });
    dbError(result.error); return { id: result.data };
  });
export const deleteCommunity = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth])
  .inputValidator((value) => idSchema.parse(value)).handler(async ({ data, context }) => {
    const result = await context.supabase.from("communities").delete().eq("id", data.id).select("id").single();
    dbError(result.error); return { deleted: true };
  });
export const updateProfile = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth])
  .inputValidator((value) => profileSchema.parse(value)).handler(async ({ data, context }) => {
    const result = await context.supabase.from("profiles").update(data).eq("id", context.userId).select("id").single();
    dbError(result.error); return { saved: true };
  });
export const updateWorkspace = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth])
  .inputValidator((value) => z.object({ id: z.uuid(), values: workspaceSchema }).parse(value)).handler(async ({ data, context }) => {
    const maxResult = await context.supabase.from("communities").select("daily_offer_limit").eq("workspace_id", data.id).order("daily_offer_limit", { ascending: false }).limit(1);
    dbError(maxResult.error);
    const highest = maxResult.data?.[0]?.daily_offer_limit ?? 0;
    if (data.values.daily_offer_limit < highest) throw new Error(`O limite deve ser pelo menos ${highest}, conforme suas comunidades.`);
    const result = await context.supabase.from("workspaces").update(data.values).eq("id", data.id).select("id").single();
    dbError(result.error); return { saved: true };
  });