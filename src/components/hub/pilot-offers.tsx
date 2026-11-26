import { useState, type FormEvent } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { canExportOffer, manualOfferSchema } from "@/lib/pilot/offer";
import { approvePilotOffer, exportPilotOffer, savePilotOffer } from "@/lib/pilot/offer.functions";
import { useHub } from "./app-context";

import { pilotOfferQuery, type PilotOffer as Offer } from "@/lib/pilot/offer-query";

const priceFormatter = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });

export function PilotOffers({ onPrepareContent }: { onPrepareContent: (offer: Offer) => void }) {
  const { data, selectedId } = useHub();
  const community = data.communities.find((item) => item.id === selectedId);
  if (!community) {
    return (
      <p className="mt-6 text-sm text-muted-foreground">
        Selecione uma comunidade para abrir o piloto de ofertas.
      </p>
    );
  }
  return (
    <OfferPanel
      key={`${data.workspace.id}:${community.id}`}
      scope={{ workspaceId: data.workspace.id, communityId: community.id }}
      onPrepareContent={onPrepareContent}
      canManage={data.role === "owner" || data.role === "admin"}
    />
  );
}

function localDate(value: string) {
  const date = new Date(value);
  return new Date(date.getTime() - date.getTimezoneOffset() * 60_000).toISOString().slice(0, 16);
}

function OfferPanel({
  scope,
  canManage,
  onPrepareContent,
}: {
  scope: { workspaceId: string; communityId: string };
  canManage: boolean;
  onPrepareContent: (offer: Offer) => void;
}) {
  const [editing, setEditing] = useState<Offer | null>(null);
  const [editorOpen, setEditorOpen] = useState(false);
  const [feedback, setFeedback] = useState("");
  const offers = useQuery(pilotOfferQuery(scope));
  const action = useMutation({
    mutationFn: (run: () => Promise<void>) => run(),
    onError: (error) => setFeedback(error.message),
  });

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const fields = new FormData(event.currentTarget);
    const price = String(fields.get("price") ?? "");
    const [whole, fraction = ""] = price.replace(",", ".").split(".");
    const validity = new Date(String(fields.get("expires")));
    const parsed = manualOfferSchema.safeParse({
      name: fields.get("name"),
      sourceUrl: fields.get("source"),
      priceCents: /^\d+(?:[.,]\d{1,2})?$/.test(price)
        ? Number(whole) * 100 + Number(fraction.padEnd(2, "0"))
        : NaN,
      observedAt: new Date().toISOString(),
      expiresAt: Number.isFinite(validity.getTime()) ? validity.toISOString() : "",
    });
    if (!parsed.success) {
      setFeedback("Informe nome, fonte HTTPS, preço válido e validade futura.");
      return;
    }
    action.mutate(async () => {
      await savePilotOffer({ data: { ...scope, id: editing?.id ?? null, offer: parsed.data } });
      setEditing(null);
      setEditorOpen(false);
      setFeedback("Rascunho salvo.");
      await offers.refetch();
    });
  }

  function download(id: string) {
    action.mutate(async () => {
      const result = await exportPilotOffer({ data: { id } });
      const url = URL.createObjectURL(
        new Blob([result.text], { type: "text/plain;charset=utf-8" }),
      );
      const link = document.createElement("a");
      link.href = url;
      link.download = `oferta-${id}-v${result.version}.txt`;
      link.click();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
      setFeedback("Revisão exportada.");
    });
  }

  return (
    <section className="space-y-4" aria-labelledby="pilot-offers-heading">
      <Dialog
        open={editorOpen}
        onOpenChange={(open) => {
          if (action.isPending) return;
          setEditorOpen(open);
          if (!open) setEditing(null);
        }}
      >
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="font-display text-lg font-semibold" id="pilot-offers-heading">
            Piloto de ofertas
          </h2>
          {canManage && (
            <DialogTrigger asChild>
              <Button onClick={() => setFeedback("")}>
                <Plus aria-hidden="true" />
                Nova oferta
              </Button>
            </DialogTrigger>
          )}
        </div>
        {canManage && (
          <DialogContent className="max-h-[85dvh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="font-display">
                {editing ? "Editar oferta" : "Nova oferta"}
              </DialogTitle>
              <DialogDescription>
                Informe o preço observado, a fonte e a validade.
              </DialogDescription>
            </DialogHeader>
            <form
              key={editing?.id ?? "new"}
              onSubmit={submit}
              className="grid min-w-0 gap-3 sm:grid-cols-2"
            >
              <label className="space-y-1">
                Nome
                <Input name="name" required maxLength={120} defaultValue={editing?.revision.name} />
              </label>
              <label className="space-y-1">
                Fonte HTTPS
                <Input
                  name="source"
                  type="url"
                  required
                  maxLength={2048}
                  defaultValue={editing?.revision.source_url}
                />
              </label>
              <label className="space-y-1">
                Preço (R$)
                <Input
                  name="price"
                  inputMode="decimal"
                  required
                  defaultValue={(editing && (editing.revision.price_cents / 100).toFixed(2)) || ""}
                />
              </label>
              <label className="space-y-1">
                Validade (horário local)
                <Input
                  name="expires"
                  type="datetime-local"
                  required
                  defaultValue={(editing && localDate(editing.revision.expires_at)) || ""}
                />
              </label>
              <div className="flex flex-wrap gap-2">
                <Button disabled={action.isPending}>
                  {editing ? "Salvar nova revisão" : "Criar rascunho"}
                </Button>
              </div>
              <p role="status" className="text-sm sm:col-span-2">
                {feedback}
              </p>
            </form>
          </DialogContent>
        )}
      </Dialog>
      {!editorOpen && (
        <p role="status" className="text-sm">
          {feedback}
        </p>
      )}
      {offers.isPending && <p>Carregando ofertas…</p>}
      {offers.isError && <p role="alert">Não foi possível carregar as ofertas.</p>}
      {offers.data?.length === 0 && <p>Nenhuma oferta cadastrada.</p>}
      {offers.data?.length === 50 && <p>Mostrando as 50 ofertas mais recentes.</p>}
      {offers.data?.map(({ id, revision, current_version, approved_version }) => {
        const approved = current_version === approved_version;
        const exportable = canExportOffer(
          {
            version: current_version,
            approvedVersion: approved_version,
            observedAt: revision.observed_at,
            expiresAt: revision.expires_at,
          },
          new Date(),
        );
        return (
          <article key={id} className="space-y-2 rounded-xl border bg-card p-4">
            <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
              <h3 className="min-w-0 break-words font-medium">{revision.name}</h3>
              <p className="font-display shrink-0 font-semibold tabular-nums">
                {priceFormatter.format(revision.price_cents / 100)}
              </p>
            </div>
            <p className="text-sm">
              Revisão {current_version} · {approved ? "Aprovada" : "Aguardando aprovação"}
            </p>
            <details className="text-sm">
              <summary className="cursor-pointer py-1 text-muted-foreground">Ver rascunho</summary>
              <p className="mt-2 whitespace-pre-wrap [overflow-wrap:anywhere]">
                {revision.draft_text}
              </p>
            </details>
            {canManage && (
              <div className="flex flex-wrap gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    onPrepareContent({ id, revision, current_version, approved_version })
                  }
                >
                  Criar conteúdo
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={action.isPending}
                  onClick={() => {
                    setEditing({ id, revision, current_version, approved_version });
                    setFeedback("");
                    setEditorOpen(true);
                  }}
                >
                  Editar
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={approved || action.isPending}
                  onClick={() =>
                    action.mutate(async () => {
                      await approvePilotOffer({ data: { id, version: current_version } });
                      setFeedback("Revisão aprovada.");
                      await offers.refetch();
                    })
                  }
                >
                  Aprovar revisão {current_version}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={!exportable || action.isPending}
                  onClick={() => download(id)}
                >
                  Exportar texto
                </Button>
              </div>
            )}
          </article>
        );
      })}
    </section>
  );
}
