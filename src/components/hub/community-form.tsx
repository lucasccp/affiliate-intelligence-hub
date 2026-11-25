import { useState, type FormEvent } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { LoaderCircle, Save } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  communitySchema,
  statusLabels,
  statuses,
  modeLabels,
  modes,
  toSlug,
  parseList,
} from "@/lib/hub-schema";
import { saveCommunity, type Community } from "@/lib/hub.functions";
import { useHub } from "./app-context";

export function CommunityForm({
  community,
  open,
  onClose,
}: {
  community: Community | null;
  open: boolean;
  onClose: () => void;
}) {
  const { data } = useHub();
  const queryClient = useQueryClient();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [name, setName] = useState(community?.name ?? "");
  const [slug, setSlug] = useState(community?.slug ?? "");
  const [slugEdited, setSlugEdited] = useState(Boolean(community));
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setError("");
    const values = Object.fromEntries(form.entries());
    const result = communitySchema.safeParse({
      ...values,
      name,
      slug,
      daily_offer_limit: Number(form.get("daily_offer_limit")),
      categories: parseList(String(form.get("categories") ?? "")),
      marketplaces: parseList(String(form.get("marketplaces") ?? "")),
      channels: parseList(String(form.get("channels") ?? "")),
    });
    if (!result.success) {
      setError(result.error.issues[0]?.message ?? "Verifique os campos.");
      return;
    }
    setBusy(true);
    try {
      await saveCommunity({
        data: { workspaceId: data.workspace.id, id: community?.id ?? null, community: result.data },
      });
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["hub"] }),
        queryClient.invalidateQueries({ queryKey: ["communities"] }),
      ]);
      toast.success(community ? "Comunidade atualizada" : "Comunidade criada");
      onClose();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Não foi possível salvar.");
    } finally {
      setBusy(false);
    }
  }
  return (
    <Dialog
      open={open}
      onOpenChange={(value) => {
        if (!value && !busy) onClose();
      }}
    >
      <DialogContent className="max-w-2xl max-h-[90dvh] overflow-y-auto w-[calc(100%-24px)] rounded-lg p-5 sm:p-7">
        <DialogHeader>
          <DialogTitle>{community ? "Editar comunidade" : "Nova comunidade"}</DialogTitle>
          <DialogDescription>
            Um nicho, uma identidade, uma operação independente.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={submit} className="space-y-6 mt-2">
          <div className="form-grid">
            <div className="field">
              <label htmlFor="community-name">Nome</label>
              <Input
                id="community-name"
                name="name"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (!slugEdited) setSlug(toSlug(e.target.value));
                }}
                required
                maxLength={120}
                placeholder="Nome da comunidade"
              />
            </div>
            <div className="field">
              <label htmlFor="community-slug">Slug</label>
              <Input
                id="community-slug"
                name="slug"
                value={slug}
                onChange={(e) => {
                  setSlug(e.target.value);
                  setSlugEdited(true);
                }}
                required
                maxLength={120}
                placeholder="nome-da-comunidade"
              />
            </div>
            <div className="field">
              <label htmlFor="community-niche">Nicho</label>
              <Input
                id="community-niche"
                name="niche"
                defaultValue={community?.niche ?? ""}
                required
                maxLength={200}
                placeholder="Ex.: Literatura, tecnologia, beleza"
              />
            </div>
            <div className="field">
              <label htmlFor="community-status">Status</label>
              <select
                id="community-status"
                name="status"
                className="field-control"
                defaultValue={community?.status ?? "draft"}
              >
                {statuses.map((s) => (
                  <option key={s} value={s}>
                    {statusLabels[s]}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="field">
            <label htmlFor="community-description">Descrição</label>
            <textarea
              id="community-description"
              name="description"
              className="field-control min-h-20 resize-y"
              defaultValue={community?.description ?? ""}
              maxLength={2000}
              placeholder="O propósito da sua comunidade"
            />
          </div>
          <div className="field">
            <label htmlFor="community-audience">Público-alvo</label>
            <Input
              id="community-audience"
              name="target_audience"
              defaultValue={community?.target_audience ?? ""}
              maxLength={1000}
              placeholder="Para quem são as ofertas?"
            />
          </div>
          <div className="border-t border-border pt-5">
            <h3 className="text-sm font-medium mb-4">Preferências e operação</h3>
            <div className="form-grid">
              <div className="field">
                <label htmlFor="community-language">Idioma</label>
                <Input
                  id="community-language"
                  name="language"
                  defaultValue={community?.language ?? data.workspace.language}
                  required
                  placeholder="pt-BR"
                />
              </div>
              <div className="field">
                <label htmlFor="community-currency">Moeda</label>
                <select
                  id="community-currency"
                  name="currency"
                  className="field-control"
                  defaultValue={community?.currency ?? "BRL"}
                >
                  {["BRL", "USD", "EUR", "GBP", "ARS", "MXN"].map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </select>
              </div>
              <div className="field">
                <label htmlFor="community-timezone">Timezone</label>
                <Input
                  id="community-timezone"
                  name="timezone"
                  defaultValue={community?.timezone ?? data.workspace.timezone}
                  required
                />
              </div>
              <div className="field">
                <label htmlFor="community-limit">Limite diário de ofertas únicas</label>
                <Input
                  id="community-limit"
                  name="daily_offer_limit"
                  type="number"
                  min={0}
                  max={data.workspace.daily_offer_limit}
                  step={1}
                  defaultValue={
                    community?.daily_offer_limit ?? Math.min(20, data.workspace.daily_offer_limit)
                  }
                  required
                />
              </div>
              <div className="field sm:col-span-2">
                <label htmlFor="community-mode">Modo de automação</label>
                <select
                  id="community-mode"
                  name="automation_mode"
                  className="field-control"
                  defaultValue={community?.automation_mode ?? "assisted"}
                >
                  {modes.map((m) => (
                    <option key={m} value={m}>
                      {modeLabels[m]}
                    </option>
                  ))}
                </select>
                <p className="text-[11px] text-muted-foreground">
                  Configuração registrada. Automações ainda indisponíveis.
                </p>
              </div>
            </div>
          </div>
          <div className="border-t border-border pt-5 space-y-4">
            <h3 className="text-sm font-medium">Categorias e destinos</h3>
            <div className="field">
              <label htmlFor="community-categories">Categorias</label>
              <Input
                id="community-categories"
                name="categories"
                defaultValue={community?.community_categories.map((c) => c.name).join(", ") ?? ""}
                placeholder="Separe as categorias por vírgula"
              />
            </div>
            <div className="field">
              <label htmlFor="community-marketplaces">Marketplaces</label>
              <Input
                id="community-marketplaces"
                name="marketplaces"
                defaultValue={
                  community?.marketplace_connections.map((c) => c.name).join(", ") ?? ""
                }
                placeholder="Separe os marketplaces por vírgula"
              />
            </div>
            <div className="field">
              <label htmlFor="community-channels">Canais</label>
              <Input
                id="community-channels"
                name="channels"
                defaultValue={community?.channels.map((c) => c.name).join(", ") ?? ""}
                placeholder="Separe os canais por vírgula"
              />
              <p className="text-[11px] text-muted-foreground">
                Destinos planejados, sem conexão ou publicação externa.
              </p>
            </div>
          </div>
          {error && (
            <p className="text-sm text-destructive" role="alert">
              {error}
            </p>
          )}
          <div className="flex justify-end gap-2 border-t border-border pt-4">
            <Button type="button" variant="outline" onClick={onClose} disabled={busy}>
              Cancelar
            </Button>
            <Button type="submit" disabled={busy}>
              {busy ? <LoaderCircle className="animate-spin" /> : <Save />}
              {community ? "Salvar alterações" : "Criar comunidade"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
