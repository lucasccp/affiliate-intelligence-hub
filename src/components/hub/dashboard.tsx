import { Link } from "@tanstack/react-router";
import {
  Users,
  Activity,
  Tags,
  Wallet,
  ArrowUpRight,
  Plus,
  ArrowRight,
  ShieldCheck,
  Circle,
  Layers3,
  Radio,
  Clock3,
  BarChart3,
  CheckCircle2,
  MousePointer2,
  Workflow,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useHub } from "./app-context";
import { StatusBadge, CommunityEmpty, PageHeading } from "./shared";

export function Dashboard() {
  const { data, selectedId } = useHub();
  const rows =
    selectedId === "all" ? data.communities : data.communities.filter((c) => c.id === selectedId);
  const selected = rows[0];
  const metrics = [
    {
      label: "Comunidades",
      value: selectedId === "all" ? data.communityCount : rows.length,
      icon: Users,
      note: "No seu workspace",
      available: true,
    },
    {
      label: "Comunidades ativas",
      value:
        selectedId === "all" ? data.activeCount : rows.filter((c) => c.status === "active").length,
      icon: Activity,
      note: "Em operação",
      available: true,
    },
    {
      label: "Ofertas encontradas",
      value: "—",
      icon: Tags,
      note: "Radar ainda indisponível",
      available: false,
    },
    {
      label: "Comissões",
      value: "—",
      icon: Wallet,
      note: "Métricas ainda indisponíveis",
      available: false,
    },
  ];
  return (
    <>
      <div className="flex items-center gap-2 text-[10px] uppercase text-muted-foreground mb-3">
        <span className="size-1.5 rounded-full bg-success" />
        Visão geral do workspace
      </div>
      <PageHeading
        title={`Olá, ${data.profile.display_name.split(" ")[0] || "Administrador"}`}
        description="Uma visão clara de suas comunidades e da sua operação."
      >
        <Button asChild>
          <Link to="/comunidades">
            <Plus />
            Nova comunidade
          </Link>
        </Button>
      </PageHeading>
      <div className="metric-grid mb-8">
        {metrics.map((metric) => (
          <div className="metric-card" key={metric.label}>
            <div className="flex items-center justify-between gap-2 text-xs text-muted-foreground">
              <span>{metric.label}</span>
              <metric.icon size={16} />
            </div>
            <div
              className={`metric-number mt-4 ${metric.available ? "" : "text-muted-foreground"}`}
            >
              {metric.value}
            </div>
            <div className="text-[11px] text-muted-foreground mt-2 flex items-center gap-1.5">
              {metric.available && <span className="size-1 rounded-full bg-success" />}
              {metric.note}
            </div>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_300px] gap-6 mb-8">
        <section className="min-w-0">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold">
              Suas comunidades{" "}
              <span className="ml-2 text-[11px] font-normal text-muted-foreground">
                {selectedId === "all" ? data.communityCount : rows.length}
              </span>
            </h2>
            <Button variant="link" className="h-auto p-0 text-xs" asChild>
              <Link to="/comunidades">
                Ver todas
                <ArrowRight size={13} />
              </Link>
            </Button>
          </div>
          <div className="surface">
            {rows.length ? (
              <div className="overflow-x-auto">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Comunidade</th>
                      <th>Status</th>
                      <th className="hidden sm:table-cell">Limite diário</th>
                      <th aria-label="Abrir" />
                    </tr>
                  </thead>
                  <tbody>
                    {rows.slice(0, 5).map((c) => (
                      <tr key={c.id}>
                        <td>
                          <Link to="/comunidades" className="flex items-center gap-3">
                            <span className="community-symbol">
                              <Layers3 size={18} />
                            </span>
                            <span>
                              <span className="block font-medium">{c.name}</span>
                              <span className="block text-[11px] text-muted-foreground mt-1">
                                {c.niche}
                              </span>
                            </span>
                          </Link>
                        </td>
                        <td>
                          <StatusBadge status={c.status} />
                        </td>
                        <td className="hidden sm:table-cell text-muted-foreground">
                          {c.daily_offer_limit} ofertas
                        </td>
                        <td>
                          <Button variant="ghost" size="icon" asChild>
                            <Link to="/comunidades" aria-label={`Abrir ${c.name}`}>
                              <ArrowUpRight size={16} />
                            </Link>
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <CommunityEmpty />
            )}
            <div className="p-4 border-t border-border text-[11px] text-muted-foreground flex items-center gap-2">
              <Circle size={11} />
              Cada comunidade tem configurações independentes.
            </div>
          </div>
          <div className="mt-6">
            <h2 className="text-sm font-semibold mb-4">Indicadores da operação</h2>
            <div className="surface grid grid-cols-2 md:grid-cols-3">
              {[
                { name: "Aprovações", icon: CheckCircle2 },
                { name: "Publicações", icon: Radio },
                { name: "Cliques", icon: MousePointer2 },
                { name: "Integrações", icon: Layers3 },
                { name: "Automações", icon: Workflow },
                { name: "Utilização de IA", icon: Sparkles },
              ].map((item) => (
                <div key={item.name} className="p-4 border-b border-r border-border min-w-0">
                  <div className="flex gap-2 items-center text-xs text-muted-foreground">
                    <item.icon size={14} />
                    {item.name}
                  </div>
                  <div className="mt-3 text-lg text-muted-foreground">—</div>
                  <div className="text-[10px] text-muted-foreground mt-1">
                    Indisponível nesta fase
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
        <aside>
          <h2 className="text-sm font-semibold mb-4">Operação sob controle</h2>
          <div className="surface p-5">
            <div className="flex items-center gap-2 text-success text-xs font-medium">
              <ShieldCheck size={17} />
              Política de custo zero
            </div>
            <div className="text-3xl font-medium mt-5">
              R$ 0<span className="text-xl">,00</span>
            </div>
            <p className="text-[11px] text-muted-foreground mt-2">Orçamento adicional autorizado</p>
            <div className="mt-5 pt-4 border-t border-border space-y-3 text-[11px]">
              <div className="flex justify-between">
                <span className="text-muted-foreground">IA externa</span>
                <span>Desabilitada</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Compras automáticas</span>
                <span>Desativadas</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Automação</span>
                <span>Não executada</span>
              </div>
            </div>
            <Button variant="outline" className="w-full mt-5 text-xs" asChild>
              <Link to="/configuracoes">
                Ver configurações
                <ArrowUpRight size={13} />
              </Link>
            </Button>
          </div>
          <div className="mt-6">
            <div className="flex items-center gap-2 mb-4">
              <Clock3 size={14} className="text-muted-foreground" />
              <h2 className="text-sm font-semibold">Atividade recente</h2>
            </div>
            <div className="space-y-5">
              {data.logs.length ? (
                data.logs.map((log) => (
                  <div className="flex gap-3" key={log.id}>
                    <span className="mt-1.5 size-1.5 rounded-full bg-border shrink-0" />
                    <div className="min-w-0">
                      <p className="text-xs">
                        <span className="font-medium">{log.entity_name}</span>
                        <span className="text-muted-foreground">
                          {" "}
                          {log.action === "insert"
                            ? "foi criada"
                            : log.action === "update"
                              ? "foi atualizada"
                              : "foi excluída"}
                        </span>
                      </p>
                      <p className="text-[10px] text-muted-foreground mt-1">
                        {new Intl.DateTimeFormat("pt-BR", {
                          day: "2-digit",
                          month: "short",
                          hour: "2-digit",
                          minute: "2-digit",
                          timeZone: data.profile.timezone,
                        }).format(new Date(log.created_at))}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-xs text-muted-foreground">Nenhuma atividade registrada.</p>
              )}
            </div>
          </div>
        </aside>
      </div>
      {selected && (
        <section className="border-t border-border pt-6">
          <div className="flex flex-wrap gap-3 justify-between mb-4">
            <h2 className="text-sm font-semibold">{selected.name}</h2>
            <span className="text-xs text-muted-foreground">Configuração inicial</span>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <div className="text-[11px] text-muted-foreground mb-2">Categorias</div>
              <div className="flex flex-wrap gap-1.5">
                {selected.community_categories.map((c) => (
                  <span className="status-badge" key={c.name}>
                    {c.name}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <div className="text-[11px] text-muted-foreground mb-2">Marketplaces planejados</div>
              <div className="text-xs leading-6">
                {selected.marketplace_connections.map((m) => m.name).join(" · ") || "Nenhum"}
              </div>
              <span className="text-[10px] text-muted-foreground">Sem conexões externas</span>
            </div>
            <div>
              <div className="text-[11px] text-muted-foreground mb-2">Canais planejados</div>
              <div className="text-xs leading-6">
                {selected.channels.map((m) => m.name).join(" · ") || "Nenhum"}
              </div>
              <span className="text-[10px] text-muted-foreground">Publicação indisponível</span>
            </div>
          </div>
        </section>
      )}
    </>
  );
}
