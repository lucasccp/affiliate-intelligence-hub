import { Layers3, Plus, RefreshCw, ArrowRight } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { statusLabels, type statuses } from "@/lib/hub-schema";

export function Brand({ compact = false }: { compact?: boolean }) {
  return <div className="flex items-center gap-2.5 min-w-0"><span className="brand-mark"><Layers3 size={19} strokeWidth={1.8} /></span>{!compact && <div className="min-w-0"><div className="text-[13px] font-semibold leading-4">Affiliate Intelligence</div><div className="text-xs text-muted-foreground mt-0.5">Hub</div></div>}</div>;
}
export function StatusBadge({ status }: { status: string }) {
  const label = statusLabels[status as (typeof statuses)[number]] ?? status;
  return <span className={`status-badge ${status === "active" ? "active" : ""}`}><span className="status-dot" />{label}</span>;
}
export function PageHeading({ title, description, children }: { title: string; description: string; children?: React.ReactNode }) {
  return <div className="flex flex-wrap items-center justify-between gap-4 mb-7"><div><h1 className="page-title">{title}</h1><p className="mt-2 text-sm text-muted-foreground">{description}</p></div>{children}</div>;
}
export function LoadingPage() {
  return <div className="app-content" aria-label="Carregando"><div className="skeleton-line h-8 w-48 mb-8" /><div className="metric-grid">{[1, 2, 3, 4].map((n) => <div key={n} className="skeleton-line h-36" />)}</div><div className="skeleton-line h-64 mt-6" /></div>;
}
export function ErrorPage({ reset }: { reset: () => void }) {
  return <div className="app-content py-20 text-center"><RefreshCw className="mx-auto text-muted-foreground mb-5" size={30} /><h1 className="text-xl font-semibold">Não foi possível carregar seus dados</h1><p className="text-muted-foreground text-sm mt-2 mb-5">Verifique sua conexão e tente novamente.</p><Button onClick={reset}><RefreshCw />Tentar novamente</Button></div>;
}
export function CommunityEmpty({ onCreate }: { onCreate?: () => void }) {
  return <div className="text-center py-14 px-4"><Layers3 className="mx-auto text-muted-foreground mb-4" size={30} /><h3 className="font-medium">Nenhuma comunidade encontrada</h3><p className="text-sm text-muted-foreground mt-2 mb-5">Seu próximo nicho começa aqui.</p>{onCreate ? <Button onClick={onCreate}><Plus />Nova comunidade</Button> : <Button variant="outline" asChild><Link to="/comunidades">Ver comunidades<ArrowRight /></Link></Button>}</div>;
}