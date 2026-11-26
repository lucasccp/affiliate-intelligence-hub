import { useQuery } from "@tanstack/react-query";
import { pilotOfferQuery, type PilotOffer } from "@/lib/pilot/offer-query";
import { useEffect, useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  acceptedImageTypes,
  briefSchema,
  importedTextSchema,
  makeAssistedDrafts,
  simulateSharedAllowance,
  validateImportedImage,
} from "@/lib/pilot/assisted";
import { useHub } from "./app-context";

export function AssistedStudio({
  offer,
  onSelectOffer,
}: {
  offer: PilotOffer | undefined;
  onSelectOffer: (offer?: PilotOffer) => void;
}) {
  const { data, selectedId } = useHub();
  const community = data.communities.find(({ id }) => id === selectedId);
  if (!community || (data.role !== "owner" && data.role !== "admin")) return null;
  return (
    <Studio
      key={`${data.workspace.id}:${community.id}:${offer?.id ?? "avulso"}:${offer?.current_version ?? 0}`}
      community={community.name}
      niche={community.niche}
      scope={{ workspaceId: data.workspace.id, communityId: community.id }}
      offer={offer}
      onSelectOffer={onSelectOffer}
    />
  );
}

function Studio({
  community,
  niche,
  scope,
  offer,
  onSelectOffer,
}: {
  community: string;
  niche: string;
  scope: { workspaceId: string; communityId: string };
  offer: PilotOffer | undefined;
  onSelectOffer: (offer?: PilotOffer) => void;
}) {
  const offers = useQuery(pilotOfferQuery(scope));
  const current = offers.data?.find(({ id }) => id === offer?.id);
  const [now, setNow] = useState(Date.now);
  const expires = offer ? Date.parse(offer.revision.expires_at) : undefined;
  useEffect(() => {
    if (expires === undefined || !Number.isFinite(expires) || now >= expires) return;
    const delay = Math.min(Math.max(expires - Date.now(), 0), 2_147_483_647);
    const timer = window.setTimeout(() => setNow(Date.now()), delay);
    return () => window.clearTimeout(timer);
  }, [expires, now]);

  function offerWarning(at: number) {
    if (!offer || expires === undefined) return "";
    if (offers.isError || !current) return "Não foi possível confirmar a revisão da oferta.";
    if (current.current_version !== offer.current_version)
      return "A oferta mudou. Selecione a revisão atual para preparar um novo rascunho.";
    if (!Number.isFinite(expires) || at >= expires)
      return "A oferta venceu. Revise a validade em Ofertas.";
    return "";
  }

  const warning = offerWarning(now);
  const [drafts, setDrafts] = useState<ReturnType<typeof makeAssistedDrafts>>();
  const [manual, setManual] = useState("");
  const [imported, setImported] = useState("");
  const [file, setFile] = useState<File>();
  const [preview, setPreview] = useState("");
  const [feedback, setFeedback] = useState("");
  const [simulation, setSimulation] = useState<ReturnType<typeof simulateSharedAllowance>>();
  const [validating, setValidating] = useState(false);

  useEffect(() => {
    if (!file) return;
    const url = URL.createObjectURL(file);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  function prepare(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const blocked = offerWarning(Date.now());
    if (blocked) {
      setFeedback(blocked);
      return;
    }
    const fields = new FormData(event.currentTarget);
    const brief = briefSchema.safeParse({
      community,
      niche,
      objective: fields.get("objective"),
      format: fields.get("format"),
      tone: fields.get("tone"),
      offer: offer && {
        name: offer.revision.name,
        priceCents: offer.revision.price_cents,
        sourceUrl: offer.revision.source_url,
        expiresAt: offer.revision.expires_at,
        version: offer.current_version,
      },
    });
    if (!brief.success) {
      setFeedback("Informe um objetivo com até 500 caracteres e escolha o formato.");
      return;
    }
    setDrafts(makeAssistedDrafts(brief.data));
    setFeedback("Rascunho e prompts preparados.");
  }

  async function copy(value: string) {
    const blocked = offerWarning(Date.now());
    if (blocked) {
      setFeedback(blocked);
      return;
    }
    try {
      await navigator.clipboard.writeText(value);
      setFeedback("Copiado.");
    } catch {
      setFeedback("Selecione o conteúdo no campo para copiar.");
    }
  }

  return (
    <section
      className="space-y-5 rounded-xl border bg-card p-4 sm:p-6"
      aria-labelledby="assisted-heading"
    >
      <h2 id="assisted-heading" className="font-display text-lg font-semibold">
        Conteúdo assistido
      </h2>
      <p className="text-sm text-muted-foreground">
        Use templates, leve os prompts à ferramenta de sua escolha e revise materiais importados
        nesta sessão.
      </p>
      <label className="block space-y-1">
        Oferta de referência
        <select
          className="block w-full rounded-md border bg-background px-3 py-2"
          value={offer?.id ?? ""}
          onChange={(event) =>
            onSelectOffer(offers.data?.find(({ id }) => id === event.target.value))
          }
        >
          <option value="">Conteúdo avulso</option>
          {offer && !current && <option value={offer.id}>{offer.revision.name}</option>}
          {offers.data?.map((item) => (
            <option key={item.id} value={item.id}>
              {item.revision.name}
            </option>
          ))}
        </select>
      </label>
      {offer && (
        <div className="space-y-1 rounded-lg border bg-muted p-3 text-sm">
          <p className="font-medium">
            {offer.revision.name} · revisão {offer.current_version}
          </p>
          <p className="whitespace-pre-wrap [overflow-wrap:anywhere]">
            {offer.revision.draft_text}
          </p>
          {current?.current_version === offer.current_version &&
            current.approved_version !== offer.current_version && (
              <p className="text-muted-foreground">
                Oferta aguardando aprovação. O conteúdo é um rascunho.
              </p>
            )}
          {warning && (
            <p role="alert" className="font-medium">
              {warning}
            </p>
          )}
          {current && current.current_version !== offer.current_version && (
            <Button type="button" variant="outline" onClick={() => onSelectOffer(current)}>
              Usar revisão {current.current_version}
            </Button>
          )}
        </div>
      )}
      <form onSubmit={prepare} className="space-y-3">
        <label className="block space-y-1">
          Objetivo da peça
          <Textarea name="objective" required maxLength={500} />
        </label>
        <label className="block space-y-1">
          Formato de imagem
          <select name="format" className="block rounded-md border bg-background px-3 py-2">
            {briefSchema.shape.format.options.map((format) => (
              <option key={format}>{format}</option>
            ))}
          </select>
        </label>
        <label className="block space-y-1">
          Tom do texto
          <select name="tone" className="block rounded-md border bg-background px-3 py-2">
            <option value="direto">Direto</option>
            <option value="informativo">Informativo</option>
            <option value="descontraído">Descontraído</option>
          </select>
        </label>
        <Button disabled={Boolean(warning)}>Preparar conteúdo</Button>
      </form>
      {drafts && (
        <div className="grid gap-3 lg:grid-cols-3">
          {(
            [
              ["Rascunho por template", drafts.template],
              ["Prompt de texto", drafts.textPrompt],
              ["Prompt de imagem", drafts.imagePrompt],
            ] as const
          ).map(([label, value]) => (
            <div key={label} className="space-y-2">
              <label className="block space-y-1">
                {label}
                <Textarea readOnly value={value} rows={6} />
              </label>
              <Button
                variant="outline"
                disabled={Boolean(warning)}
                onClick={() => void copy(value)}
              >
                Copiar {label.toLowerCase()}
              </Button>
            </div>
          ))}
        </div>
      )}
      <div className="space-y-2">
        <label className="block space-y-1">
          Texto produzido externamente
          <Textarea
            value={manual}
            onChange={(event) => setManual(event.currentTarget.value)}
            maxLength={6000}
          />
        </label>
        <Button
          variant="outline"
          onClick={() => {
            const result = importedTextSchema.safeParse(manual);
            if (!result.success) {
              setFeedback("Cole o texto que deseja importar.");
              return;
            }
            setImported(result.data);
            setFeedback("Texto importado para revisão nesta sessão.");
          }}
        >
          Importar texto
        </Button>
        {imported && (
          <div className="space-y-2">
            <p className="text-sm font-medium">Rascunho importado · aguardando revisão</p>
            <p className="whitespace-pre-wrap break-words text-sm">{imported}</p>
            <Button
              variant="outline"
              disabled={Boolean(warning)}
              onClick={() => void copy(imported)}
            >
              Copiar rascunho importado
            </Button>
          </div>
        )}
      </div>
      <label className="block space-y-1">
        Imagem para revisão local (JPG, PNG ou WebP, até 5 MB)
        <input
          type="file"
          className="block max-w-full text-sm"
          accept={acceptedImageTypes.join(",")}
          disabled={validating}
          onChange={async (event) => {
            const input = event.currentTarget;
            const candidate = input.files?.[0];
            input.value = "";
            if (!candidate) return;
            setValidating(true);
            try {
              if (!(await validateImportedImage(candidate))) {
                setFeedback("Selecione um JPG, PNG ou WebP válido de até 5 MB.");
                return;
              }
              setFile(candidate);
              setFeedback("Imagem carregada para revisão local.");
            } catch {
              setFeedback("Não foi possível ler a imagem.");
            } finally {
              setValidating(false);
            }
          }}
        />
      </label>
      {file && preview && (
        <img
          src={preview}
          alt="Imagem importada para revisão"
          onError={() => {
            setFile(undefined);
            setPreview("");
            setFeedback("Não foi possível abrir a imagem.");
          }}
          className="max-h-64 max-w-full rounded object-contain"
        />
      )}
      <div className="space-y-2">
        <Button
          variant="outline"
          onClick={() => setSimulation(simulateSharedAllowance(new Date()))}
        >
          Simular franquia de texto e imagem
        </Button>
        {simulation && (
          <p className="text-sm">
            Saldo simulado de 10.000 unidades, com margem de 2.000. Texto (6.000):{" "}
            {simulation.text.allowed ? "admitido" : "bloqueado"}. Imagem (5.000):{" "}
            {simulation.image.allowed ? "admitida" : "bloqueada"}.
          </p>
        )}
      </div>
      <p role="status" className="text-sm">
        {feedback}
      </p>
    </section>
  );
}
