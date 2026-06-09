import type { Metadata } from 'next';
import { InfoPageShell } from '@/components/legal/info-page-shell';
import { PlaceholderNote } from '@/components/legal/placeholder-note';
import { buildInfoPageMetadata } from '@/lib/catalog/metadata';
import { getBusinessInfo } from '@/lib/site/business';

const SLUG = 'politica-de-privacidad';
const TITLE = 'Política de privacidad';

export const revalidate = 86400;

export function generateMetadata(): Metadata {
  return buildInfoPageMetadata({
    title: TITLE,
    description:
      'Cómo Óptica Carballo recolecta, usa y protege tus datos personales. Cumplimiento ley 25.326 de Protección de Datos Personales.',
    slug: SLUG,
  });
}

export default function Page() {
  const business = getBusinessInfo();

  return (
    <InfoPageShell title={TITLE} slug={SLUG}>
      <p>
        Esta política describe cómo {business.siteName} recolecta, usa, comparte
        y protege tus datos personales cuando navegás nuestro sitio, hacés una
        compra o nos contactás. Cumplimos con la{' '}
        <strong>Ley 25.326 de Protección de Datos Personales</strong> de
        Argentina y sus normas reglamentarias.
      </p>

      <PlaceholderNote>
        <p>
          Política redactada como template estándar para óptica argentina con
          venta online. Los campos marcados como <code>[A CONFIRMAR]</code>{' '}
          requieren confirmación del founder (CUIT, razón social exacta,
          domicilio fiscal, contacto del responsable de datos). Revisar con
          abogado antes de activar checkout end-to-end.
        </p>
      </PlaceholderNote>

      <h2>1. Responsable del tratamiento</h2>
      <p>
        El responsable del tratamiento de tus datos personales es{' '}
        <strong>{business.siteName}</strong>, con domicilio en{' '}
        {business.locality && business.region ? (
          <>
            {business.locality}, {business.region}, Argentina
          </>
        ) : (
          <>[A CONFIRMAR: domicilio fiscal completo]</>
        )}
        .
      </p>
      <ul>
        <li>
          <strong>Razón social</strong>: [A CONFIRMAR: nombre de la persona
          física o jurídica que opera la óptica].
        </li>
        <li>
          <strong>CUIT</strong>: [A CONFIRMAR].
        </li>
        <li>
          <strong>Contacto para temas de datos personales</strong>:{' '}
          {business.whatsappLink ? (
            <a href={business.whatsappLink} target="_blank" rel="noopener noreferrer">
              WhatsApp
            </a>
          ) : (
            <>[A CONFIRMAR: email o canal de contacto]</>
          )}
          .
        </li>
      </ul>

      <h2>2. Qué datos recolectamos</h2>
      <p>Recolectamos las siguientes categorías de datos:</p>
      <ul>
        <li>
          <strong>Datos de identificación</strong>: nombre, apellido, DNI o
          CUIT (este último solo si solicitás factura A).
        </li>
        <li>
          <strong>Datos de contacto</strong>: email, teléfono, domicilio de
          envío.
        </li>
        <li>
          <strong>Datos de la compra</strong>: productos adquiridos, monto,
          fecha, medio de pago utilizado.
        </li>
        <li>
          <strong>Datos de receta oftalmológica</strong> (solo si comprás
          anteojos recetados): graduación, distancia naso-pupilar, datos del
          profesional emisor. Estos datos son sensibles y los tratamos con
          cuidado especial.
        </li>
        <li>
          <strong>Datos de navegación</strong>: páginas visitadas, productos
          vistos, búsquedas realizadas. Algunos guardados en cookies del
          navegador (wishlist, comparador, carrito).
        </li>
        <li>
          <strong>Datos del newsletter</strong>: email si te suscribís
          voluntariamente.
        </li>
      </ul>

      <h2>3. Finalidad y base legal del tratamiento</h2>
      <ul>
        <li>
          <strong>Procesar tu compra</strong>: facturación AFIP, envío con el
          operador logístico, gestión de garantía y posventa. Base legal:
          ejecución del contrato de compraventa.
        </li>
        <li>
          <strong>Atención al cliente</strong>: responder consultas, gestionar
          cambios y devoluciones. Base legal: ejecución del contrato y
          consentimiento.
        </li>
        <li>
          <strong>Newsletter</strong>: enviarte novedades de productos.{' '}
          <strong>Solo si te suscribiste expresamente</strong>. Podés darte de
          baja en cualquier momento. Base legal: consentimiento.
        </li>
        <li>
          <strong>Cumplimiento de obligaciones legales</strong>: emisión de
          factura electrónica, retención impositiva, conservación de registros
          contables. Base legal: obligación legal (AFIP, ley 11.683).
        </li>
        <li>
          <strong>Mejora del servicio</strong>: estadísticas anónimas de uso del
          sitio (sin identificarte personalmente). Base legal: interés
          legítimo.
        </li>
      </ul>

      <h2>4. Compartir datos con terceros</h2>
      <p>
        Solo compartimos tus datos con quienes son necesarios para cumplir el
        servicio. Específicamente:
      </p>
      <ul>
        <li>
          <strong>Mercado Pago</strong>: procesa los pagos. Tu información
          financiera (tarjeta, cuenta bancaria) la maneja directamente Mercado
          Pago — nosotros no la vemos ni guardamos.
        </li>
        <li>
          <strong>Correo Argentino</strong>: gestiona el envío de tu
          pedido. Comparten datos de contacto y dirección.
        </li>
        <li>
          <strong>Resend</strong>: envía los emails transaccionales y el
          newsletter (si te suscribiste).
        </li>
        <li>
          <strong>AFIP</strong>: para emitir factura electrónica.
        </li>
        <li>
          <strong>Supabase / Vercel</strong>: proveedores de infraestructura
          técnica donde se almacena el sitio y los datos.
        </li>
      </ul>
      <p>
        <strong>Nunca vendemos tus datos a terceros.</strong> No compartimos
        información para publicidad de otras empresas.
      </p>

      <h2>5. Conservación de los datos</h2>
      <p>
        Conservamos tus datos por el tiempo necesario para cumplir las
        finalidades para las que fueron recolectados:
      </p>
      <ul>
        <li>
          <strong>Datos de compra</strong>: 10 años (obligación legal contable
          y AFIP).
        </li>
        <li>
          <strong>Recetas oftalmológicas</strong>: mientras seas cliente activo
          + 5 años. Después se anonimizan.
        </li>
        <li>
          <strong>Newsletter</strong>: hasta que te des de baja.
        </li>
        <li>
          <strong>Cookies del navegador</strong>: según el tipo (sesión =
          mientras tengas el navegador abierto; persistentes = 30 a 90 días).
        </li>
      </ul>

      <h2>6. Tus derechos (ARCO)</h2>
      <p>
        Conforme la Ley 25.326, tenés los siguientes derechos sobre tus datos:
      </p>
      <ul>
        <li>
          <strong>Acceso</strong>: pedir qué datos tuyos tenemos y para qué los
          usamos. Sin costo, una vez cada 6 meses.
        </li>
        <li>
          <strong>Rectificación</strong>: actualizar datos incorrectos o
          desactualizados.
        </li>
        <li>
          <strong>Supresión</strong> (cancelación): pedir que borremos tus
          datos cuando no sean necesarios.
        </li>
        <li>
          <strong>Oposición</strong>: oponerte al tratamiento por motivos
          fundados.
        </li>
        <li>
          <strong>Portabilidad</strong>: recibir tus datos en formato
          estructurado para llevarlos a otro proveedor.
        </li>
      </ul>
      <p>
        Para ejercer cualquiera de estos derechos, contactanos por{' '}
        {business.whatsappLink ? (
          <a href={business.whatsappLink} target="_blank" rel="noopener noreferrer">
            WhatsApp
          </a>
        ) : (
          <>[A CONFIRMAR: canal]</>
        )}{' '}
        con tu DNI y la solicitud específica. Te respondemos dentro de los 10
        días hábiles.
      </p>
      <p>
        También podés presentar reclamos ante la{' '}
        <strong>Agencia de Acceso a la Información Pública (AAIP)</strong>,
        autoridad de aplicación de la Ley 25.326.
      </p>

      <h2>7. Cookies</h2>
      <p>Usamos cookies para mejorar tu experiencia. Categorías:</p>
      <ul>
        <li>
          <strong>Necesarias</strong> (siempre activas): carrito, wishlist,
          comparador, sesión de login. Sin estas el sitio no funciona.
        </li>
        <li>
          <strong>Funcionales</strong>: preferencias de navegación (idioma,
          dark mode si lo implementamos).
        </li>
        <li>
          <strong>Analíticas</strong> (opt-in): Google Analytics, Vercel
          Analytics. Solo se activan si das consentimiento.
        </li>
      </ul>
      <p>
        Podés gestionar tus preferencias en el banner que aparece al primer
        acceso al sitio.
      </p>

      <h2>8. Seguridad</h2>
      <p>
        Aplicamos medidas técnicas y organizativas razonables para proteger tus
        datos:
      </p>
      <ul>
        <li>HTTPS / TLS en todo el sitio.</li>
        <li>Cifrado en reposo de tokens y datos sensibles.</li>
        <li>Acceso restringido a la base de datos (Row Level Security en Supabase).</li>
        <li>
          Tu información de pago la maneja directamente Mercado Pago — nunca
          pasa por nuestros servidores.
        </li>
      </ul>

      <h2>9. Menores de edad</h2>
      <p>
        Nuestro sitio no está dirigido a menores de 16 años. No recolectamos
        conscientemente datos de menores sin autorización de sus padres o
        tutores. Si detectás que un menor proporcionó datos sin
        consentimiento, contactanos y los eliminamos.
      </p>

      <h2>10. Cambios a esta política</h2>
      <p>
        Podemos actualizar esta política para reflejar cambios en nuestros
        servicios o en la legislación. La versión vigente siempre está
        publicada en esta página con su fecha de última actualización. Cambios
        materiales te los notificamos por email si tenemos tu contacto.
      </p>

      <p className="text-muted-foreground mt-8 text-xs">
        Última actualización: 2026-05-29.
      </p>
    </InfoPageShell>
  );
}
