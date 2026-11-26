import { useEffect, useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  acceptedImageTypes,
  briefSchema,
  importedTextSchema,
  makeAssistedDrafts,
  simulateSharedAllowance,
  validateImportedImage,
} from "@/lib/pilot/assisted";
import { useHub } from "./app-context";

export function AssistedStudio() {
  const { data, selectedId } = useHub();
  const community = data.communities.find(({ id }) => id === selectedId);
  if (!community || (data.role !== "owner" && data.role !== "admin")) return null;
  return <Studio key={community.id} community={community.name} niche={community.niche} />;
}

function Studio({ community, niche }: { community: string; niche: string }) {
  const [drafts, setDrafts] = useState<ReturnType<typeof makeAssistedDrafts>>();
  const [manual, setManual] = useState("");
  const [imported, setImported] = useState("");
  const [file, setFile] = useState<File>();
  const [preview, setPreview] = useState("");
  const [feedback, setFeedback] = useState("");
  const [simulation, setSimulation] = useState<ReturnType<typeof simulateSharedAllowance>>();
  const [validating, setValidating] = useState(false);

  useEffect(() => {
    if (!file) return;
    const url = URL.createObjectURL(file);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  function prepare(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const fields = new FormData(event.currentTarget);
    const brief = briefSchema.safeParse({
      community,
      niche,
      objective: fields.get("objective"),
      format: fields.get("format"),
    });
    if (!brief.success) {
      setFeedback("Informe um objetivo com até 500 caracteres e escolha o formato.");
      return;
    }
    setDrafts(makeAssistedDrafts(brief.data));
    setFeedback("Rascunho e prompts preparados.");
  }

  async function copy(value: string) {
    try {
      await navigator.clipboard.writeText(value);
      setFeedback("Copiado.");
    } catch {
      setFeedback("Selecione o conteúdo no campo para copiar.");
    }
  }

  return (
    <section
      className="space-y-5 rounded-xl border bg-card p-4 sm:p-6"
      aria-labelledby="assisted-heading"
    >
      <h2 id="assisted-heading" className="font-display text-lg font-semibold">
        Conteúdo assistido
      </h2>
      <p className="text-sm text-muted-foreground">
        Use templates, leve os prompts à ferramenta de sua escolha e revise materiais importados
        nesta sessão.
      </p>
      <form onSubmit={prepare} className="space-y-3">
        <label className="block space-y-1">
          Objetivo da peça
          <Textarea name="objective" required maxLength={500} />
        </label>
        <label className="block space-y-1">
          Formato de imagem
          <select name="format" className="block rounded-md border bg-background px-3 py-2">
            {briefSchema.shape.format.options.map((format) => (
              <option key={format}>{format}</option>
            ))}
          </select>
        </label>
        <Button>Preparar conteúdo</Button>
      </form>
      {drafts && (
        <div className="grid gap-3 lg:grid-cols-3">
          {(
            [
              ["Rascunho por template", drafts.template],
              ["Prompt de texto", drafts.textPrompt],
              ["Prompt de imagem", drafts.imagePrompt],
            ] as const
          ).map(([label, value]) => (
            <div key={label} className="space-y-2">
              <label className="block space-y-1">
                {label}
                <Textarea readOnly value={value} rows={6} />
              </label>
              <Button variant="outline" onClick={() => void copy(value)}>
                Copiar {label.toLowerCase()}
              </Button>
            </div>
          ))}
        </div>
      )}
      <div className="space-y-2">
        <label className="block space-y-1">
          Texto produzido externamente
          <Textarea
            value={manual}
            onChange={(event) => setManual(event.currentTarget.value)}
            maxLength={6000}
          />
        </label>
        <Button
          variant="outline"
          onClick={() => {
            const result = importedTextSchema.safeParse(manual);
            if (!result.success) {
              setFeedback("Cole o texto que deseja importar.");
              return;
            }
            setImported(result.data);
            setFeedback("Texto importado para revisão nesta sessão.");
          }}
        >
          Importar texto
        </Button>
        {imported && (
          <div className="space-y-2">
            <p className="text-sm font-medium">Rascunho importado · aguardando revisão</p>
            <p className="whitespace-pre-wrap break-words text-sm">{imported}</p>
            <Button variant="outline" onClick={() => void copy(imported)}>
              Copiar rascunho importado
            </Button>
          </div>
        )}
      </div>
      <label className="block space-y-1">
        Imagem para revisão local (JPG, PNG ou WebP, até 5 MB)
        <input
          type="file"
          className="block max-w-full text-sm"
          accept={acceptedImageTypes.join(",")}
          disabled={validating}
          onChange={async (event) => {
            const input = event.currentTarget;
            const candidate = input.files?.[0];
            input.value = "";
            if (!candidate) return;
            setValidating(true);
            try {
              if (!(await validateImportedImage(candidate))) {
                setFeedback("Selecione um JPG, PNG ou WebP válido de até 5 MB.");
                return;
              }
              setFile(candidate);
              setFeedback("Imagem carregada para revisão local.");
            } catch {
              setFeedback("Não foi possível ler a imagem.");
            } finally {
              setValidating(false);
            }
          }}
        />
      </label>
      {file && preview && (
        <img
          src={preview}
          alt="Imagem importada para revisão"
          onError={() => {
            setFile(undefined);
            setPreview("");
            setFeedback("Não foi possível abrir a imagem.");
          }}
          className="max-h-64 max-w-full rounded object-contain"
        />
      )}
      <div className="space-y-2">
        <Button
          variant="outline"
          onClick={() => setSimulation(simulateSharedAllowance(new Date()))}
        >
          Simular franquia de texto e imagem
        </Button>
        {simulation && (
          <p className="text-sm">
            Saldo simulado de 10.000 unidades, com margem de 2.000. Texto (6.000):{" "}
            {simulation.text.allowed ? "admitido" : "bloqueado"}. Imagem (5.000):{" "}
            {simulation.image.allowed ? "admitida" : "bloqueada"}.
          </p>
        )}
      </div>
      <p role="status" className="text-sm">
        {feedback}
      </p>
    </section>
  );
}
