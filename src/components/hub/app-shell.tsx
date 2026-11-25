import { useState, type ReactNode } from "react";
import { Link, useRouterState, useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { PanelLeftClose, PanelLeftOpen, Menu, X, ChevronsUpDown, ChevronRight, Moon, Sun, LogOut, ShieldCheck, ArrowUpRight, CircleHelp } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { updateProfile } from "@/lib/hub.functions";
import { useHub } from "./app-context";
import { navigation } from "./navigation";
import { Brand } from "./shared";

export function AppShell({ children }: { children: ReactNode }) {
  const { data, selectedId, setSelectedId, theme, setTheme } = useHub();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [signingOut, setSigningOut] = useState(false);
  const path = useRouterState({ select: (s) => s.location.pathname });
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const active = path === "/comunidades" ? "Comunidades" : path === "/configuracoes" ? "Configurações" : "Dashboard";
  async function logout() {
    setSigningOut(true);
    try { await queryClient.cancelQueries(); queryClient.clear(); const { error } = await supabase.auth.signOut(); if (error) throw error; await navigate({ to: "/auth", replace: true }); }
    catch { toast.error("Não foi possível sair. Tente novamente."); setSigningOut(false); }
  }
  async function toggleTheme() {
    const next = theme === "dark" ? "light" : "dark"; setTheme(next);
    try { await updateProfile({ data: { display_name: data.profile.display_name || "Administrador", avatar_url: data.profile.avatar_url, language: data.profile.language, timezone: data.profile.timezone, theme: next } }); await queryClient.invalidateQueries({ queryKey: ["hub"] }); }
    catch { setTheme(theme); toast.error("Não foi possível salvar o tema."); }
  }
  return <div className={`app-layout ${collapsed ? "is-collapsed" : ""}`}>
    {mobileOpen && <div className="fixed inset-0 z-40 bg-overlay md:hidden" onClick={() => setMobileOpen(false)} aria-hidden="true" />}
    <aside className={`app-sidebar ${mobileOpen ? "mobile-open" : ""}`} aria-label="Navegação principal">
      <div className="h-20 px-5 flex items-center justify-between shrink-0"><Brand compact={collapsed && !mobileOpen} /><Button variant="ghost" size="icon" className="md:hidden" aria-label="Fechar menu" onClick={() => setMobileOpen(false)}><X /></Button></div>
      {(!collapsed || mobileOpen) && <div className="mx-3 mb-4 px-3 py-2.5 rounded-md border border-border bg-background flex items-center gap-2"><span className="community-symbol size-7 text-xs font-semibold">{data.workspace.name.charAt(0)}</span><span className="text-xs font-medium truncate flex-1">{data.workspace.name}</span><ChevronsUpDown size={13} className="text-muted-foreground" /></div>}
      <nav className="px-2 pb-6 flex-1 space-y-5">{navigation.map((group) => <div key={group.label}>
        {(!collapsed || mobileOpen) && <div className="px-3 mb-2 text-[10px] font-medium text-muted-foreground uppercase">{group.label}</div>}
        <div className="space-y-0.5">{group.items.map((item) => {
          const target = "path" in item ? item.path : null;
          return target ? <Button key={item.label} variant="ghost" className="nav-item" data-active={path === target} title={item.label} asChild><Link to={target} onClick={() => setMobileOpen(false)}><item.icon size={16} />{(!collapsed || mobileOpen) && <span>{item.label}</span>}</Link></Button> : <Button key={item.label} variant="ghost" className="nav-item" disabled title={`${item.label} · Indisponível`}><item.icon size={16} />{(!collapsed || mobileOpen) && <><span className="flex-1 text-left">{item.label}</span><span className="text-[9px]">Em breve</span></>}</Button>;
        })}</div></div>)}</nav>
      <div className="p-3 border-t border-border">{(!collapsed || mobileOpen) && <div className="flex gap-2 items-center text-[11px] text-success mb-4 px-2"><ShieldCheck size={15} />Política de custo zero</div>}<Button variant="ghost" className="w-full justify-start h-auto p-2" asChild><Link to="/configuracoes" onClick={() => setMobileOpen(false)}><span className="community-symbol size-8 text-xs font-medium">{(data.profile.display_name || "A").charAt(0).toUpperCase()}</span>{(!collapsed || mobileOpen) && <span className="text-left min-w-0"><span className="block text-xs truncate max-w-36">{data.profile.display_name || "Administrador"}</span><span className="block text-[10px] text-muted-foreground">{data.role === "owner" ? "Proprietário" : data.role === "admin" ? "Administrador" : "Leitor"}</span></span>}</Link></Button></div>
    </aside>
    <div className="min-w-0"><header className="app-header">
      <Button variant="ghost" size="icon" className="hidden md:inline-flex" aria-label={collapsed ? "Expandir sidebar" : "Recolher sidebar"} title={collapsed ? "Expandir sidebar" : "Recolher sidebar"} onClick={() => setCollapsed(!collapsed)}>{collapsed ? <PanelLeftOpen /> : <PanelLeftClose />}</Button>
      <Button variant="ghost" size="icon" className="md:hidden shrink-0" aria-label="Abrir menu" onClick={() => setMobileOpen(true)}><Menu /></Button>
      <div className="hidden lg:flex gap-2 items-center text-xs text-muted-foreground"><span>Workspace</span><ChevronRight size={12} /><span className="text-foreground">{active}</span></div>
      <div className="flex-1" />
      <select className="field-control max-w-56 text-xs min-w-0" aria-label="Comunidade global" value={selectedId} onChange={(e) => setSelectedId(e.target.value)}><option value="all">Todas as comunidades</option>{data.communities.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}</select>
      <Button variant="ghost" size="icon" className="shrink-0" onClick={toggleTheme} aria-label={theme === "dark" ? "Usar tema claro" : "Usar tema escuro"} title="Alterar tema">{theme === "dark" ? <Sun /> : <Moon />}</Button>
      <Button variant="ghost" size="icon" className="shrink-0" aria-label="Sair" title="Sair da conta" disabled={signingOut} onClick={logout}><LogOut /></Button>
    </header><main className="app-content">{children}</main><footer className="mx-4 md:mx-8 pb-6 pt-2 flex flex-wrap items-center justify-between gap-3 text-[11px] text-muted-foreground"><span>Affiliate Intelligence Hub <span className="mx-2">/</span> Fundação</span><Button variant="link" asChild className="h-auto p-0 text-[11px] text-muted-foreground"><a href="https://docs.lovable.dev/features/cloud" target="_blank" rel="noreferrer"><CircleHelp size={12} />Documentação<ArrowUpRight size={12} /></a></Button></footer></div>
  </div>;
}