/**
 * Acceso al token de Mercado Libre para los scripts de terminal.
 *
 * El token vive encriptado con AES-256-GCM en `marketplace_integrations`. Este
 * módulo replica el descifrado del integration en vez de importarlo, porque
 * aquél es `server-only` y no se puede usar desde un script suelto.
 *
 * Estaba copiado en cuatro scripts. Al ser criptografía, la copia es el peor
 * lugar donde tener una divergencia: si cambia el formato del ciphertext o el
 * derivado de la clave, hay que acordarse de tocar los cuatro.
 */

import crypto from 'node:crypto';

import { createClient } from '@supabase/supabase-js';

function deriveKey(k: string): Buffer {
  if (/^[0-9a-f]{64}$/i.test(k)) return Buffer.from(k, 'hex');
  return crypto.createHash('sha256').update(k).digest();
}

/** Descifra un valor guardado como `iv:authTag:encrypted`, todo en hex. */
export function decrypt(ciphertext: string, key: string): string {
  const parts = ciphertext.split(':');
  if (parts.length !== 3) {
    throw new Error('Ciphertext inválido: esperaba el formato iv:authTag:encrypted.');
  }
  const [ivHex, tagHex, encHex] = parts as [string, string, string];
  const d = crypto.createDecipheriv('aes-256-gcm', deriveKey(key), Buffer.from(ivHex, 'hex'));
  d.setAuthTag(Buffer.from(tagHex, 'hex'));
  return Buffer.concat([d.update(Buffer.from(encHex, 'hex')), d.final()]).toString('utf8');
}

export type IntegracionML = {
  token: string;
  externalUserId: string;
  expiraEn: string;
};

/**
 * Trae el token de la integración activa de Mercado Libre, ya descifrado.
 *
 * Avisa si el token está vencido o por vencer: un 401 a mitad de un script que
 * escribe es mucho más molesto que enterarse antes de empezar.
 */
export async function obtenerIntegracionML(): Promise<IntegracionML> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const encKey = process.env.APP_ENCRYPTION_KEY;

  if (!url || !serviceKey || !encKey) {
    throw new Error(
      'Faltan variables de entorno (NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, ' +
        'APP_ENCRYPTION_KEY). Corré el comando con --env-file=.env.local.',
    );
  }

  const supabase = createClient(url, serviceKey);
  const { data, error } = await supabase
    .from('marketplace_integrations')
    .select('access_token, external_user_id, token_expires_at')
    .eq('status', 'active')
    .order('updated_at', { ascending: false })
    .limit(1);

  if (error) throw new Error(`No pude leer marketplace_integrations: ${error.message}`);
  if (!data || data.length === 0) {
    throw new Error('No hay ninguna integración de Mercado Libre activa en marketplace_integrations.');
  }

  const fila = data[0] as {
    access_token: string;
    external_user_id: string;
    token_expires_at: string;
  };

  const expira = new Date(fila.token_expires_at);
  const minutosRestantes = (expira.getTime() - Date.now()) / 60000;
  if (minutosRestantes < 0) {
    throw new Error(
      `El token de Mercado Libre venció el ${expira.toLocaleString('es-AR')}. ` +
        'Hay que renovarlo antes de correr esto.',
    );
  }
  if (minutosRestantes < 10) {
    console.warn(
      `  ⚠️ El token de Mercado Libre vence en ${Math.round(minutosRestantes)} minutos. ` +
        'Si el script es largo, puede cortarse a la mitad.',
    );
  }

  return {
    token: decrypt(fila.access_token, encKey),
    externalUserId: fila.external_user_id,
    expiraEn: fila.token_expires_at,
  };
}
