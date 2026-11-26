<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.

## What Lovable manages

Rules outside this block are the project's own. Change the pieces below in
Lovable, not by hand. With the [Lovable MCP](https://mcp.lovable.dev)
connected, `send_message` asks Lovable to do it; otherwise ask the user to
use the editor.

- **Database.** Do not add or edit `supabase/migrations/` or `drizzle/`.
  Ask Lovable to change the schema.
- **Generated files.** Do not edit a file whose header says it is automatically
  generated.
- **AI gateway.** Keep model calls on Lovable's gateway, and keep
  `LOVABLE_API_KEY` out of browser code.
- **Connectors.** Lovable provides native connectors. `list_connectors` shows
  which are enabled; `add_connector` only returns the dashboard link. When a
  connector is enabled, calls go through the connector gateway and need
  `LOVABLE_API_KEY`. When Lovable does not provide one, users can bring their
  own key and store it in Secrets.
- **Secrets.** Lovable manages them. Do not put secret values in the repo.
<!-- LOVABLE:END -->

## Project architecture rules

- Read `docs/PROJECT_STATUS.md` and the approved phase scope before changing the project; phase gates prevent accidental implementation beyond the authorized deliverable.
- Consult `docs/ZERO_COST_POLICY.md` before proposing infrastructure or providers; financial eligibility is a mandatory prerequisite, not a runtime fallback.
- Preserve the managed block above and record conflicts in `docs/ARCHITECTURE.md`; unsupported platform assumptions must not become silent stack changes.
- Keep TanStack Start file-based routing, React, TypeScript, Tailwind and reusable shadcn components; the existing application bootstrap is the supported platform boundary.
- Use TanStack server functions for internal application operations and authenticated server routes for external callbacks; this environment does not use Supabase Edge Functions for application logic.
- Model specialized agents as typed services coordinated by durable workflow records; this avoids autonomous processes with unbounded execution.
- Scope community resources through workspace and community identifiers and enforce database authorization; UI filters are not a tenant security boundary.
- Centralize inference admission and reservations by provider account, not modality; textual and visual work must not maintain independent allowance ledgers for one account.
- Keep provider contracts independent of transport and use deterministic domain logic first; changing an eligible provider must not rewrite the community workflow.
- Store long-running work in PostgreSQL with leases, idempotency keys and bounded retries; requests must not depend on in-memory state surviving serverless invocations.
- Validate boundary inputs and outputs and keep credentials server-side; provider content and browser data are untrusted.
- Implement incremental migrations, RLS and behavioral tests only in their authorized implementation phase; conceptual schemas are not deployed protections.
- Treat local Node-based inference bridges as optional separate processes, never as dependencies of SSR; local resources are not guaranteed to be reachable from hosted execution.
- Keep signed-in routes under the single `_authenticated` layout and protect every RPC with the generated bearer middleware; the layout is only navigation protection, not the data security boundary.
- Create personal workspaces and their pilot data through the idempotent signup lifecycle function in migrations; never seed from a page, loader or ordinary application RPC.
- Store workspace roles in the protected membership table, not profiles or editable auth metadata; direct role changes are not part of the personal-workspace interface.
- Save community and child configurations through one invoker SQL transaction; partial writes must roll back without losing the previous configuration.
- Enforce operational ceilings and immutable workspace ownership in database triggers as well as input schemas; direct authenticated Data API calls must preserve the same invariants.
- Exclude platform-generated integration and migration artifacts from source linting rather than editing them; the platform owns their formatting and generation.
- Run integration tests only with explicit test accounts and clean them up with checked results; no end-to-end test may alter an existing person's data.

- Before any project task, read `docs/PROJECT_MASTER_GUIDE.md`, `docs/PROJECT_STATUS.md`, `docs/ROADMAP.md` and relevant phase documents. Follow the V4 execution routing and explicit phase authorization; report the next tool and copy-ready prompt. For marketplace research read `docs/COMPETITIVE_BENCHMARK.md`; never treat competitor behavior as official API permission or export marketplace sessions.

## Consolidação V4.0 — SenaFlow (26/11/2026)

- Aplicar complemento SenaFlow do manual mestre em cada fase pertinente. Não confundir grupo operacional com destino de mensagens. Não implementar cookies SiteStripe, exportação de sessões, pareamento não oficial ou bypass de bloqueio. Regras de coleta/publicação versionadas e determinísticas. Preservar bloco Lovable e atualizar status/checkpoint após cada fase autorizada.
