import { useEffect, useState, type FormEvent } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { ArrowRight, ArrowLeft, LoaderCircle, Mail, Eye, EyeOff, ShieldCheck } from "lucide-react";
import { LovableMark } from "@lovable.dev/cloud-auth-js/react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import { useAuth } from "./auth-context";
import { Brand } from "./shared";

export function AuthScreen() {
  const [mode, setMode] = useState<"login" | "signup" | "forgot">("login");
  const [busy, setBusy] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  useEffect(() => {
    if (user && !loading) void navigate({ to: "/dashboard", replace: true });
  }, [user, loading, navigate]);
  function changeMode(next: typeof mode) {
    setMode(next);
    setNotice("");
    setError("");
  }
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError("");
    setNotice("");
    const form = new FormData(event.currentTarget);
    const email = String(form.get("email") ?? "").trim();
    const password = String(form.get("password") ?? "");
    try {
      if (mode === "forgot") {
        const result = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/reset-password`,
        });
        if (result.error) throw result.error;
        setNotice(
          "Se o endereço estiver cadastrado, você receberá um link para redefinir sua senha.",
        );
      } else if (mode === "signup") {
        const result = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: window.location.origin,
            data: { display_name: String(form.get("display_name") ?? "") },
          },
        });
        if (result.error) throw result.error;
        if (result.data.session) await navigate({ to: "/dashboard" });
        else setNotice("Confira seu e-mail e confirme o cadastro antes de entrar.");
      } else {
        const result = await supabase.auth.signInWithPassword({ email, password });
        if (result.error) throw result.error;
        await navigate({ to: "/dashboard" });
      }
    } catch (e) {
      const message = e instanceof Error ? e.message : "";
      setError(
        message.includes("not allowed") || message.includes("reserved")
          ? "Informe um e-mail real que possa receber mensagens. Endereços de exemplo não são aceitos."
          : message.includes("Invalid login")
            ? "E-mail ou senha incorretos."
            : message.includes("Email not confirmed")
              ? "Confirme seu e-mail antes de entrar."
              : message.includes("rate")
                ? "Muitas tentativas. Aguarde um pouco e tente novamente."
                : "Não foi possível concluir. Verifique seus dados e tente novamente.",
      );
    } finally {
      setBusy(false);
    }
  }
  async function social(provider: "google" | "lovable") {
    setBusy(true);
    try {
      const result = await lovable.auth.signInWithOAuth(provider, {
        redirect_uri: window.location.origin,
      });
      if (result.error) throw result.error;
      if (!result.redirected) await navigate({ to: "/dashboard" });
    } catch {
      toast.error("Não foi possível entrar com este provedor.");
    } finally {
      setBusy(false);
    }
  }
  return (
    <div className="auth-page">
      <div className="auth-panel">
        <div className="auth-brand">
          <Brand />
        </div>
        <div className="mb-7">
          <h1 className="text-[28px] font-semibold">
            {mode === "signup"
              ? "Crie sua conta"
              : mode === "forgot"
                ? "Recupere seu acesso"
                : "Bem-vindo de volta"}
          </h1>
          <p className="text-sm text-muted-foreground mt-2">
            {mode === "signup"
              ? "Seu workspace. Suas comunidades."
              : mode === "forgot"
                ? "Enviaremos um link para seu e-mail."
                : "Entre no seu workspace para continuar."}
          </p>
        </div>
        {notice && (
          <div
            className="p-4 bg-success-soft text-success rounded-md text-sm mb-5 flex items-start gap-2"
            role="status"
          >
            <Mail size={18} className="shrink-0" />
            {notice}
          </div>
        )}
        <form className="auth-form" onSubmit={submit}>
          {mode === "signup" && (
            <div className="field">
              <label htmlFor="display_name">Seu nome</label>
              <Input
                id="display_name"
                name="display_name"
                required
                maxLength={100}
                autoComplete="name"
                placeholder="Como podemos chamar você?"
              />
            </div>
          )}
          <div className="field">
            <label htmlFor="email">E-mail</label>
            <Input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="voce@exemplo.com"
              required
            />
          </div>
          {mode !== "forgot" && (
            <div className="field">
              <div className="flex justify-between items-center">
                <label htmlFor="password">Senha</label>
                {mode === "login" && (
                  <Button
                    variant="link"
                    type="button"
                    className="h-auto p-0 text-xs"
                    onClick={() => changeMode("forgot")}
                  >
                    Esqueceu a senha?
                  </Button>
                )}
              </div>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete={mode === "signup" ? "new-password" : "current-password"}
                  minLength={8}
                  required
                  className="pr-10"
                  placeholder={mode === "signup" ? "Pelo menos 8 caracteres" : "Sua senha"}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0"
                  aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff /> : <Eye />}
                </Button>
              </div>
            </div>
          )}
          {error && (
            <p className="text-sm text-destructive" role="alert">
              {error}
            </p>
          )}
          <Button type="submit" className="w-full h-10" disabled={busy}>
            {busy ? <LoaderCircle className="animate-spin" /> : null}
            {mode === "signup"
              ? "Criar conta"
              : mode === "forgot"
                ? "Enviar link de recuperação"
                : "Entrar no workspace"}
            {!busy && <ArrowRight />}
          </Button>
        </form>
        {mode !== "forgot" && (
          <>
            <div className="flex items-center gap-4 my-6 text-[11px] text-muted-foreground">
              <span className="h-px bg-border flex-1" />
              ou continue com
              <span className="h-px bg-border flex-1" />
            </div>
            <div className="grid grid-cols-1 gap-2">
              <Button
                variant="provider"
                className="h-10"
                disabled={busy}
                onClick={() => social("google")}
              >
                <svg aria-hidden="true" viewBox="0 0 24 24" className="size-[18px]">
                  <path
                    fill="#4285F4"
                    d="M23.49 12.27c0-.79-.07-1.54-.19-2.27H12v4.51h6.47c-.29 1.48-1.14 2.73-2.4 3.58v3h3.86c2.26-2.09 3.56-5.17 3.56-8.82z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.86-3c-1.08.72-2.45 1.16-4.07 1.16-3.13 0-5.78-2.11-6.73-4.96H1.29v3.09C3.26 21.3 7.31 24 12 24z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.27 14.29c-.25-.72-.38-1.49-.38-2.29s.14-1.57.38-2.29V6.62H1.29C.47 8.24 0 10.06 0 12s.47 3.76 1.29 5.38l3.98-3.09z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.7 1.29 6.62l3.98 3.09c.95-2.85 3.6-4.96 6.73-4.96z"
                  />
                </svg>
                Continuar com Google
              </Button>
              <Button
                variant="outline"
                className="h-10"
                disabled={busy}
                onClick={() => social("lovable")}
              >
                <LovableMark className="size-[18px]" />
                Continuar com Lovable
              </Button>
            </div>
          </>
        )}
        <div className="text-center text-xs text-muted-foreground mt-7">
          {mode === "forgot" ? (
            <Button variant="link" onClick={() => changeMode("login")} className="text-xs">
              <ArrowLeft />
              Voltar ao login
            </Button>
          ) : (
            <>
              {mode === "signup" ? "Já tem uma conta? " : "Ainda não tem uma conta? "}
              <Button
                variant="link"
                className="h-auto p-0 text-xs"
                onClick={() => changeMode(mode === "signup" ? "login" : "signup")}
              >
                {mode === "signup" ? "Entrar" : "Criar conta"}
              </Button>
            </>
          )}
        </div>
        <div className="border-t border-border mt-8 pt-5 flex items-center justify-center gap-2 text-[11px] text-muted-foreground">
          <ShieldCheck size={13} />
          Seu workspace, protegido e independente
        </div>
      </div>
    </div>
  );
}

export function ResetPasswordScreen() {
  const [ready, setReady] = useState(false);
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");
  useEffect(() => {
    const hash = new URLSearchParams(window.location.hash.slice(1));
    if (hash.get("type") === "recovery") setReady(true);
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") setReady(true);
    });
    return () => subscription.unsubscribe();
  }, []);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const password = String(form.get("password") ?? "");
    if (password !== form.get("confirm")) {
      setError("As senhas não coincidem.");
      return;
    }
    setBusy(true);
    setError("");
    const { error: updateError } = await supabase.auth.updateUser({ password });
    if (updateError)
      setError("O link expirou ou a senha não atende aos requisitos. Solicite um novo link.");
    else setDone(true);
    setBusy(false);
  }
  return (
    <div className="auth-page">
      <div className="auth-panel">
        <div className="auth-brand">
          <Brand />
        </div>
        <h1 className="text-2xl font-semibold mb-3">
          {done ? "Senha atualizada" : "Redefinir senha"}
        </h1>
        {done ? (
          <Button className="mt-4" asChild>
            <Link to="/dashboard">
              Ir ao workspace
              <ArrowRight />
            </Link>
          </Button>
        ) : ready ? (
          <form onSubmit={submit} className="auth-form mt-6">
            <div className="field">
              <label htmlFor="new-password">Nova senha</label>
              <Input
                id="new-password"
                name="password"
                type="password"
                minLength={8}
                autoComplete="new-password"
                required
              />
            </div>
            <div className="field">
              <label htmlFor="confirm-password">Confirme a senha</label>
              <Input id="confirm-password" name="confirm" type="password" minLength={8} required />
            </div>
            {error && (
              <p role="alert" className="text-destructive text-sm">
                {error}
              </p>
            )}
            <Button disabled={busy}>
              {busy && <LoaderCircle className="animate-spin" />}Salvar nova senha
            </Button>
          </form>
        ) : (
          <>
            <p className="text-sm text-muted-foreground mb-6">
              Abra o link de recuperação enviado ao seu e-mail para redefinir sua senha.
            </p>
            <Button variant="outline" asChild>
              <Link to="/auth">Voltar ao login</Link>
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
