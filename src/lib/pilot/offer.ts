import { z } from "zod";

const sourceUrl = z
  .url({ protocol: /^https$/ })
  .max(2048)
  .refine((value) => {
    const url = new URL(value);
    return !url.username && !url.password;
  }, "A fonte não pode incluir credenciais.");

export const manualOfferSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(1)
      .max(120)
      .regex(/^[^\r\n\u2028\u2029]+$/u),
    sourceUrl,
    priceCents: z.number().int().positive().max(100_000_000),
    observedAt: z.iso.datetime(),
    expiresAt: z.iso.datetime(),
  })
  .refine(({ observedAt, expiresAt }) => Date.parse(expiresAt) > Date.parse(observedAt), {
    message: "A validade deve ser posterior à observação.",
    path: ["expiresAt"],
  });

export function renderOfferDraft(input: unknown) {
  const offer = manualOfferSchema.parse(input);
  const price = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(
    offer.priceCents / 100,
  );
  return [
    offer.name,
    `Preço observado: ${price}`,
    `Observado em: ${offer.observedAt}`,
    `Validade informada: ${offer.expiresAt}`,
    `Fonte: ${offer.sourceUrl}`,
  ].join("\n");
}

type OfferRevision = {
  version: number;
  approvedVersion: number | null;
  observedAt: string;
  expiresAt: string;
};

export function canExportOffer(revision: OfferRevision, now: Date) {
  const timestamp = now.getTime();
  return (
    Number.isSafeInteger(revision.version) &&
    revision.version > 0 &&
    revision.approvedVersion === revision.version &&
    Date.parse(revision.observedAt) <= timestamp &&
    timestamp < Date.parse(revision.expiresAt)
  );
}

export function parseOfferPrice(value: string) {
  const match = /^(\d+)(?:[,.]\s*(\d{1,2}))?$/.exec(value.trim());
  if (!match) return NaN;
  const [, whole, fraction = ""] = match;
  return Number(whole) * 100 + Number(fraction.padEnd(2, "0"));
}
