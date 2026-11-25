import { createFileRoute } from "@tanstack/react-router";

// The home route ships no og:image, so serve-time hosting can inject the
// project's social preview (explicit og:image or latest screenshot).
export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Affiliate Intelligence Hub — Fase 0" },
      {
        name: "description",
        content:
          "Arquitetura inicial de comunidades de ofertas afiliadas com controle de custo adicional zero.",
      },
      { property: "og:title", content: "Affiliate Intelligence Hub — Fase 0" },
      {
        property: "og:description",
        content:
          "Planejamento multi-nicho, agentes especializados e controle de franquias gratuitas.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

// IMPORTANT: Replace this placeholder. See ./README.md for routing conventions.
function Index() {
  return (
    <div
      className="flex min-h-screen items-center justify-center"
      style={{ backgroundColor: "#fcfbf8" }}
    >
      <img
        data-lovable-blank-page-placeholder="REMOVE_THIS"
        src="https://cdn.gpteng.co/blank-app-v1.svg"
        alt="Your app will live here!"
      />
    </div>
  );
}
