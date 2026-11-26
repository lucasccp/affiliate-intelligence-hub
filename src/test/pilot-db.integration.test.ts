import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";

const url = process.env["SUPABASE_URL"];
const publicKey = process.env["SUPABASE_PUBLISHABLE_KEY"];
const adminKey = process.env["SUPABASE_SERVICE_ROLE_KEY"];
const enabled = Boolean(url && publicKey && adminKey);
function client(key: string) {
  if (!url) throw new Error("Integration environment unavailable");
  return createClient<Database>(url, key, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      storageKey: `pilot-${crypto.randomUUID()}`,
    },
    global: {
      fetch: (input, init) => {
        const headers = new Headers(init?.headers);
        if (headers.get("Authorization") === `Bearer ${key}` && key.startsWith("sb_"))
          headers.delete("Authorization");
        headers.set("apikey", key);
        return fetch(input, { ...init, headers });
      },
    },
  });
}
const hour = 3600_000;
const offer = (name: string, expiresInMs = 24 * hour) => ({
  name,
  sourceUrl: "https://example.com/produto",
  priceCents: 4990,
  observedAt: new Date(Date.now() - hour).toISOString(),
  expiresAt: new Date(Date.now() + expiresInMs).toISOString(),
});

describe.skipIf(!enabled)("Phase 2 pilot database chain", () => {
  let admin: SupabaseClient<Database>;
  let userA: SupabaseClient<Database>;
  let userB: SupabaseClient<Database>;
  const ids: string[] = [];
  let wsA = "";
  let wsB = "";
  let pilotA = "";
  let pilotB = "";
  let account = "";
  beforeAll(async () => {
    if (!adminKey || !publicKey) throw new Error("Integration environment unavailable");
    admin = client(adminKey);
    const users: SupabaseClient<Database>[] = [];
    for (let i = 0; i < 2; i++) {
      const email = `pilot-${crypto.randomUUID()}@example.com`;
      const password = `${crypto.randomUUID()}Aa7!`;
      const created = await admin.auth.admin.createUser({ email, password, email_confirm: true });
      if (created.error || !created.data.user) throw new Error("Failed to create test account");
      ids.push(created.data.user.id);
      const c = client(publicKey);
      const login = await c.auth.signInWithPassword({ email, password });
      if (login.error) throw new Error("Failed to sign in test account");
      users.push(c);
    }
    const [a, b] = users;
    if (!a || !b) throw new Error("Missing accounts");
    userA = a;
    userB = b;
    wsA = (await a.from("workspaces").select("id").single()).data?.id ?? "";
    wsB = (await b.from("workspaces").select("id").single()).data?.id ?? "";
    pilotA =
      (await a.from("communities").select("id").eq("slug", "garagem-de-ofertas").single()).data
        ?.id ?? "";
    pilotB =
      (await b.from("communities").select("id").eq("slug", "garagem-de-ofertas").single()).data
        ?.id ?? "";
    const snap = await admin.rpc("pilot_record_quota_snapshot", {
      _workspace: wsA,
      _provider: "simulated",
      _period: "2026-11-01",
      _allowance: 100,
      _margin: 10,
      _accounted: 0,
      _valid_until: new Date(Date.now() + hour).toISOString(),
    });
    if (snap.error || !snap.data) throw new Error("Snapshot failed");
    account = snap.data;
  }, 30000);
  afterAll(async () => {
    if (admin)
      for (const id of ids) expect((await admin.auth.admin.deleteUser(id)).error).toBeNull();
  });

  it("creates immutable revisions; edit after approval blocks export until reapproval", async () => {
    const created = await userA.rpc("pilot_save_offer", {
      _workspace: wsA,
      _community: pilotA,
      _offer: null as unknown as string,
      _data: offer("Cera"),
    });
    expect(created.error).toBeNull();
    const id = created.data ?? "";
    expect((await userA.rpc("pilot_export_offer", { _offer: id })).error).not.toBeNull();
    expect((await userA.rpc("pilot_approve_offer", { _offer: id, _version: 1 })).error).toBeNull();
    const exported = await userA.rpc("pilot_export_offer", { _offer: id });
    expect(exported.data?.[0]?.version).toBe(1);
    await userA.rpc("pilot_save_offer", {
      _workspace: wsA,
      _community: pilotA,
      _offer: id,
      _data: offer("Cera v2"),
    });
    expect((await userA.rpc("pilot_export_offer", { _offer: id })).error).not.toBeNull();
    expect(
      (await userA.rpc("pilot_approve_offer", { _offer: id, _version: 1 })).error,
    ).not.toBeNull();
    expect((await userA.rpc("pilot_approve_offer", { _offer: id, _version: 2 })).error).toBeNull();
    expect((await userA.rpc("pilot_export_offer", { _offer: id })).data?.[0]?.name).toBe("Cera v2");
    const revs = await userA.from("pilot_offer_revisions").select("version").eq("offer_id", id);
    expect(revs.data).toHaveLength(2);
    const tamper = await admin
      .from("pilot_offer_revisions")
      .update({ price_cents: 1 })
      .eq("offer_id", id);
    expect(tamper.error).not.toBeNull();
    const events = await userA.from("pilot_events").select("action,actor_id").eq("entity_id", id);
    expect(events.data?.filter((e) => e.action === "exported")).toHaveLength(2);
    expect(events.data?.every((e) => e.actor_id === ids[0])).toBe(true);
  });

  it("refuses export after expiry by database clock", async () => {
    const created = await userA.rpc("pilot_save_offer", {
      _workspace: wsA,
      _community: pilotA,
      _offer: null as unknown as string,
      _data: offer("Curta", 2000),
    });
    const id = created.data ?? "";
    await userA.rpc("pilot_approve_offer", { _offer: id, _version: 1 });
    await new Promise((r) => setTimeout(r, 2500));
    expect((await userA.rpc("pilot_export_offer", { _offer: id })).error).not.toBeNull();
  });

  it("blocks forging and cross-workspace access through the Data API", async () => {
    const created = await userA.rpc("pilot_save_offer", {
      _workspace: wsA,
      _community: pilotA,
      _offer: null as unknown as string,
      _data: offer("Privada"),
    });
    const id = created.data ?? "";
    expect(
      (await userA.from("pilot_offers").update({ approved_version: 1 }).eq("id", id).select())
        .data ?? [],
    ).toEqual([]);
    expect(
      (
        await userA
          .from("pilot_events")
          .insert({ workspace_id: wsA, action: "approved", entity_type: "offer" })
      ).error,
    ).not.toBeNull();
    expect(
      (
        await userA
          .from("pilot_quota_accounts")
          .update({ allowance: 999999 })
          .eq("id", account)
          .select()
      ).data ?? [],
    ).toEqual([]);
    expect(
      (
        await userA.rpc("pilot_record_quota_snapshot", {
          _workspace: wsA,
          _provider: "simulated",
          _period: "2026-11-01",
          _allowance: 9999,
          _margin: 0,
          _accounted: 0,
          _valid_until: new Date(Date.now() + hour).toISOString(),
        })
      ).error,
    ).not.toBeNull();
    expect((await userB.from("pilot_offers").select("id").eq("id", id)).data).toEqual([]);
    expect(
      (await userB.rpc("pilot_approve_offer", { _offer: id, _version: 1 })).error,
    ).not.toBeNull();
    expect((await userB.rpc("pilot_export_offer", { _offer: id })).error).not.toBeNull();
    expect(
      (
        await userA.rpc("pilot_save_offer", {
          _workspace: wsA,
          _community: pilotB,
          _offer: null as unknown as string,
          _data: offer("Cruzada"),
        })
      ).error,
    ).not.toBeNull();
    expect(
      (
        await userB.rpc("pilot_save_offer", {
          _workspace: wsA,
          _community: pilotA,
          _offer: null as unknown as string,
          _data: offer("Invasora"),
        })
      ).error,
    ).not.toBeNull();
    if (!publicKey) throw new Error("missing key");
    expect((await client(publicKey).from("pilot_offers").select("id")).data ?? []).toEqual([]);
  });

  it("runs idempotent jobs with atomic claim, lease protection and no duplicate artifacts", async () => {
    const id =
      (
        await userA.rpc("pilot_save_offer", {
          _workspace: wsA,
          _community: pilotA,
          _offer: null as unknown as string,
          _data: offer("Job"),
        })
      ).data ?? "";
    const j1 = await userA.rpc("pilot_enqueue_job", {
      _offer: id,
      _step: "export_artifact",
      _version: 1,
      _max_attempts: 2,
    });
    const j2 = await userA.rpc("pilot_enqueue_job", {
      _offer: id,
      _step: "export_artifact",
      _version: 1,
      _max_attempts: 2,
    });
    expect(j1.data).toBe(j2.data);
    const job = j1.data ?? "";
    const claims = await Promise.all([
      userA.rpc("pilot_claim_job", { _job: job, _lease_owner: "w1", _lease_seconds: 5 }),
      userA.rpc("pilot_claim_job", { _job: job, _lease_owner: "w2", _lease_seconds: 5 }),
    ]);
    const winners = claims.filter((c) => c.data && c.data.id);
    expect(winners).toHaveLength(1);
    const winner = winners[0]?.data?.lease_owner ?? "";
    const loser = winner === "w1" ? "w2" : "w1";
    expect(
      (await userA.rpc("pilot_complete_job", { _job: job, _lease_owner: loser })).error,
    ).not.toBeNull();
    await new Promise((r) => setTimeout(r, 5500));
    expect(
      (await userA.rpc("pilot_complete_job", { _job: job, _lease_owner: winner })).error,
    ).not.toBeNull();
    const retry = await userA.rpc("pilot_claim_job", {
      _job: job,
      _lease_owner: "w3",
      _lease_seconds: 30,
    });
    expect(retry.data?.attempts).toBe(2);
    expect(
      (await userA.rpc("pilot_complete_job", { _job: job, _lease_owner: "w3" })).error,
    ).toBeNull();
    expect(
      (await userA.rpc("pilot_claim_job", { _job: job, _lease_owner: "w4", _lease_seconds: 30 }))
        .data?.id ?? null,
    ).toBeNull();
    const artifacts = await userA.from("pilot_artifacts").select("id").eq("offer_id", id);
    expect(artifacts.data).toHaveLength(1);
  }, 20000);

  it("shares one allowance across text and image, dedupes, races safely and keeps uncertain usage", async () => {
    const reserve = (key: string, units: number, modality = "text", cents = 0) =>
      userA.rpc("pilot_reserve_quota", {
        _account: account,
        _community: pilotA,
        _modality: modality,
        _operation_key: key,
        _units: units,
        _additional_cents: cents,
      });
    expect((await reserve("paid", 1, "text", 1)).error?.message).toContain("cost_policy");
    const race = await Promise.all([reserve("t1", 50, "text"), reserve("i1", 50, "image")]);
    expect(race.filter((r) => !r.error)).toHaveLength(1);
    expect(race.filter((r) => r.error?.message.includes("quota"))).toHaveLength(1);
    const okKey = race[0]?.error ? "i1" : "t1";
    const again = await reserve(okKey, 50, okKey === "t1" ? "text" : "image");
    expect(again.error).toBeNull();
    let acc = (await userA.from("pilot_quota_accounts").select("*").eq("id", account).single())
      .data;
    expect(acc?.reserved).toBe(50);
    const resId = again.data?.id ?? "";
    expect(
      (
        await userA.rpc(
          "pilot_settle_reservation" as never,
          { _reservation: resId, _outcome: "released" } as never,
        )
      ).error,
    ).not.toBeNull();
    expect(
      (await admin.rpc("pilot_settle_reservation", { _reservation: resId, _outcome: "uncertain" }))
        .error,
    ).toBeNull();
    acc = (await userA.from("pilot_quota_accounts").select("*").eq("id", account).single()).data;
    expect(acc?.reserved).toBe(0);
    expect(acc?.accounted).toBe(50);
    expect((await reserve("i2", 41, "image")).error?.message).toContain("quota");
    expect((await reserve("i3", 40, "image")).error).toBeNull();
    await admin.rpc("pilot_record_quota_snapshot", {
      _workspace: wsA,
      _provider: "simulated",
      _period: "2026-11-01",
      _allowance: 100,
      _margin: 10,
      _accounted: 0,
      _valid_until: new Date(Date.now() - 1000).toISOString(),
    });
    expect((await reserve("stale", 1)).error?.message).toContain("unverified_allowance");
    acc = (await userA.from("pilot_quota_accounts").select("*").eq("id", account).single())
      .data;
    expect(acc?.accounted).toBe(50);
  });
});
