import { useEffect } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { LoaderCircle } from "lucide-react";
import { useAuth } from "@/components/hub/auth-context";
import { Brand } from "@/components/hub/shared";
import { pageHead } from "@/lib/page-head";
export const Route = createFileRoute("/")({
  head: () => pageHead("Workspace", "Gerencie comunidades de ofertas afiliadas com configurações independentes e orçamento adicional zero."),
  component: Index,
});
function Index() {
  const { user, loading } = useAuth(); const navigate = useNavigate();
  useEffect(() => { if (!loading) void navigate({ to: user ? "/dashboard" : "/auth", replace: true }); }, [user, loading, navigate]);
  return <div className="auth-page"><div className="text-center space-y-6"><Brand /><LoaderCircle className="animate-spin mx-auto text-muted-foreground" size={20} /><p className="text-sm text-muted-foreground">Abrindo seu workspace…</p></div></div>;
}
