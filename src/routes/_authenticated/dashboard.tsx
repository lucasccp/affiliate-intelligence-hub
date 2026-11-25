import { createFileRoute } from "@tanstack/react-router";
import { Dashboard } from "@/components/hub/dashboard";
import { pageHead } from "@/lib/page-head";
export const Route = createFileRoute("/_authenticated/dashboard")({
  head: () =>
    pageHead(
      "Dashboard",
      "Acompanhe suas comunidades, configurações e atividade real do workspace.",
    ),
  component: Dashboard,
});
