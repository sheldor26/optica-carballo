import 'server-only';
import { MercadoPagoConfig } from 'mercadopago';

/**
 * Singleton del SDK de Mercado Pago. Se inicializa lazy en el primer uso
 * para que el módulo se pueda importar sin requerir la env var (ej:
 * tests de tipos en CI sin secrets).
 *
 * Configurar `MP_ACCESS_TOKEN` con la TEST credential durante development
 * y con la PROD credential en Vercel cuando se active el checkout en
 * producción real. La PROD credential NUNCA se commitea ni se pega en
 * chat — se setea directo en Vercel Environment Variables.
 */
let cachedClient: MercadoPagoConfig | null = null;

export function getMpClient(): MercadoPagoConfig {
  if (cachedClient) return cachedClient;

  const accessToken = process.env.MP_ACCESS_TOKEN;
  if (!accessToken) {
    throw new Error(
      'MP_ACCESS_TOKEN no está configurado. Agregar a .env.local (test: TEST-...) o Vercel (prod: APP_USR-...).',
    );
  }

  cachedClient = new MercadoPagoConfig({
    accessToken,
    options: {
      // Timeout corto: la creación de preference debería ser <2s. Si MP
      // está lento, mejor fallar y reintenta el user que tener al user
      // esperando 30s en la página de checkout.
      timeout: 8000,
    },
  });
  return cachedClient;
}

/**
 * Helper para detectar si las credenciales son de TEST. Útil para no
 * llamar webhooks reales en sandbox o para mostrar un banner "modo prueba"
 * en futuras versiones de la UI.
 */
export function isMpTestMode(): boolean {
  const token = process.env.MP_ACCESS_TOKEN ?? '';
  return token.startsWith('TEST-');
}
