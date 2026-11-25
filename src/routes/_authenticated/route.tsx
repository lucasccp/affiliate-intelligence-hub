import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { hubQuery } from "@/lib/hub-query";
import { AppProvider } from "@/components/hub/app-context";
import { AppShell } from "@/components/hub/app-shell";
import { LoadingPage, ErrorPage } from "@/components/hub/shared";
export const Route = createFileRoute("/_authenticated")({
  ssr: false,
  beforeLoad: async () => { const { data, error } = await supabase.auth.getUser(); if (error || !data.user) throw redirect({ to: "/auth" }); },
  loader: ({ context }) => context.queryClient.ensureQueryData(hubQuery),
  component: AuthenticatedLayout,
  pendingComponent: LoadingPage,
  errorComponent: ({ reset }) => <ErrorPage reset={reset} />,
});
function AuthenticatedLayout() {
  const { data } = useSuspenseQuery(hubQuery);
  return <AppProvider data={data}><AppShell><Outlet /></AppShell></AppProvider>;
}