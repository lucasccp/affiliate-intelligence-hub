import { createFileRoute } from "@tanstack/react-router";
import { ResetPasswordScreen } from "@/components/hub/auth-screen";
import { pageHead } from "@/lib/page-head";
export const Route = createFileRoute("/reset-password")({
  head: () => pageHead("Redefinir senha", "Recupere o acesso seguro à sua conta no Affiliate Intelligence Hub."),
  component: ResetPasswordScreen,
});