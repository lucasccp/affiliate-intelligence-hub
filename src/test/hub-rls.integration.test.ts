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
      storageKey: `integration-${crypto.randomUUID()}`,
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
describe.skipIf(!enabled)("Phase 1 real database isolation", () => {
  let admin: SupabaseClient<Database>;
  let userA: SupabaseClient<Database>;
  let userB: SupabaseClient<Database>;
  const ids: string[] = [];
  let workspaceA = "";
  let workspaceB = "";
  let pilotA = "";
  beforeAll(async () => {
    if (!adminKey || !publicKey) throw new Error("Integration environment unavailable");
    admin = client(adminKey);
    const users: SupabaseClient<Database>[] = [];
    for (let index = 0; index < 2; index++) {
      const email = `rls-${crypto.randomUUID()}@example.com`;
      const password = `${crypto.randomUUID()}Aa7!`;
      const created = await admin.auth.admin.createUser({ email, password, email_confirm: true });
      if (created.error || !created.data.user)
        throw new Error("Failed to create isolated integration account");
      ids.push(created.data.user.id);
      const authenticated = client(publicKey);
      const login = await authenticated.auth.signInWithPassword({ email, password });
      if (login.error) throw new Error("Failed to sign in isolated integration account");
      users.push(authenticated);
    }
    const a = users[0];
    const b = users[1];
    if (!a || !b) throw new Error("Missing integration accounts");
    userA = a;
    userB = b;
    const wa = await a.from("workspaces").select("id").single();
    const wb = await b.from("workspaces").select("id").single();
    if (!wa.data || !wb.data) throw new Error("Personal workspace trigger failed");
    workspaceA = wa.data.id;
    workspaceB = wb.data.id;
    const pilot = await a
      .from("communities")
      .select("id")
      .eq("slug", "garagem-de-ofertas")
      .single();
    if (!pilot.data) throw new Error("Pilot trigger failed");
    pilotA = pilot.data.id;
  }, 30000);
  afterAll(async () => {
    if (admin)
      for (const id of ids) {
        const result = await admin.auth.admin.deleteUser(id);
        expect(result.error).toBeNull();
      }
  });
  it("seeds exact pilot settings and independent destinations", async () => {
    const result = await userA
      .from("communities")
      .select("*,community_categories(name),marketplace_connections(name),channels(name)")
      .eq("id", pilotA)
      .single();
    expect(result.error).toBeNull();
    expect(result.data).toMatchObject({
      name: "Garagem de Ofertas",
      slug: "garagem-de-ofertas",
      niche: "Automotivo",
      language: "pt-BR",
      currency: "BRL",
      timezone: "America/Sao_Paulo",
      daily_offer_limit: 20,
      status: "draft",
      automation_mode: "assisted",
    });
    expect(result.data?.community_categories.map((c) => c.name).sort()).toEqual(
      [
        "Estética automotiva",
        "Acessórios internos",
        "Acessórios externos",
        "Ferramentas",
        "Eletrônicos automotivos",
        "Organização veicular",
        "Manutenção e cuidados",
        "Acessórios para motociclistas",
      ].sort(),
    );
    expect(result.data?.marketplace_connections.map((c) => c.name).sort()).toEqual(
      ["Mercado Livre", "Shopee", "Amazon"].sort(),
    );
    expect(result.data?.channels.map((c) => c.name).sort()).toEqual(
      ["WhatsApp", "Instagram", "Telegram", "Landing Page"].sort(),
    );
  });
  it("keeps pilot bootstrap idempotent", async () => {
    const id = ids[0];
    if (!id) throw new Error("Missing test identity");
    const result = await admin.rpc("bootstrap_personal_workspace", { _user: id, _name: "Test" });
    expect(result.error).toBeNull();
    const pilots = await userA.from("communities").select("id").eq("slug", "garagem-de-ofertas");
    expect(pilots.data).toHaveLength(1);
  });
  it("denies read and write across workspaces through RLS", async () => {
    const foreign = await userA.from("communities").select("id").eq("workspace_id", workspaceB);
    expect(foreign.data).toEqual([]);
    const write = await userA
      .from("communities")
      .insert({ workspace_id: workspaceB, name: "Denied", slug: "denied", niche: "Books" });
    expect(write.error).not.toBeNull();
    const hiddenProfiles = await userA
      .from("profiles")
      .select("id")
      .eq("id", ids[1] ?? "");
    expect(hiddenProfiles.data).toEqual([]);
    const role = await userA
      .from("workspace_members")
      .update({ role: "admin" })
      .eq("user_id", ids[0] ?? "");
    expect(role.error).not.toBeNull();
    const unchanged = await userA
      .from("workspace_members")
      .select("role")
      .eq("user_id", ids[0] ?? "")
      .single();
    expect(unchanged.data?.role).toBe("owner");
  });
  it("rejects cross-workspace child associations", async () => {
    const result = await userA
      .from("channels")
      .insert({ community_id: pilotA, workspace_id: workspaceB, name: "Bad association" });
    expect(result.error).not.toBeNull();
    const privilegedConstraint = await admin
      .from("channels")
      .insert({ community_id: pilotA, workspace_id: workspaceB, name: "Bad association" });
    expect(privilegedConstraint.error?.code).toBe("23503");
  });
  it("persists a second niche without pilot settings", async () => {
    const result = await userA.rpc("save_community", {
      _workspace: workspaceA,
      _id: null as unknown as string,
      _data: {
        name: "Leitura independente",
        slug: "leitura-independente",
        niche: "Literatura",
        language: "pt-BR",
        currency: "BRL",
        timezone: "America/Sao_Paulo",
        daily_offer_limit: 7,
        status: "draft",
        automation_mode: "assisted",
        categories: ["Livros"],
        marketplaces: [],
        channels: ["Newsletter"],
      },
    });
    expect(result.error).toBeNull();
    const saved = await userA
      .from("communities")
      .select("*,community_categories(name),channels(name)")
      .eq("slug", "leitura-independente")
      .single();
    expect(saved.data?.niche).toBe("Literatura");
    expect(saved.data?.community_categories).toEqual([{ name: "Livros" }]);
    expect(saved.data?.channels).toEqual([{ name: "Newsletter" }]);
    const other = await userB.from("communities").select("id").eq("slug", "leitura-independente");
    expect(other.data).toEqual([]);
  });
  it("rejects nonzero budget and workspace limit violations directly in database", async () => {
    const budget = await userA
      .from("workspaces")
      .update({ zero_cost_budget: 0.01 })
      .eq("id", workspaceA);
    expect(budget.error?.code).toBe("23514");
    const limit = await userA
      .from("communities")
      .update({ daily_offer_limit: 101 })
      .eq("id", pilotA);
    expect(limit.error).not.toBeNull();
  });
  it("denies unauthenticated reads and writes", async () => {
    if (!publicKey) throw new Error("Integration environment unavailable");
    const anon = client(publicKey);
    const read = await anon.from("communities").select("id");
    expect(read.error !== null || read.data?.length === 0).toBe(true);
    const write = await anon
      .from("communities")
      .insert({ workspace_id: workspaceA, name: "Anonymous", slug: "anonymous", niche: "Books" });
    expect(write.error).not.toBeNull();
  });
});
