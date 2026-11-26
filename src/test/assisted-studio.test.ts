import { makeWhatsappMessage } from "@/lib/pilot/assisted";
import { parseOfferPrice } from "@/lib/pilot/offer";
import { describe, expect, it } from "vitest";
import {
  makeAssistedDrafts,
  simulateSharedAllowance,
  validateImportedImage,
} from "@/lib/pilot/assisted";

describe("assisted content", () => {
  it("prepares separate text and image prompts from the selected community", () => {
    const drafts = makeAssistedDrafts({
      community: "Clube de Leitura",
      niche: "Livros",
      objective: "Divulgar a seleção da semana",
      format: "1080 × 1920",
    });
    expect(drafts.template).toContain("Clube de Leitura");
    expect(drafts.textPrompt).toContain("Não invente condições");
    expect(drafts.imagePrompt).toContain("1080 × 1920");
  });

  it("uses the exact offer revision and keeps price and source out of the image prompt", () => {
    const drafts = makeAssistedDrafts({
      community: "Garagem de Ofertas",
      niche: "Automotivo",
      objective: "Divulgar o produto",
      format: "1080 × 1920",
      tone: "informativo",
      offer: {
        name: "Suporte para celular",
        priceCents: 3490,
        sourceUrl: "https://example.com/oferta",
        expiresAt: "2026-11-27T18:00:00+00:00",
        version: 2,
      },
    });
    expect(drafts.template).toContain("34,90");
    expect(drafts.template).toContain("https://example.com/oferta");
    expect(drafts.textPrompt).toContain('"version":2');
    expect(drafts.textPrompt).toContain('"tone":"informativo"');
    expect(drafts.imagePrompt).toContain("Suporte para celular");
    expect(drafts.imagePrompt).not.toContain("3490");
    expect(drafts.imagePrompt).not.toContain("example.com");
  });

  it("checks image bytes rather than trusting the declared type", async () => {
    const fake = new File(["<svg></svg>"], "fake.png", { type: "image/png" });
    expect(await validateImportedImage(fake)).toBe(false);
    const png = new File([new Uint8Array([137, 80, 78, 71, 13, 10, 26, 10])], "image.png", {
      type: "image/png",
    });
    expect(await validateImportedImage(png)).toBe(true);
  });

  it("simulates text and image competing for the same allowance", () => {
    const result = simulateSharedAllowance(new Date("2026-11-26T00:00:00Z"));
    expect(result.text).toEqual({ allowed: true, units: 6000 });
    expect(result.image).toEqual({ allowed: false, reason: "quota" });
  });
});

it("accepts spaces after the decimal separator in the mobile offer form", () => {
  expect(parseOfferPrice(" 39, 90 ")).toBe(3990);
  expect(parseOfferPrice("39.90")).toBe(3990);
  expect(parseOfferPrice("39, 900")).toBeNaN();
});

it("builds a WhatsApp message using the supplied link and affiliate disclosure", () => {
  const message = makeWhatsappMessage({
    offer: {
      name: "Suporte",
      priceCents: 3990,
      sourceUrl: "https://example.com/link",
      expiresAt: "2026-11-29T16:00:00Z",
      version: 1,
    },
    community: "Garagem de Ofertas",
    template: "community",
    affiliate: true,
  });
  expect(message).toContain("Seleção de Garagem de Ofertas");
  expect(message).toContain("39,90");
  expect(message).toContain("https://example.com/link");
  expect(message).toContain("Link de afiliado");
});

it("formats verified optional promotion details and omits empty lines", () => {
  const options = {
    offer: {
      name: "Kit de panos",
      priceCents: 3000,
      sourceUrl: "https://example.com/kit",
      expiresAt: "2026-11-29T16:00:00Z",
      version: 1,
    },
    community: "Garagem de Ofertas",
    template: "market",
    affiliate: false,
  } as const;
  expect(makeWhatsappMessage(options)).not.toMatch(/Cupom|desconto|por unidade/);
  const message = makeWhatsappMessage({
    ...options,
    details: {
      marketplace: "Shopee",
      coupon: "KIT10",
      previousPrice: "50,00",
      installments: "3× de R$ 10,00",
      quantity: "3",
    },
  });
  expect(message).toContain("40% de desconto");
  expect(message).toMatch(/10,00 por unidade/);
  expect(message).toContain("*KIT10*");
  expect(message).toContain("3× de R$ 10,00");
  expect(message).toContain("Shopee");
});
