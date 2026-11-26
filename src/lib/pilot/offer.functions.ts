import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { manualOfferSchema } from "./offer";

const scope = z.object({ workspaceId: z.uuid(), communityId: z.uuid() });
const identity = z.object({ id: z.uuid() });
const approval = identity.extend({ version: z.number().int().positive().max(2147483647) });

function check(error: { code?: string } | null) {
  if (!error) return;
  if (error.code === "42501") throw new Error("Você não tem permissão para esta operação.");
  if (error.code === "22023")
    throw new Error("A revisão mudou ou a oferta não está aprovada e vigente.");
  throw new Error("Não foi possível concluir a operação.");
}

export const listPilotOffers = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .validator(scope)
  .handler(async ({ data, context }) => {
    const offers = await context.supabase
      .from("pilot_offers")
      .select("id,current_version,approved_version")
      .eq("workspace_id", data.workspaceId)
      .eq("community_id", data.communityId)
      .order("created_at", { ascending: false })
      .limit(50);
    check(offers.error);
    const rows = offers.data ?? [];
    if (rows.length === 0) return [];

    const revisions = await context.supabase
      .from("pilot_offer_revisions")
      .select("offer_id,version,name,source_url,price_cents,observed_at,expires_at,draft_text")
      .eq("workspace_id", data.workspaceId)
      .eq("community_id", data.communityId)
      .or(
        rows
          .map(({ id, current_version }) => `and(offer_id.eq.${id},version.eq.${current_version})`)
          .join(","),
      );
    check(revisions.error);
    const byOffer = new Map(revisions.data?.map((revision) => [revision.offer_id, revision]));
    return rows.flatMap((offer) => {
      const revision = byOffer.get(offer.id);
      return revision ? [{ ...offer, revision }] : [];
    });
  });

export const savePilotOffer = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator(scope.extend({ id: z.uuid().nullable(), offer: manualOfferSchema }))
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase.rpc("pilot_save_offer", {
      _workspace: data.workspaceId,
      _community: data.communityId,
      _offer: data.id as string,
      _data: data.offer,
    });
    check(error);
  });

export const approvePilotOffer = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator(approval)
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase.rpc("pilot_approve_offer", {
      _offer: data.id,
      _version: data.version,
    });
    check(error);
  });

export const exportPilotOffer = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator(identity)
  .handler(async ({ data, context }) => {
    const { data: revisions, error } = await context.supabase.rpc("pilot_export_offer", {
      _offer: data.id,
    });
    check(error);
    const revision = revisions?.[0];
    if (!revision) throw new Error("Oferta indisponível para exportação.");
    return { version: revision.version, text: revision.draft_text };
  });
