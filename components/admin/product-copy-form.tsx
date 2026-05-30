'use client';

import { useState } from 'react';
import { Check, Copy, Loader2, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { ProductCopyOutput } from '@/lib/product-copy/types';

const ATTRIBUTES_TEMPLATE_SOL = `{
  "frame_shape": "rectangular",
  "frame_material": "acetate",
  "frame_color": "negro",
  "lens_color": "verde",
  "lens_treatment": ["polarized", "uv400"],
  "gender": "unisex",
  "weight_grams": 28,
  "measurements": {
    "frame_width_mm": 142,
    "lens_height_mm": 45,
    "bridge_mm": 22,
    "lens_width_mm": 52,
    "temple_length_mm": 150
  }
}`;

const ATTRIBUTES_TEMPLATE_RX = `{
  "frame_shape": "redondo",
  "frame_material": "acetate",
  "frame_color": "carey",
  "gender": "unisex",
  "weight_grams": 26,
  "measurements": {
    "frame_width_mm": 138,
    "lens_height_mm": 42,
    "bridge_mm": 20,
    "lens_width_mm": 50,
    "temple_length_mm": 145
  }
}`;

type CategorySlug = 'anteojos-de-sol' | 'anteojos-de-receta';
type Status = 'idle' | 'loading' | 'success' | 'error';

export function ProductCopyForm() {
  const [name, setName] = useState('');
  const [brandName, setBrandName] = useState('');
  const [categorySlug, setCategorySlug] = useState<CategorySlug>(
    'anteojos-de-sol',
  );
  const [priceArs, setPriceArs] = useState('');
  const [attributesJson, setAttributesJson] = useState(ATTRIBUTES_TEMPLATE_SOL);
  const [status, setStatus] = useState<Status>('idle');
  const [error, setError] = useState<string | null>(null);
  const [output, setOutput] = useState<ProductCopyOutput | null>(null);

  const onCategoryChange = (next: CategorySlug) => {
    setCategorySlug(next);
    // Si el textarea sigue con el template default (sin editar), lo intercambio.
    if (
      attributesJson === ATTRIBUTES_TEMPLATE_SOL ||
      attributesJson === ATTRIBUTES_TEMPLATE_RX
    ) {
      setAttributesJson(
        next === 'anteojos-de-sol'
          ? ATTRIBUTES_TEMPLATE_SOL
          : ATTRIBUTES_TEMPLATE_RX,
      );
    }
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (status === 'loading') return;

    setStatus('loading');
    setError(null);
    setOutput(null);

    let attributes: Record<string, unknown>;
    try {
      attributes = JSON.parse(attributesJson);
    } catch {
      setStatus('error');
      setError('JSON de atributos inválido. Revisá comas y comillas.');
      return;
    }

    const priceCents = priceArs.trim()
      ? Math.round(parseFloat(priceArs) * 100)
      : undefined;

    if (priceCents !== undefined && (!Number.isFinite(priceCents) || priceCents <= 0)) {
      setStatus('error');
      setError('Precio inválido. Usá un número positivo (ej. 89000).');
      return;
    }

    try {
      const res = await fetch('/api/admin/generate-product-copy', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          name,
          brandName,
          categorySlug,
          attributes,
          priceCents,
        }),
      });

      if (!res.ok) {
        const data = (await res.json().catch(() => ({}))) as { error?: string };
        setError(data.error ?? `Error ${res.status}`);
        setStatus('error');
        return;
      }

      const data = (await res.json()) as ProductCopyOutput;
      setOutput(data);
      setStatus('success');
    } catch {
      setError('No pudimos conectar con el servicio.');
      setStatus('error');
    }
  };

  return (
    <div className="grid gap-8 md:grid-cols-[420px_1fr]">
      <form
        onSubmit={onSubmit}
        className="border-border/60 bg-background space-y-4 rounded-xl border p-5"
      >
        <FormField label="Nombre del producto" htmlFor="name">
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Vulk Day Light"
            required
            minLength={3}
            className="border-border focus:border-foreground/40 bg-background w-full rounded-md border px-3 py-2 text-sm outline-none transition-colors"
          />
        </FormField>

        <FormField label="Marca" htmlFor="brand">
          <input
            id="brand"
            type="text"
            value={brandName}
            onChange={(e) => setBrandName(e.target.value)}
            placeholder="Vulk"
            required
            minLength={2}
            className="border-border focus:border-foreground/40 bg-background w-full rounded-md border px-3 py-2 text-sm outline-none transition-colors"
          />
        </FormField>

        <FormField label="Categoría" htmlFor="category">
          <select
            id="category"
            value={categorySlug}
            onChange={(e) => onCategoryChange(e.target.value as CategorySlug)}
            className="border-border focus:border-foreground/40 bg-background w-full rounded-md border px-3 py-2 text-sm outline-none transition-colors"
          >
            <option value="anteojos-de-sol">Anteojos de sol</option>
            <option value="anteojos-de-receta">Anteojos de receta</option>
          </select>
        </FormField>

        <FormField label="Precio ARS (opcional)" htmlFor="price">
          <input
            id="price"
            type="number"
            min="0"
            step="0.01"
            value={priceArs}
            onChange={(e) => setPriceArs(e.target.value)}
            placeholder="89000"
            className="border-border focus:border-foreground/40 bg-background w-full rounded-md border px-3 py-2 text-sm outline-none transition-colors"
          />
        </FormField>

        <FormField label="Attributes (JSON)" htmlFor="attributes">
          <textarea
            id="attributes"
            value={attributesJson}
            onChange={(e) => setAttributesJson(e.target.value)}
            rows={16}
            className="border-border focus:border-foreground/40 bg-background w-full rounded-md border px-3 py-2 font-mono text-xs outline-none transition-colors"
          />
        </FormField>

        <Button
          type="submit"
          size="lg"
          className="w-full"
          disabled={status === 'loading'}
        >
          {status === 'loading' ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              Generando con IA…
            </>
          ) : (
            <>
              <Sparkles className="size-4" />
              Generar copy
            </>
          )}
        </Button>

        {error && (
          <p className="text-destructive text-center text-xs">{error}</p>
        )}
      </form>

      <div className="space-y-4">
        {output === null ? (
          <div className="border-border/60 bg-muted/20 text-muted-foreground flex h-full min-h-[400px] items-center justify-center rounded-xl border p-8 text-sm">
            {status === 'loading'
              ? 'Generando…'
              : 'El copy generado aparece acá.'}
          </div>
        ) : (
          <OutputPreview output={output} />
        )}
      </div>
    </div>
  );
}

function FormField({
  label,
  htmlFor,
  children,
}: {
  label: string;
  htmlFor: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label
        htmlFor={htmlFor}
        className="text-foreground mb-1.5 block text-xs font-semibold uppercase tracking-wide"
      >
        {label}
      </label>
      {children}
    </div>
  );
}

function OutputPreview({ output }: { output: ProductCopyOutput }) {
  return (
    <div className="space-y-4">
      <OutputField
        label="short_description"
        value={output.shortDescription}
        charCount
      />
      <OutputField
        label="meta_title"
        value={output.metaTitle}
        charCount
      />
      <OutputField
        label="meta_description"
        value={output.metaDescription}
        charCount
      />
      <OutputField label="description" value={output.description} multiline />
      <CalloutsPreview callouts={output.callouts} />
      <CopyAllJson output={output} />
    </div>
  );
}

function OutputField({
  label,
  value,
  charCount = false,
  multiline = false,
}: {
  label: string;
  value: string;
  charCount?: boolean;
  multiline?: boolean;
}) {
  return (
    <div className="border-border/60 bg-background rounded-lg border p-4">
      <div className="flex items-center justify-between">
        <p className="text-foreground text-xs font-semibold uppercase tracking-wide">
          {label}
          {charCount && (
            <span className="text-muted-foreground ml-2 font-mono normal-case tracking-normal">
              ({value.length} chars)
            </span>
          )}
        </p>
        <CopyButton value={value} />
      </div>
      <p
        className={`text-foreground mt-2 ${multiline ? 'whitespace-pre-wrap text-sm' : 'text-sm'}`}
      >
        {value}
      </p>
    </div>
  );
}

function CalloutsPreview({
  callouts,
}: {
  callouts: ProductCopyOutput['callouts'];
}) {
  return (
    <div className="border-border/60 bg-background rounded-lg border p-4">
      <div className="flex items-center justify-between">
        <p className="text-foreground text-xs font-semibold uppercase tracking-wide">
          callouts (3)
        </p>
        <CopyButton value={JSON.stringify(callouts, null, 2)} label="JSON" />
      </div>
      <div className="mt-3 space-y-3">
        {callouts.map((c, idx) => (
          <div
            key={idx}
            className="border-border/50 bg-muted/20 rounded-md border p-3"
          >
            <p className="text-brand text-xs font-medium uppercase tracking-wide">
              {c.type} · {c.position}
            </p>
            <p className="text-foreground mt-1 text-sm font-semibold">
              {c.title}
            </p>
            <p className="text-muted-foreground mt-1 text-xs leading-relaxed">
              {c.body}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

function CopyAllJson({ output }: { output: ProductCopyOutput }) {
  const json = JSON.stringify(output, null, 2);
  return (
    <details className="border-border/60 bg-muted/10 rounded-lg border p-4">
      <summary className="text-foreground cursor-pointer text-xs font-semibold uppercase tracking-wide">
        Output completo (JSON)
      </summary>
      <div className="mt-3 flex justify-end">
        <CopyButton value={json} label="JSON" />
      </div>
      <pre className="border-border/40 bg-background mt-2 overflow-x-auto rounded-md border p-3 font-mono text-xs">
        {json}
      </pre>
    </details>
  );
}

function CopyButton({
  value,
  label = 'Copiar',
}: {
  value: string;
  label?: string;
}) {
  const [copied, setCopied] = useState(false);
  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // Ignore: clipboard puede fallar en HTTP no-secure, no es bloqueante.
    }
  };
  return (
    <button
      type="button"
      onClick={onCopy}
      className="border-border text-foreground hover:bg-muted/40 inline-flex items-center gap-1.5 rounded-md border bg-transparent px-2.5 py-1 text-xs font-medium transition-colors"
    >
      {copied ? (
        <>
          <Check className="size-3.5" />
          Copiado
        </>
      ) : (
        <>
          <Copy className="size-3.5" />
          {label}
        </>
      )}
    </button>
  );
}
