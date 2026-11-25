import { LayoutDashboard, Terminal, Users, Factory, Palette, PanelsTopLeft, Radio, BrainCircuit, Image, ShieldCheck, ShoppingBag, Radar, ListChecks, Link2, FileText, CalendarDays, Workflow, ChartNoAxesCombined, ScrollText, Settings } from "lucide-react";
export const navigation = [
  { label: "Visão geral", items: [{ label: "Dashboard", icon: LayoutDashboard, path: "/dashboard" }, { label: "Command Center", icon: Terminal }] },
  { label: "Comunidades", items: [{ label: "Comunidades", icon: Users, path: "/comunidades" }, { label: "Community Factory", icon: Factory }, { label: "Brand Studio", icon: Palette }, { label: "Landing Pages", icon: PanelsTopLeft }, { label: "Canais", icon: Radio }] },
  { label: "Inteligência artificial", items: [{ label: "AI Center", icon: BrainCircuit }, { label: "Image Studio", icon: Image }, { label: "Cost Guardian", icon: ShieldCheck }] },
  { label: "Monetização", items: [{ label: "Marketplaces", icon: ShoppingBag }, { label: "Radar de Ofertas", icon: Radar }, { label: "Central de Aprovação", icon: ListChecks }, { label: "Links de Afiliados", icon: Link2 }] },
  { label: "Conteúdo e operação", items: [{ label: "Content Studio", icon: FileText }, { label: "Calendário", icon: CalendarDays }, { label: "Automações", icon: Workflow }] },
  { label: "Gestão", items: [{ label: "Analytics", icon: ChartNoAxesCombined }, { label: "Logs", icon: ScrollText }, { label: "Configurações", icon: Settings, path: "/configuracoes" }] },
] as const;