import { z } from "zod";
import { evaluateReservation } from "./cost";

export const briefSchema = z.object({
  community: z.string().trim().min(1).max(120),
  niche: z.string().trim().min(1).max(200),
  objective: z.string().trim().min(1).max(500),
  format: z.enum(["1080 × 1080", "1080 × 1920", "1200 × 628"]),
});

export const importedTextSchema = z.string().trim().min(1).max(6000);
export const acceptedImageTypes = ["image/jpeg", "image/png", "image/webp"] as const;
export const maximumImageBytes = 5 * 1024 * 1024;

export function makeAssistedDrafts(input: unknown) {
  const brief = briefSchema.parse(input);
  const context = JSON.stringify(brief);
  return {
    template: `${brief.community}\n\n${brief.objective}\n\nVeja os detalhes e as condições na fonte oficial antes de aproveitar.`,
    textPrompt: [
      "Escreva um rascunho curto em português para revisão humana.",
      "Use os dados abaixo como contexto. Deixe preço, desconto, comissão, validade e link em aberto quando ausentes. Não invente condições.",
      context,
    ].join("\n"),
    imagePrompt: [
      "Crie um fundo ilustrativo para uma peça promocional. Reserve espaço para o texto e a foto oficial do produto.",
      "Não inclua preço, cupom, logotipo ou representação de um produto específico.",
      context,
    ].join("\n"),
  };
}

export async function validateImportedImage(file: File) {
  if (!file.size || file.size > maximumImageBytes) return false;
  const header = await new Promise<ArrayBuffer>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (reader.result instanceof ArrayBuffer) resolve(reader.result);
      else reject(new Error("Cabeçalho de imagem inválido."));
    };
    reader.onerror = () => reject(reader.error);
    reader.onabort = () => reject(new Error("Leitura cancelada."));
    reader.readAsArrayBuffer(file.slice(0, 12));
  });
  const bytes = new Uint8Array(header);
  const signature = String.fromCharCode(...bytes);
  switch (file.type) {
    case "image/jpeg":
      return bytes[0] === 255 && bytes[1] === 216 && bytes[2] === 255;
    case "image/png":
      return [137, 80, 78, 71, 13, 10, 26, 10].every((byte, index) => bytes[index] === byte);
    case "image/webp":
      return signature.startsWith("RIFF") && signature.slice(8) === "WEBP";
    default:
      return false;
  }
}

export function simulateSharedAllowance(now: Date) {
  const account = {
    allowance: 10_000,
    margin: 2_000,
    accounted: 0,
    reserved: 0,
    validUntil: new Date(now.getTime() + 60_000).toISOString(),
  };
  const text = evaluateReservation(
    account,
    { maximumUnits: 6_000, maximumAdditionalCents: 0 },
    now,
  );
  const image = evaluateReservation(
    { ...account, reserved: text.allowed ? text.units : 0 },
    { maximumUnits: 5_000, maximumAdditionalCents: 0 },
    now,
  );
  return { text, image };
}
