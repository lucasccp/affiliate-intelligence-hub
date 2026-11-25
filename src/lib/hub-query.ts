import { queryOptions } from "@tanstack/react-query";
import { getHub, getCommunityPage } from "./hub.functions";
export const hubQuery = queryOptions({ queryKey: ["hub"], queryFn: () => getHub(), staleTime: 30000 });
export function communityPageQuery(workspaceId: string, search = "", status = "all", page = 0, communityId: string | null = null) {
  return queryOptions({ queryKey: ["communities", workspaceId, search, status, page, communityId], queryFn: () => getCommunityPage({ data: { workspaceId, search, status, page, communityId } }), staleTime: 10000 });
}