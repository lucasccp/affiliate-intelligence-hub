import { describe, expect, it } from "vitest";
import { evaluateReservation } from "@/lib/pilot/cost";
import { canExportOffer, renderOfferDraft } from "@/lib/pilot/offer";

const now = new Date("2026-11-26T12:00:00Z");
const offer = {
  name: "Livro em promoção",
  sourceUrl: "https://example.com/livro",
  priceCents: 2990,
  observedAt: "2026-11-26T11:00:00Z",
  expiresAt: "2026-11-26T13:00:00Z",
};

describe("deterministic offer pilot", () => {
  it("renders the observed price and source", () => {
    const draft = renderOfferDraft(offer);
    expect(draft).toContain("29,90");
    expect(draft).toContain(offer.sourceUrl);
  });

  it("rejects an offer without a valid source or validity interval", () => {
    expect(() => renderOfferDraft({ ...offer, sourceUrl: "http://example.com" })).toThrow();
    expect(() => renderOfferDraft({ ...offer, expiresAt: offer.observedAt })).toThrow();
  });

  it("exports only the approved current revision within its validity", () => {
    const approved = { ...offer, version: 1, approvedVersion: 1 };
    expect(canExportOffer(approved, now)).toBe(true);
    expect(canExportOffer({ ...approved, version: 2 }, now)).toBe(false);
    expect(canExportOffer(approved, new Date(offer.expiresAt))).toBe(false);
  });
});

describe("shared account allowance", () => {
  const bucket = {
    allowance: 10_000,
    margin: 0,
    accounted: 0,
    reserved: 0,
    validUntil: "2026-11-27T00:00:00Z",
  };

  it("denies an image reservation after text occupies the shared allowance", () => {
    const text = { maximumUnits: 6_000, maximumAdditionalCents: 0 };
    expect(evaluateReservation(bucket, text, now)).toEqual({ allowed: true, units: 6000 });
    const image = { maximumUnits: 5_000, maximumAdditionalCents: 0 };
    expect(evaluateReservation({ ...bucket, reserved: 6_000 }, image, now)).toEqual({
      allowed: false,
      reason: "quota",
    });
  });

  it("deducts margin and accounted external usage", () => {
    const account = { ...bucket, margin: 1000, accounted: 3000 };
    expect(
      evaluateReservation(account, { maximumUnits: 6000, maximumAdditionalCents: 0 }, now),
    ).toEqual({ allowed: true, units: 6000 });
    expect(
      evaluateReservation(account, { maximumUnits: 6001, maximumAdditionalCents: 0 }, now),
    ).toEqual({ allowed: false, reason: "quota" });
  });

  it("blocks paid, unknown and stale operations", () => {
    for (const maximumAdditionalCents of [1, null]) {
      expect(evaluateReservation(bucket, { maximumUnits: 1, maximumAdditionalCents }, now)).toEqual(
        { allowed: false, reason: "cost_policy" },
      );
    }
    expect(
      evaluateReservation(
        { ...bucket, validUntil: now.toISOString() },
        { maximumUnits: 1, maximumAdditionalCents: 0 },
        now,
      ),
    ).toEqual({ allowed: false, reason: "unverified_allowance" });
  });
});
