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
