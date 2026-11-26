import { z } from "zod";

const units = z.number().int().nonnegative().max(Number.MAX_SAFE_INTEGER);
const snapshotSchema = z.object({
  allowance: units,
  margin: units,
  accounted: units,
  reserved: units,
  validUntil: z.iso.datetime(),
});
const estimateSchema = z.object({
  maximumUnits: units.positive(),
  maximumAdditionalCents: z.literal(0),
});

/** Evaluates one account snapshot. The caller must lock and reserve in one database transaction. */
export function evaluateReservation(snapshot: unknown, estimate: unknown, now: Date) {
  const request = estimateSchema.safeParse(estimate);
  if (!request.success) return { allowed: false, reason: "cost_policy" } as const;

  const account = snapshotSchema.safeParse(snapshot);
  if (!account.success || !(now.getTime() < Date.parse(account.data.validUntil))) {
    return { allowed: false, reason: "unverified_allowance" } as const;
  }

  const { allowance, margin, accounted, reserved } = account.data;
  const remaining = Math.max(0, allowance - margin - accounted - reserved);
  if (request.data.maximumUnits > remaining) return { allowed: false, reason: "quota" } as const;

  return { allowed: true, units: request.data.maximumUnits } as const;
}
