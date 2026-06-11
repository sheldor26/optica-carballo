/**
 * Smoke test del lector de receta: valida que la combinación de parámetros
 * que usa `app/api/prescription/route.ts` (modelo + adaptive thinking +
 * tools + tool_choice auto + historia few-shot con tool_use/tool_result)
 * sea aceptada por la API de Anthropic — SIN levantar el server.
 *
 * Manda una imagen mínima (1×1 PNG): no importa el contenido de la
 * extracción, importa que la API devuelva 200 con un tool_use block
 * (o texto), no un 400 por parámetros inválidos.
 *
 * Uso: pnpm rx:smoke   (lee ANTHROPIC_API_KEY de .env.local)
 *
 * Creado 2026-06-11 al migrar budget_tokens (deprecado) → adaptive thinking
 * y subir la extracción a Opus 4.8. Correr de nuevo ante cualquier cambio
 * de modelo/params del lector.
 */
import {
  PRESCRIPTION_SYSTEM_PROMPT,
  PRESCRIPTION_USER_PROMPT,
} from '../lib/prescription/prompt';
import { EXTRACT_PRESCRIPTION_TOOL } from '../lib/prescription/tool-schema';
import { FEW_SHOT_MESSAGES } from '../lib/prescription/few-shot';

// Mantener en sync con app/api/prescription/route.ts
const EXTRACT_MODEL_ID = 'claude-opus-4-8';
const MAX_TOKENS = 8192;

const TINY_PNG_BASE64 =
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==';

async function main() {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    console.error('Falta ANTHROPIC_API_KEY (corré con --env-file=.env.local)');
    process.exit(1);
  }

  const body = {
    model: EXTRACT_MODEL_ID,
    max_tokens: MAX_TOKENS,
    thinking: { type: 'adaptive' },
    tools: [EXTRACT_PRESCRIPTION_TOOL],
    tool_choice: { type: 'auto' },
    system: PRESCRIPTION_SYSTEM_PROMPT,
    messages: [
      ...FEW_SHOT_MESSAGES,
      {
        role: 'user' as const,
        content: [
          {
            type: 'image',
            source: {
              type: 'base64',
              media_type: 'image/png',
              data: TINY_PNG_BASE64,
            },
          },
          { type: 'text', text: PRESCRIPTION_USER_PROMPT },
        ],
      },
    ],
  };

  console.log(`POST /v1/messages — model=${EXTRACT_MODEL_ID} thinking=adaptive tools=1 few-shot=${FEW_SHOT_MESSAGES.length} msgs`);
  const started = Date.now();
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'content-type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  const ms = Date.now() - started;
  if (!res.ok) {
    const errText = await res.text();
    console.error(`❌ HTTP ${res.status} en ${ms}ms`);
    console.error(errText.slice(0, 800));
    process.exit(1);
  }

  const data = (await res.json()) as {
    stop_reason: string;
    content: Array<{ type: string; name?: string; input?: unknown }>;
    usage?: Record<string, unknown>;
  };

  const blocks = data.content.map((b) => b.type).join(',');
  const toolBlock = data.content.find(
    (b) => b.type === 'tool_use' && b.name === EXTRACT_PRESCRIPTION_TOOL.name,
  );
  console.log(`✅ HTTP 200 en ${ms}ms`);
  console.log(`   stop_reason=${data.stop_reason} | blocks=[${blocks}]`);
  console.log(`   usage=${JSON.stringify(data.usage)}`);
  if (toolBlock) {
    const input = toolBlock.input as { isPrescription?: boolean };
    console.log(
      `   tool_use OK → isPrescription=${input?.isPrescription} (esperado: false, es un PNG 1×1)`,
    );
  } else {
    console.log(
      '   ⚠️ sin tool_use block (el route tiene fallback para este caso, pero revisar si pasa seguido)',
    );
  }
}

void main();
