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
