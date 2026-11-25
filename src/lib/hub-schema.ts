import { z } from "zod";

export const statuses = ["draft", "configuring", "ready", "active", "paused", "archived"] as const;
export const modes = ["manual", "assisted", "automatic"] as const;
export const statusLabels: Record<(typeof statuses)[number], string> = {
  draft: "Rascunho",
  configuring: "Em configuração",
  ready: "Pronta",
  active: "Ativa",
  paused: "Pausada",
  archived: "Arquivada",
};
export const modeLabels = { manual: "Manual", assisted: "Assistido", automatic: "Automático" };
export const timezoneSchema = z.string().refine((value) => {
  try {
    new Intl.DateTimeFormat("pt-BR", { timeZone: value });
    return true;
  } catch {
    return false;
  }
}, "Fuso horário inválido");
export const languageSchema = z
  .string()
  .min(2)
  .max(30)
  .refine((value) => {
    try {
      return Intl.getCanonicalLocales(value).length > 0;
    } catch {
      return false;
    }
  }, "Idioma inválido");
export const listSchema = z.array(z.string().trim().min(1).max(100)).max(30);
export const communitySchema = z.object({
  name: z.string().trim().min(2, "Informe um nome com pelo menos 2 caracteres").max(120),
  slug: z
    .string()
    .min(1)
    .max(120)
    .regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, "Use letras minúsculas, números e hífens no slug"),
  niche: z.string().trim().min(2, "Informe o nicho").max(200),
  description: z.string().max(2000).default(""),
  target_audience: z.string().max(1000).default(""),
  language: languageSchema.default("pt-BR"),
  currency: z
    .string()
    .regex(/^[A-Z]{3}$/)
    .default("BRL"),
  timezone: timezoneSchema.default("America/Sao_Paulo"),
  daily_offer_limit: z.number().int().min(0).max(10000).default(20),
  automation_mode: z.enum(modes).default("assisted"),
  status: z.enum(statuses).default("draft"),
  categories: listSchema.default([]),
  marketplaces: listSchema.default([]),
  channels: listSchema.default([]),
});
export type CommunityInput = z.infer<typeof communitySchema>;
export const profileSchema = z.object({
  display_name: z.string().trim().min(1).max(100),
  avatar_url: z.union([
    z.literal(""),
    z.url().refine((v) => v.startsWith("https://"), "Use HTTPS"),
  ]),
  language: languageSchema,
  timezone: timezoneSchema,
  theme: z.enum(["light", "dark", "system"]),
});
export const workspaceSchema = z.object({
  name: z.string().trim().min(1).max(100),
  language: languageSchema,
  timezone: timezoneSchema,
  daily_offer_limit: z.number().int().min(0).max(10000),
  zero_cost_budget: z.literal(0),
});
export function toSlug(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}
export function canManage(role: string) {
  return role === "owner" || role === "admin";
}
export function parseList(value: string) {
  return [
    ...new Set(
      value
        .split(",")
        .map((v) => v.trim())
        .filter(Boolean),
    ),
  ];
}
