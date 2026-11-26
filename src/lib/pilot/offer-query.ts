import { queryOptions } from "@tanstack/react-query";
import { listPilotOffers } from "./offer.functions";

export type PilotOffer = Awaited<ReturnType<typeof listPilotOffers>>[number];

export function pilotOfferQuery(scope: { workspaceId: string; communityId: string }) {
  return queryOptions({
    queryKey: ["pilot-offers", scope.workspaceId, scope.communityId],
    queryFn: () => listPilotOffers({ data: scope }),
  });
}
