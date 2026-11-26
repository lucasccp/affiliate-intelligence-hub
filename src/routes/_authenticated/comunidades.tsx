import { createFileRoute } from "@tanstack/react-router";
import { Communities } from "@/components/hub/communities";
import { PilotOffers } from "@/components/hub/pilot-offers";
import { AssistedStudio } from "@/components/hub/assisted-studio";
import { hubQuery, communityPageQuery } from "@/lib/hub-query";
import { pageHead } from "@/lib/page-head";
export const Route = createFileRoute("/_authenticated/comunidades")({
  head: () =>
    pageHead(
      "Comunidades",
      "Crie, edite e gerencie comunidades de qualquer nicho, com configurações independentes.",
    ),
  loader: async ({ context }) => {
    const hub = await context.queryClient.ensureQueryData(hubQuery);
    return context.queryClient.ensureQueryData(communityPageQuery(hub.workspace.id));
  },
  component: () => (
    <>
      <Communities />
      <PilotOffers />
      <AssistedStudio />
    </>
  ),
});
