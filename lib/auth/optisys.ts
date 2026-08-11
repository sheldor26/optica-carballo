import { NextResponse } from 'next/server';
import { secretsMatch } from '@/lib/security/timing-safe-equal';

/**
 * Quién puede operar pedidos desde afuera del panel.
 *
 * El sistema de gestión de la óptica (OptiSys) corre en la PC del mostrador,
 * sin sesión de admin del navegador, así que se identifica con una clave
 * compartida: `Authorization: Bearer <OPTISYS_TOKEN>`. Es el mismo mecanismo
 * que ya usan las rutas de cron.
 *
 * Falla cerrado: si la variable no está puesta, nadie entra. Una ruta que
 * genera envíos reales y manda mails a clientes no puede quedar abierta porque
 * alguien se olvidó de configurar algo.
 */
export function autorizadoOptiSys(request: Request): NextResponse | null {
  const token = process.env.OPTISYS_TOKEN;
  if (!token || token.length < 24) {
    return NextResponse.json(
      { ok: false, error: 'OPTISYS_TOKEN no configurado' },
      { status: 503 },
    );
  }
  const enviado = request.headers.get('authorization') ?? '';
  if (!secretsMatch(enviado, `Bearer ${token}`)) {
    return NextResponse.json({ ok: false, error: 'unauthorized' }, { status: 401 });
  }
  return null;
}
