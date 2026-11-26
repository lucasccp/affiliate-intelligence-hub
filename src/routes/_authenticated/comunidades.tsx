import type { PilotOffer } from "@/lib/pilot/offer-query";
import { useRef, useState } from "react";
import { Layers3, PenLine, Tag } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useHub } from "@/components/hub/app-context";
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
  component: CommunityWorkspace,
});

function CommunityWorkspace() {
  const [tab, setTab] = useState("communities");
  const [offerSelection, setOfferSelection] = useState<{
    communityId: string;
    offer: PilotOffer;
  }>();
  const contentTab = useRef<HTMLButtonElement>(null);
  const offersTab = useRef<HTMLButtonElement>(null);
  const { data, selectedId } = useHub();
  const selected = data.communities.find(({ id }) => id === selectedId);
  const canManage = data.role === "owner" || data.role === "admin";

  return (
    <Tabs value={tab} onValueChange={setTab} className="min-w-0 space-y-5">
      <header className="community-workspace-header rounded-2xl border p-4 shadow-sm sm:p-6">
        <h1 className="font-display text-2xl font-semibold tracking-tight sm:text-3xl">
          Comunidades
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {selected ? selected.name : "Todas as comunidades"}
        </p>
        <TabsList
          aria-label="Áreas de trabalho"
          className="community-workspace-tabs mt-5 grid h-auto w-full auto-cols-fr grid-flow-col gap-1 sm:w-fit"
        >
          <TabsTrigger value="communities" className="min-h-11 gap-2 px-2 sm:px-4">
            <Layers3 className="hidden size-4 sm:block" aria-hidden="true" />
            Gestão
          </TabsTrigger>
          <TabsTrigger ref={offersTab} value="offers" className="min-h-11 gap-2 px-2 sm:px-4">
            <Tag className="hidden size-4 sm:block" aria-hidden="true" />
            Ofertas
          </TabsTrigger>
          {canManage && (
            <TabsTrigger ref={contentTab} value="content" className="min-h-11 gap-2 px-2 sm:px-4">
              <PenLine className="hidden size-4 sm:block" aria-hidden="true" />
              Conteúdo
            </TabsTrigger>
          )}
        </TabsList>
      </header>
      <TabsContent value="communities" forceMount className="data-[state=inactive]:hidden">
        <Communities
          onOpenOffers={() => {
            setTab("offers");
            offersTab.current?.focus();
          }}
        />
      </TabsContent>
      <TabsContent value="offers" forceMount className="data-[state=inactive]:hidden">
        <PilotOffers
          onPrepareContent={(offer) => {
            setOfferSelection({ communityId: selectedId, offer });
            setTab("content");
            contentTab.current?.focus();
          }}
        />
      </TabsContent>
      {canManage && (
        <TabsContent value="content" forceMount className="data-[state=inactive]:hidden">
          {selected ? (
            <AssistedStudio
              offer={offerSelection?.communityId === selected.id ? offerSelection.offer : undefined}
              onSelectOffer={(offer) =>
                setOfferSelection(offer ? { communityId: selected.id, offer } : undefined)
              }
            />
          ) : (
            <p className="text-sm text-muted-foreground">
              Selecione uma comunidade para preparar conteúdo.
            </p>
          )}
        </TabsContent>
      )}
    </Tabs>
  );
}
