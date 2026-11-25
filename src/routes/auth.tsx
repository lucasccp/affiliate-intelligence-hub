import { createFileRoute } from "@tanstack/react-router";
import { AuthScreen } from "@/components/hub/auth-screen";
import { pageHead } from "@/lib/page-head";
export const Route = createFileRoute("/auth")({
  head: () => pageHead("Acessar conta", "Entre ou cadastre-se para administrar seu workspace de comunidades afiliadas."),
  component: AuthScreen,
});