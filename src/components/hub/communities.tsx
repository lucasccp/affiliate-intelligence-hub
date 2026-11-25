import { useDeferredValue, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Plus,
  Search,
  SlidersHorizontal,
  Layers3,
  Pencil,
  Trash2,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
} from "lucide-react";
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
import { deleteCommunity, type Community } from "@/lib/hub.functions";
import { communityPageQuery } from "@/lib/hub-query";
import { canManage, statuses, statusLabels, modeLabels } from "@/lib/hub-schema";
import { useHub } from "./app-context";
import { PageHeading, StatusBadge, CommunityEmpty } from "./shared";
import { CommunityForm } from "./community-form";

export function Communities() {
  const { data, selectedId } = useHub();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const deferredSearch = useDeferredValue(search);
  const [status, setStatus] = useState("all");
  const [page, setPage] = useState(0);
  const [editor, setEditor] = useState<{ community: Community | null } | null>(null);
  const [deleting, setDeleting] = useState<Community | null>(null);
  const [busy, setBusy] = useState(false);
  const result = useQuery(
    communityPageQuery(
      data.workspace.id,
      deferredSearch,
      status,
      selectedId === "all" ? page : 0,
      selectedId === "all" ? null : selectedId,
    ),
  );
  const editable = canManage(data.role);
  async function remove() {
    if (!deleting) return;
    setBusy(true);
    try {
      await deleteCommunity({ data: { id: deleting.id } });
      setDeleting(null);
      setPage(0);
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["hub"] }),
        queryClient.invalidateQueries({ queryKey: ["communities"] }),
      ]);
      toast.success("Comunidade excluída");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Não foi possível excluir.");
    } finally {
      setBusy(false);
    }
  }
  return (
    <>
      <PageHeading
        title="Comunidades"
        description="Cada nicho tem seu próprio espaço para crescer."
      >
        {editable && (
          <Button onClick={() => setEditor({ community: null })}>
            <Plus />
            Nova comunidade
          </Button>
        )}
      </PageHeading>
      <div className="flex flex-wrap justify-between items-center gap-3 mb-5">
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-2.5 text-muted-foreground" size={15} />
          <Input
            className="pl-9"
            placeholder="Buscar por nome ou nicho"
            aria-label="Buscar comunidades"
            value={search}
            disabled={selectedId !== "all"}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(0);
            }}
          />
        </div>
        <div className="flex gap-2 items-center">
          <SlidersHorizontal size={14} className="text-muted-foreground" />
          <select
            aria-label="Filtrar por status"
            className="field-control w-44"
            value={status}
            onChange={(e) => {
              setStatus(e.target.value);
              setPage(0);
            }}
          >
            <option value="all">Todos os status</option>
            {statuses.map((s) => (
              <option key={s} value={s}>
                {statusLabels[s]}
              </option>
            ))}
          </select>
          <Button
            variant="outline"
            size="icon"
            title="Atualizar"
            aria-label="Atualizar comunidades"
            onClick={() => result.refetch()}
          >
            <RefreshCw size={14} />
          </Button>
        </div>
      </div>
      <div className="surface">
        {result.isLoading ? (
          <div className="p-5 space-y-4" aria-label="Carregando comunidades">
            {[1, 2, 3].map((n) => (
              <div key={n} className="skeleton-line h-16" />
            ))}
          </div>
        ) : result.isError ? (
          <div className="py-12 text-center">
            <p className="text-sm text-muted-foreground mb-4">
              Não foi possível carregar as comunidades.
            </p>
            <Button variant="outline" onClick={() => result.refetch()}>
              <RefreshCw />
              Tentar novamente
            </Button>
          </div>
        ) : result.data?.rows.length ? (
          <div className="overflow-x-auto">
            <table className="data-table min-w-[590px]">
              <thead>
                <tr>
                  <th>Comunidade</th>
                  <th>Status</th>
                  <th>Operação</th>
                  <th>Ofertas/dia</th>
                  <th className="text-right">Ações</th>
                </tr>
              </thead>
              <tbody>
                {result.data.rows.map((c) => (
                  <tr key={c.id}>
                    <td>
                      <div className="flex items-center gap-3">
                        <span className="community-symbol">
                          <Layers3 size={18} />
                        </span>
                        <div>
                          <div className="font-medium">{c.name}</div>
                          <div className="text-[11px] text-muted-foreground mt-1">{c.niche}</div>
                          <div className="text-[10px] text-muted-foreground mt-0.5">/{c.slug}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <StatusBadge status={c.status} />
                    </td>
                    <td className="text-muted-foreground">
                      {modeLabels[c.automation_mode as keyof typeof modeLabels] ??
                        c.automation_mode}
                    </td>
                    <td className="text-muted-foreground">{c.daily_offer_limit}</td>
                    <td>
                      <div className="flex gap-1 justify-end">
                        <Button
                          variant="ghost"
                          size="icon"
                          title={editable ? "Editar comunidade" : "Sem permissão para editar"}
                          aria-label={`Editar ${c.name}`}
                          disabled={!editable}
                          onClick={() => setEditor({ community: c })}
                        >
                          <Pencil size={15} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          title="Excluir comunidade"
                          aria-label={`Excluir ${c.name}`}
                          disabled={!editable}
                          onClick={() => setDeleting(c)}
                        >
                          <Trash2 size={15} />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <CommunityEmpty
            {...(editable ? { onCreate: () => setEditor({ community: null }) } : {})}
          />
        )}
        <div className="px-5 py-3 border-t border-border flex items-center justify-between gap-2 text-xs text-muted-foreground">
          <span>
            {result.data?.total ?? 0} comunidade{result.data?.total === 1 ? "" : "s"}
          </span>
          <div className="flex items-center gap-2">
            <span>
              Página {page + 1} de {Math.max(1, Math.ceil((result.data?.total ?? 0) / 8))}
            </span>
            <Button
              variant="outline"
              size="icon"
              className="size-7"
              aria-label="Página anterior"
              disabled={page === 0}
              onClick={() => setPage(page - 1)}
            >
              <ChevronLeft size={13} />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="size-7"
              aria-label="Próxima página"
              disabled={(page + 1) * 8 >= (result.data?.total ?? 0)}
              onClick={() => setPage(page + 1)}
            >
              <ChevronRight size={13} />
            </Button>
          </div>
        </div>
      </div>
      <div className="flex gap-2 items-start text-[11px] text-muted-foreground mt-5">
        <Layers3 size={13} className="shrink-0 mt-0.5" />
        Marketplaces e canais são configurações planejadas. Nenhuma integração externa é ativada
        nesta fase.
      </div>
      {editor && (
        <CommunityForm
          key={editor.community?.id ?? "new"}
          open
          community={editor.community}
          onClose={() => setEditor(null)}
        />
      )}
      <Dialog
        open={Boolean(deleting)}
        onOpenChange={(open) => {
          if (!open && !busy) setDeleting(null);
        }}
      >
        <DialogContent className="w-[calc(100%-24px)] rounded-lg">
          <DialogHeader>
            <DialogTitle>Excluir comunidade?</DialogTitle>
            <DialogDescription>
              “{deleting?.name}” e suas configurações serão excluídas permanentemente. Esta ação não
              pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={() => setDeleting(null)} disabled={busy}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={remove} disabled={busy}>
              <Trash2 />
              Excluir comunidade
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
