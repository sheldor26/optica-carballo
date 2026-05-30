import 'server-only';
import { createHmac, timingSafeEqual } from 'node:crypto';
import { cookies } from 'next/headers';
import {
  prescriptionCookieSchema,
  type PrescriptionCookie,
} from './types';

const COOKIE_NAME = 'oc_prescription';
const COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24 * 30; // 30 días

/**
 * Secret separado del cart por defensa en profundidad: si uno se compromete
 * (log accidental, leak), el otro sigue válido. Misma exigencia: ≥32 chars.
 */
function getSecret(): string {
  const secret = process.env.PRESCRIPTION_COOKIE_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error(
      'PRESCRIPTION_COOKIE_SECRET no está configurada o es muy corta (>= 32 chars). Generar con `node -e "console.log(require(\'crypto\').randomBytes(32).toString(\'hex\'))"`.',
    );
  }
  return secret;
}

function sign(payload: string): string {
  return createHmac('sha256', getSecret()).update(payload).digest('base64url');
}

function verify(payload: string, signature: string): boolean {
  const expected = sign(payload);
  if (expected.length !== signature.length) return false;
  try {
    return timingSafeEqual(Buffer.from(expected), Buffer.from(signature));
  } catch {
    return false;
  }
}

function encode(prescription: PrescriptionCookie): string {
  const payload = Buffer.from(JSON.stringify(prescription)).toString(
    'base64url',
  );
  return `${payload}.${sign(payload)}`;
}

function decode(raw: string): PrescriptionCookie | null {
  const dot = raw.indexOf('.');
  if (dot < 0) return null;

  const payload = raw.slice(0, dot);
  const signature = raw.slice(dot + 1);
  if (!verify(payload, signature)) return null;

  let json: unknown;
  try {
    json = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8'));
  } catch {
    return null;
  }

  const parsed = prescriptionCookieSchema.safeParse(json);
  return parsed.success ? parsed.data : null;
}

/**
 * Lee y verifica la cookie de la receta. Si la firma no matchea, devuelve
 * null silenciosamente (cookie manipulada o secret rotó — no es error del
 * usuario, simplemente no hay receta cargada).
 *
 * IMPORTANTE: NUNCA loguear el contenido — datos médicos sensibles (ley
 * 25.326 LPDP).
 */
export async function readPrescriptionCookie(): Promise<PrescriptionCookie | null> {
  const store = await cookies();
  const raw = store.get(COOKIE_NAME)?.value;
  if (!raw) return null;
  return decode(raw);
}

/**
 * Escribe la cookie de la receta firmada. Solo desde server actions o
 * route handlers. HttpOnly previene acceso desde JS — defensa contra XSS
 * que quiera leakear datos médicos.
 */
export async function writePrescriptionCookie(
  prescription: PrescriptionCookie,
): Promise<void> {
  const store = await cookies();
  store.set(COOKIE_NAME, encode(prescription), {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: COOKIE_MAX_AGE_SECONDS,
  });
}

/** Borra la cookie de la receta. */
export async function deletePrescriptionCookie(): Promise<void> {
  const store = await cookies();
  store.delete(COOKIE_NAME);
}
