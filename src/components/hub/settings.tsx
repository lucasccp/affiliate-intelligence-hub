import { useState, type FormEvent } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { UserRound, Building2, ShieldCheck, Save, LoaderCircle, Info } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { updateProfile, updateWorkspace } from "@/lib/hub.functions";
import { profileSchema, workspaceSchema, canManage } from "@/lib/hub-schema";
import { useHub } from "./app-context";
import { PageHeading } from "./shared";

export function Settings() {
  const { data } = useHub();
  const [tab, setTab] = useState("profile");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const queryClient = useQueryClient();
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    const form = new FormData(event.currentTarget);
    const values = Object.fromEntries(form.entries());
    const parsed =
      tab === "profile"
        ? profileSchema.safeParse(values)
        : workspaceSchema.safeParse({
            ...values,
            daily_offer_limit: Number(form.get("daily_offer_limit")),
            zero_cost_budget: 0,
          });
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Verifique os campos");
      return;
    }
    setBusy(true);
    try {
      if (tab === "profile") await updateProfile({ data: profileSchema.parse(values) });
      else
        await updateWorkspace({
          data: {
            id: data.workspace.id,
            values: workspaceSchema.parse({
              ...values,
              daily_offer_limit: Number(form.get("daily_offer_limit")),
              zero_cost_budget: 0,
            }),
          },
        });
      await queryClient.invalidateQueries({ queryKey: ["hub"] });
      toast.success("Configurações salvas");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Não foi possível salvar.");
    } finally {
      setBusy(false);
    }
  }
  return (
    <>
      <PageHeading
        title="Configurações"
        description="Seu perfil, seu workspace e os limites da sua operação."
      />
      <div className="border-b border-border flex gap-2 mb-7 overflow-x-auto">
        {[
          { id: "profile", label: "Perfil e preferências", icon: UserRound },
          { id: "workspace", label: "Workspace", icon: Building2 },
          { id: "policy", label: "Custo zero", icon: ShieldCheck },
        ].map((item) => (
          <Button
            key={item.id}
            variant="ghost"
            onClick={() => {
              setTab(item.id);
              setError("");
            }}
            className={`rounded-none text-xs pb-4 h-12 border-b-2 ${tab === item.id ? "border-primary text-foreground" : "border-transparent text-muted-foreground"}`}
            aria-pressed={tab === item.id}
          >
            <item.icon size={15} />
            {item.label}
          </Button>
        ))}
      </div>
      {tab === "policy" ? (
        <div className="max-w-2xl">
          <div className="flex items-center gap-3 mb-5">
            <ShieldCheck className="text-success" size={28} />
            <div>
              <h2 className="font-semibold">Nenhum gasto adicional autorizado</h2>
              <p className="text-xs text-muted-foreground mt-1">
                A política financeira não pode ser alterada aqui.
              </p>
            </div>
          </div>
          <div className="surface p-6">
            <div className="flex justify-between items-center">
              <span className="text-sm">Orçamento adicional</span>
              <span className="font-mono text-xl">R$ 0,00</span>
            </div>
            <div className="border-t border-border mt-6 pt-5 space-y-4 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Provedores de IA</span>
                <span>Desabilitados</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Fallback pago</span>
                <span>Bloqueado</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Compras de créditos</span>
                <span>Não habilitadas pelo app</span>
              </div>
            </div>
          </div>
          <div className="mt-5 flex gap-3 text-xs text-muted-foreground leading-6">
            <Info size={17} className="shrink-0 mt-1" />
            <p>
              Lovable Cloud usa franquia gratuita e, após ela, pode consumir créditos existentes do
              workspace. Nenhum limite de bloqueio Cloud foi encontrado. A política do aplicativo
              não substitui os controles de cobrança da plataforma.
            </p>
          </div>
        </div>
      ) : (
        <form
          key={`${tab}-${data.profile.updated_at}-${data.workspace.updated_at}`}
          onSubmit={submit}
          className="max-w-2xl"
        >
          <div className="mb-6">
            <h2 className="text-base font-semibold">
              {tab === "profile" ? "Perfil e preferências" : "Dados do workspace"}
            </h2>
            <p className="text-xs text-muted-foreground mt-2">
              {tab === "profile"
                ? "Informações da sua conta e preferências pessoais."
                : "Configurações compartilhadas por suas comunidades."}
            </p>
          </div>
          {tab === "profile" ? (
            <div className="space-y-5">
              <div className="field">
                <label htmlFor="settings-name">Nome de exibição</label>
                <Input
                  id="settings-name"
                  name="display_name"
                  defaultValue={data.profile.display_name}
                  required
                  maxLength={100}
                />
              </div>
              <div className="field">
                <label htmlFor="settings-avatar">URL do avatar</label>
                <Input
                  id="settings-avatar"
                  name="avatar_url"
                  defaultValue={data.profile.avatar_url}
                  placeholder="https://..."
                  type="url"
                />
              </div>
              <div className="form-grid">
                <div className="field">
                  <label htmlFor="settings-language">Idioma</label>
                  <Input
                    id="settings-language"
                    name="language"
                    defaultValue={data.profile.language}
                    required
                  />
                </div>
                <div className="field">
                  <label htmlFor="settings-timezone">Timezone</label>
                  <Input
                    id="settings-timezone"
                    name="timezone"
                    defaultValue={data.profile.timezone}
                    required
                  />
                </div>
              </div>
              <div className="field">
                <label htmlFor="settings-theme">Aparência</label>
                <select
                  id="settings-theme"
                  name="theme"
                  className="field-control"
                  defaultValue={data.profile.theme}
                >
                  <option value="light">Claro</option>
                  <option value="dark">Escuro</option>
                  <option value="system">Usar preferência do sistema</option>
                </select>
              </div>
            </div>
          ) : (
            <fieldset disabled={!canManage(data.role)} className="space-y-5">
              <div className="field">
                <label htmlFor="workspace-name">Nome do workspace</label>
                <Input
                  id="workspace-name"
                  name="name"
                  defaultValue={data.workspace.name}
                  required
                  maxLength={100}
                />
              </div>
              <div className="form-grid">
                <div className="field">
                  <label htmlFor="workspace-language">Idioma padrão</label>
                  <Input
                    id="workspace-language"
                    name="language"
                    defaultValue={data.workspace.language}
                    required
                  />
                </div>
                <div className="field">
                  <label htmlFor="workspace-timezone">Timezone padrão</label>
                  <Input
                    id="workspace-timezone"
                    name="timezone"
                    defaultValue={data.workspace.timezone}
                    required
                  />
                </div>
              </div>
              <div className="field">
                <label htmlFor="workspace-limit">Limite operacional diário de ofertas</label>
                <Input
                  id="workspace-limit"
                  name="daily_offer_limit"
                  type="number"
                  min={0}
                  max={10000}
                  step={1}
                  defaultValue={data.workspace.daily_offer_limit}
                  required
                />
                <p className="text-xs text-muted-foreground">
                  Teto permitido para o limite de cada comunidade. Não executa automações.
                </p>
              </div>
              <div className="field">
                <label htmlFor="workspace-budget">Orçamento adicional autorizado</label>
                <Input id="workspace-budget" value="R$ 0,00" disabled readOnly />
              </div>
            </fieldset>
          )}
          {error && (
            <p className="text-sm text-destructive mt-5" role="alert">
              {error}
            </p>
          )}
          <div className="mt-7 pt-5 border-t border-border flex justify-end">
            <Button disabled={busy || (tab === "workspace" && !canManage(data.role))}>
              {busy ? <LoaderCircle className="animate-spin" /> : <Save />}Salvar alterações
            </Button>
          </div>
        </form>
      )}
    </>
  );
}
