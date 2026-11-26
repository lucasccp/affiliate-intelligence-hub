import { useState, type FormEvent } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { canExportOffer, manualOfferSchema } from "@/lib/pilot/offer";
import {
  approvePilotOffer,
  exportPilotOffer,
  listPilotOffers,
  savePilotOffer,
} from "@/lib/pilot/offer.functions";
import { useHub } from "./app-context";

type Offer = Awaited<ReturnType<typeof listPilotOffers>>[number];

export function PilotOffers() {
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
}: {
  scope: { workspaceId: string; communityId: string };
  canManage: boolean;
}) {
  const [editing, setEditing] = useState<Offer | null>(null);
  const [formVersion, resetForm] = useState(0);
  const [feedback, setFeedback] = useState("");
  const offers = useQuery({
    queryKey: ["pilot-offers", scope.workspaceId, scope.communityId],
    queryFn: () => listPilotOffers({ data: scope }),
  });
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
      resetForm((value) => value + 1);
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
    <section
      className="mt-6 space-y-4 rounded-lg border p-4"
      aria-labelledby="pilot-offers-heading"
    >
      <h2 className="text-lg font-semibold" id="pilot-offers-heading">
        Piloto de ofertas
      </h2>
      {canManage && (
        <form key={formVersion} onSubmit={submit} className="grid gap-3 sm:grid-cols-2">
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
            {editing && (
              <Button
                type="button"
                variant="outline"
                disabled={action.isPending}
                onClick={() => {
                  setEditing(null);
                  resetForm((value) => value + 1);
                }}
              >
                Cancelar edição
              </Button>
            )}
          </div>
        </form>
      )}
      <p role="status">{feedback}</p>
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
          <article key={id} className="space-y-2 rounded-md border p-3">
            <h3 className="font-medium">{revision.name}</h3>
            <p className="text-sm">
              Revisão {current_version} · {approved ? "Aprovada" : "Aguardando aprovação"}
            </p>
            <p className="whitespace-pre-wrap break-all text-sm">{revision.draft_text}</p>
            {canManage && (
              <div className="flex flex-wrap gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={action.isPending}
                  onClick={() => {
                    setEditing({ id, revision, current_version, approved_version });
                    resetForm((value) => value + 1);
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
