import { z } from "zod";
import { parseOfferPrice } from "./offer";
import { evaluateReservation } from "./cost";

const offerSourceSchema = z.object({
  name: z.string().min(1).max(120),
  priceCents: z.number().int().positive(),
  sourceUrl: z.url({ protocol: /^https$/ }),
  expiresAt: z.iso.datetime({ offset: true }),
  version: z.number().int().positive(),
});
export type AssistedOfferSource = z.infer<typeof offerSourceSchema>;

export const briefSchema = z.object({
  community: z.string().trim().min(1).max(120),
  niche: z.string().trim().min(1).max(200),
  objective: z.string().trim().min(1).max(500),
  offer: offerSourceSchema.optional(),
  tone: z.enum(["direto", "informativo", "descontraído"]).default("direto"),
  format: z.enum(["1080 × 1080", "1080 × 1920", "1200 × 628"]),
});

export const importedTextSchema = z.string().trim().min(1).max(6000);
export const acceptedImageTypes = ["image/jpeg", "image/png", "image/webp"] as const;
export const maximumImageBytes = 5 * 1024 * 1024;

export function makeAssistedDrafts(input: unknown) {
  const brief = briefSchema.parse(input);
  const context = JSON.stringify(brief);
  const offer = brief.offer;
  const price =
    offer &&
    new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(
      offer.priceCents / 100,
    );
  return {
    template: offer
      ? [
          brief.community,
          offer.name,
          `Preço observado: ${price}`,
          `Validade: ${offer.expiresAt}`,
          `Fonte: ${offer.sourceUrl}`,
        ].join("\n")
      : `${brief.community}\n\n${brief.objective}\n\nVeja os detalhes e as condições na fonte oficial antes de aproveitar.`,
    textPrompt: [
      "Escreva um rascunho curto em português para revisão humana.",
      "Use os dados abaixo como contexto. Deixe preço, desconto, comissão, validade e link em aberto quando ausentes. Não invente condições.",
      context,
    ].join("\n"),
    imagePrompt: [
      "Crie um fundo ilustrativo para uma peça promocional. Reserve espaço para o texto e a foto oficial do produto.",
      "Não inclua preço, cupom, logotipo ou representação de um produto específico.",
      JSON.stringify({
        community: brief.community,
        niche: brief.niche,
        objective: brief.objective,
        format: brief.format,
        product: offer?.name,
      }),
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

export const whatsappTemplates = {
  direct: "Direto",
  community: "Seleção da comunidade",
  short: "Resumo curto",
  market: "Compra em pacote",
  deadline: "Com prazo",
} as const;

export const announcementUrlSchema = z
  .url({ protocol: /^https$/ })
  .max(2048)
  .refine((value) => {
    const url = new URL(value);
    return !url.username && !url.password;
  });

const singleLine = (maximum: number) =>
  z
    .string()
    .trim()
    .max(maximum)
    .regex(/^[^\r\n]*$/u);
export const whatsappDetailsSchema = z.object({
  marketplace: singleLine(60),
  coupon: singleLine(50),
  installments: singleLine(100),
  previousPrice: z
    .string()
    .trim()
    .regex(/^(?:\d{1,7}(?:[,.]\s*\d{1,2})?)?$/),
  quantity: z
    .string()
    .trim()
    .regex(/^(?:[1-9]\d{0,3})?$/),
});

export function makeWhatsappMessage({
  offer,
  community,
  template,
  affiliate,
  details,
}: {
  offer: AssistedOfferSource;
  community: string;
  template: keyof typeof whatsappTemplates;
  affiliate: boolean;
  details?: z.infer<typeof whatsappDetailsSchema>;
}) {
  const { name, priceCents, sourceUrl, expiresAt } = offerSourceSchema.parse(offer);
  const url = announcementUrlSchema.parse(sourceUrl);
  const money = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });
  const price = money.format(priceCents / 100);
  const extra = details && whatsappDetailsSchema.parse(details);
  const previous = extra?.previousPrice ? parseOfferPrice(extra.previousPrice) : 0;
  const discount =
    previous > priceCents ? Math.floor(((previous - priceCents) * 100) / previous) : 0;
  const priceLine =
    previous > priceCents
      ? `💰 De ~${money.format(previous / 100)}~ por *${price}*${discount ? ` · ${discount}% de desconto` : ""}`
      : `💰 *${price}*`;
  const quantity = Number(extra?.quantity || 0);
  const validity = new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
    timeZone: "America/Sao_Paulo",
  }).format(new Date(expiresAt));
  const headings = {
    direct: "🏷️ *Destaque de preço*",
    community: `✨ *Seleção de ${community}*`,
    short: "",
    market: "🛒 *Para a próxima compra*",
    deadline: "🗓️ *Confira o prazo da oferta*",
  };

  const detailsLines = [
    priceLine,
    ...(quantity > 1
      ? [`📦 ${quantity} unidades · ${money.format(priceCents / quantity / 100)} por unidade`]
      : []),
    ...(extra?.coupon ? [`🎟️ Cupom: *${extra.coupon}*`] : []),
    ...(extra?.installments ? [`💳 ${extra.installments}`] : []),
    ...(extra?.marketplace ? [`🏪 ${extra.marketplace}`] : []),
  ];

  return [
    [headings[template], `*${name}*`].filter(Boolean).join("\n"),
    detailsLines.join("\n"),
    `⏱️ Validade informada: ${validity} (horário de Brasília)\n🔗 ${url}`,
    ...(affiliate ? ["Link de afiliado. Podemos receber comissão pela compra."] : []),
  ].join("\n\n");
}
