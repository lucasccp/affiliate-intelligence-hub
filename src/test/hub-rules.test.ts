import { describe, expect, it } from "vitest";
import { communitySchema, workspaceSchema, canManage, statuses, modes, parseList } from "@/lib/hub-schema";
const base = { name: "Comunidade de Livros", slug: "livros", niche: "Literatura" };
describe("Phase 1 rules", () => {
  it("defaults new communities to assisted", () => { expect(communitySchema.parse(base).automation_mode).toBe("assisted"); });
  it("accepts only the six requested states", () => { expect(statuses).toEqual(["draft", "configuring", "ready", "active", "paused", "archived"]); expect(communitySchema.safeParse({ ...base, status: "published" }).success).toBe(false); });
  it("accepts only the three requested modes", () => { expect(modes).toEqual(["manual", "assisted", "automatic"]); expect(communitySchema.safeParse({ ...base, automation_mode: "autonomous" }).success).toBe(false); });
  it("does not bind niches to the automotive pilot", () => { expect(communitySchema.parse(base).niche).toBe("Literatura"); });
  it("keeps the financial budget at exactly zero", () => { const w = { name: "Workspace", language: "pt-BR", timezone: "America/Sao_Paulo", daily_offer_limit: 100, zero_cost_budget: 0 }; expect(workspaceSchema.parse(w).zero_cost_budget).toBe(0); expect(workspaceSchema.safeParse({ ...w, zero_cost_budget: 0.01 }).success).toBe(false); });
  it("denies write access to viewers", () => { expect(canManage("viewer")).toBe(false); expect(canManage("owner")).toBe(true); expect(canManage("admin")).toBe(true); });
  it("requires nonnegative whole offer limits", () => { expect(communitySchema.safeParse({ ...base, daily_offer_limit: -1 }).success).toBe(false); expect(communitySchema.safeParse({ ...base, daily_offer_limit: 1.5 }).success).toBe(false); });
  it("deduplicates category selections", () => { expect(parseList("Livros, Livros, Revistas")).toEqual(["Livros", "Revistas"]); });
});