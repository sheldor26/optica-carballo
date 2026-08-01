import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { sendPrescriptionReminderEmail } from '@/lib/emails/send-prescription-reminder-email';
import { secretsMatch } from '@/lib/security/timing-safe-equal';
import { PRESCRIPTION_VALIDITY_DAYS } from '@/lib/prescription/types';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

// Ventana de aviso: 30 días antes del vencimiento inferido (emisión + 365).
// Un solo envío por receta — no es una alerta recurrente tipo stock/precio.
const REMINDER_WINDOW_DAYS = 30;
const DAY_MS = 24 * 60 * 60 * 1000;

type PrescriptionRow = {
  id: string;
  user_id: string;
  expires_at: string; // en realidad fecha de EMISIÓN, ver lib/prescription/types.ts
  reminder_unsubscribe_token: string;
};

/**
 * Vercel Cron route — corre cada hora (config en vercel.json), mismo patrón
 * que `check-alerts`. Header `Authorization: Bearer <CRON_SECRET>` valida
 * origen.
 *
 * Solo cubre anteojos recetados hoy — `lentes-de-contacto` todavía no es una
 * categoría vendible del catálogo (ver BRANDS.md), así que no hace falta la
 * rama de vigencia distinta (180 días) que señaló `optical-expert`. Si esa
 * categoría se activa en el futuro, este cron necesita distinguir tipo de
 * receta antes de mandarle este mismo copy a compradores de lentes de
 * contacto (ver BACKLOG.md).
 */
export async function GET(request: Request) {
  const auth = request.headers.get('authorization') ?? '';
  const expected = `Bearer ${process.env.CRON_SECRET}`;
  if (!process.env.CRON_SECRET || !secretsMatch(auth, expected)) {
    return NextResponse.json({ ok: false, error: 'unauthorized' }, { status: 401 });
  }

  const supabase = createAdminClient();
  const now = Date.now();

  // Ventana: recetas emitidas entre (365) y (365 - 30) días atrás.
  const windowStartIso = new Date(
    now - PRESCRIPTION_VALIDITY_DAYS * DAY_MS,
  ).toISOString();
  const windowEndIso = new Date(
    now - (PRESCRIPTION_VALIDITY_DAYS - REMINDER_WINDOW_DAYS) * DAY_MS,
  ).toISOString();

  const { data: prescriptions, error } = await supabase
    .from('prescriptions')
    .select('id, user_id, expires_at, reminder_unsubscribe_token')
    .eq('is_archived', false)
    .is('reminder_sent_at', null)
    .not('expires_at', 'is', null)
    .gte('expires_at', windowStartIso)
    .lte('expires_at', windowEndIso)
    .returns<PrescriptionRow[]>();

  if (error) {
    console.error('[cron/check-prescription-expiry] query error:', error);
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }

  let sent = 0;
  let skipped = 0;
  let failed = 0;

  for (const prescription of prescriptions ?? []) {
    try {
      const userResp = await supabase.auth.admin.getUserById(prescription.user_id);
      const email = userResp.data.user?.email;
      if (!email) {
        skipped++;
        continue;
      }

      await sendPrescriptionReminderEmail({
        toEmail: email,
        issuedAt: prescription.expires_at,
        unsubscribeToken: prescription.reminder_unsubscribe_token,
      });

      await supabase
        .from('prescriptions')
        .update({ reminder_sent_at: new Date().toISOString() })
        .eq('id', prescription.id);

      sent++;
    } catch (err) {
      console.error(
        `[cron/check-prescription-expiry] error on prescription ${prescription.id}:`,
        err,
      );
      failed++;
    }
  }

  return NextResponse.json({
    ok: true,
    processed: prescriptions?.length ?? 0,
    sent,
    skipped,
    failed,
  });
}
