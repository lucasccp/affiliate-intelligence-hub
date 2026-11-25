import { createFileRoute } from "@tanstack/react-router";
import { Settings } from "@/components/hub/settings";
import { pageHead } from "@/lib/page-head";
export const Route = createFileRoute("/_authenticated/configuracoes")({
  head: () =>
    pageHead(
      "Configurações",
      "Gerencie seu perfil, preferências, workspace e a política de custo adicional zero.",
    ),
  component: Settings,
});
