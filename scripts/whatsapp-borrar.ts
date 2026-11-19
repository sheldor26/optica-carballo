/**
 * Script: whatsapp-borrar
 *
 * Derecho de supresión (Ley 25.326): borra TODA la conversación de WhatsApp de
 * una persona (su fila de conversación y todos sus mensajes) a pedido suyo.
 *
 * Por defecto solo MUESTRA qué borraría. Para borrar de verdad, agregar --confirmar.
 *
 * Uso:
 *   pnpm whatsapp:borrar 5493756123456              Muestra cuántos mensajes tiene.
 *   pnpm whatsapp:borrar 5493756123456 --confirmar  Borra la conversación completa.
 *
 * El número va en formato internacional sin "+" ni espacios (como lo guarda WhatsApp).
 * Los mails de aviso que ya salieron al equipo no se pueden "des-enviar": hay que
 * borrarlos a mano de la casilla.
 */
import { crearClienteAdmin } from './lib/supabase-script';

async function main() {
  const args = process.argv.slice(2);
  const confirmar = args.includes('--confirmar');
  const numero = (args.find((a) => !a.startsWith('--')) ?? '').replace(/\D/g, '');

  if (numero.length < 8) {
    console.error('Falta el número (formato internacional, sin "+"). Ejemplo: pnpm whatsapp:borrar 5493756123456');
    process.exit(1);
  }

  const db = crearClienteAdmin();

  const conv = await db.from('whatsapp_conversations').select('wa_id, handoff_at, last_inbound_at').eq('wa_id', numero).maybeSingle();
  if (conv.error) throw new Error(conv.error.message);
  if (!conv.data) {
    console.log(`No hay ninguna conversación guardada para ${numero}. Nada que borrar.`);
    return;
  }

  const msgs = await db.from('whatsapp_messages').select('id', { count: 'exact', head: true }).eq('wa_id', numero);
  if (msgs.error) throw new Error(msgs.error.message);

  console.log(`Conversación de ${numero}: ${msgs.count ?? 0} mensajes · último mensaje del cliente: ${conv.data.last_inbound_at ?? 'sin dato'}${conv.data.handoff_at ? ' · se derivó a una persona' : ''}`);

  if (!confirmar) {
    console.log('\nNo se borró nada. Para borrarla definitivamente agregá --confirmar');
    return;
  }

  // Los mensajes se borran solos (ON DELETE CASCADE) al borrar la conversación.
  const del = await db.from('whatsapp_conversations').delete().eq('wa_id', numero);
  if (del.error) throw new Error(del.error.message);
  console.log('Listo: conversación y mensajes borrados.');
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
