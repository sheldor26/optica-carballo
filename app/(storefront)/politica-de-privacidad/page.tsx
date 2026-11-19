import type { Metadata } from 'next';
import { InfoPageShell } from '@/components/legal/info-page-shell';
import { buildInfoPageMetadata } from '@/lib/catalog/metadata';
import { getBusinessInfo } from '@/lib/site/business';

const SLUG = 'politica-de-privacidad';
const TITLE = 'Política de privacidad';
const CONTACT_EMAIL = 'hola@opticacarballo.com.ar';

export const revalidate = 86400;

export function generateMetadata(): Metadata {
  return buildInfoPageMetadata({
    title: TITLE,
    description:
      'Cómo Óptica Carballo recolecta, usa y protege tus datos personales, incluido el asistente virtual de WhatsApp. Ley 25.326 de Protección de Datos Personales.',
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
        compra o nos escribís (incluso por WhatsApp). Cumplimos con la{' '}
        <strong>Ley 25.326 de Protección de Datos Personales</strong> de
        Argentina y sus normas reglamentarias.
      </p>

      <h2>1. Responsable del tratamiento</h2>
      <p>
        El responsable del tratamiento de tus datos personales es{' '}
        <strong>Juan Leopoldo Mirande</strong>, titular de {business.siteName}.
      </p>
      <ul>
        <li>
          <strong>Nombre comercial</strong>: {business.siteName}.
        </li>
        <li>
          <strong>Titular</strong>: Juan Leopoldo Mirande.
        </li>
        <li>
          <strong>CUIT</strong>: 20-16852182-1.
        </li>
        <li>
          <strong>Domicilio</strong>: Av. Lavalle 2686, Gobernador Virasoro,
          Corrientes (CP 3342), Argentina.
        </li>
        <li>
          <strong>Contacto para temas de datos personales</strong>:{' '}
          <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
          {business.whatsappLink ? (
            <>
              {' '}
              o por{' '}
              <a href={business.whatsappLink} target="_blank" rel="noopener noreferrer">
                WhatsApp
              </a>
            </>
          ) : null}
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
          <strong>Datos de tus mensajes por WhatsApp</strong>: tu número de
          teléfono, el nombre de tu perfil de WhatsApp (si lo tenés), el texto
          de los mensajes (tuyos, del asistente virtual y del equipo) y sus
          fechas. <strong>No guardamos fotos, audios ni documentos</strong>:
          solo registramos que los mandaste.
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
      <p>
        <strong>No nos mandes datos de salud por chat</strong> (síntomas,
        diagnósticos, tu graduación): no estás obligado a dárnoslos. Si igual
        los escribís, quedan en la conversación y se tratan como el resto de
        los mensajes.
      </p>

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
          <strong>Atención por WhatsApp</strong>: responder tus consultas con
          un asistente virtual y, cuando haga falta, con una persona del
          equipo. Base legal: tu consentimiento, que damos por prestado
          cuando seguís la conversación después del aviso inicial del
          asistente.
        </li>
        <li>
          <strong>Newsletter</strong>: enviarte novedades de productos.{' '}
          <strong>Solo si te suscribiste expresamente</strong>. Podés darte de
          baja en cualquier momento. Base legal: consentimiento.
        </li>
        <li>
          <strong>Recordatorio de receta óptica</strong>: si compraste
          anteojos recetados, te avisamos por única vez, un año después,
          que conviene revisar tu graduación. Podés darte de baja de este
          recordatorio en cualquier momento desde el mismo email. Base
          legal: ejecución del contrato (art. 5, inc. 2.b, Ley 25.326) — el
          dato surge de tu propia compra con receta.
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
          <strong>Meta Platforms (WhatsApp)</strong>: es el operador de
          WhatsApp. Procesa los mensajes que nos mandás y que te mandamos.
        </li>
        <li>
          <strong>OpenAI y Anthropic</strong>: proveedores de inteligencia
          artificial. El texto de tus mensajes al asistente virtual (por
          WhatsApp o por el chat del sitio) se les envía para buscar en el
          catálogo y redactar la respuesta.
        </li>
        <li>
          <strong>Resend</strong>: envía los emails transaccionales, el
          newsletter (si te suscribiste) y los avisos internos al equipo.
        </li>
        <li>
          <strong>AFIP</strong>: para emitir factura electrónica.
        </li>
        <li>
          <strong>Supabase / Vercel</strong>: proveedores de infraestructura
          técnica donde se almacena el sitio y los datos, ubicados en Estados
          Unidos.
        </li>
      </ul>
      <p>
        <strong>Transferencia internacional.</strong> Meta, OpenAI, Anthropic,
        Supabase y Vercel procesan datos en Estados Unidos, un país que la
        Argentina no reconoce con un nivel de protección adecuado. Cuando usás
        el asistente por WhatsApp te avisamos antes y, al seguir la
        conversación, aceptás esa transferencia. Si no querés, pedinos hablar
        con una persona del equipo.
      </p>
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
          <strong>Mensajes de WhatsApp</strong>: se borran automáticamente a
          los 90 días de recibidos. Si la conversación pasó a una persona del
          equipo, a los 12 meses. El aviso interno por email incluye un
          resumen de los últimos mensajes y queda en la casilla del equipo;
          lo borramos si nos lo pedís. Meta, OpenAI y Anthropic aplican sus
          propios plazos.
        </li>
        <li>
          <strong>Newsletter</strong>: hasta que te des de baja.
        </li>
        <li>
          <strong>Cookies del navegador</strong>: según el tipo (sesión =
          mientras tengas el navegador abierto; persistentes = 30 a 90 días).
        </li>
      </ul>

      <h2>6. Tus derechos</h2>
      <p>
        Conforme la Ley 25.326, tenés los siguientes derechos sobre tus datos:
      </p>
      <ul>
        <li>
          <strong>Acceso</strong>: pedir qué datos tuyos tenemos y para qué los
          usamos.
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
      </ul>
      <p>
        Para ejercer cualquiera de estos derechos, escribinos a{' '}
        <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
        {business.whatsappLink ? (
          <>
            {' '}
            o por{' '}
            <a href={business.whatsappLink} target="_blank" rel="noopener noreferrer">
              WhatsApp
            </a>
          </>
        ) : null}{' '}
        con tu nombre y DNI (o el número de WhatsApp desde el que nos
        escribiste) y tu pedido. Respondemos dentro de los plazos de la ley:{' '}
        <strong>10 días corridos</strong> para el acceso y{' '}
        <strong>5 días hábiles</strong> para la rectificación, actualización o
        supresión.
      </p>
      <p>
        Podés ejercer gratis tu derecho de acceso a intervalos no inferiores a
        seis meses, salvo que acredites un interés legítimo (art. 14, inc. 3,
        Ley 25.326). La{' '}
        <strong>Agencia de Acceso a la Información Pública</strong>, en su
        carácter de Órgano de Control de la Ley 25.326, tiene la atribución de
        atender las denuncias y reclamos que interpongan quienes resulten
        afectados en sus derechos por incumplimiento de las normas vigentes en
        materia de protección de datos personales.
      </p>

      <h3>Cómo pedir que borremos tus datos</h3>
      <p>
        Escribinos a <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>{' '}
        con el asunto &ldquo;Eliminar mis datos&rdquo;, indicando tu nombre y
        DNI o el número de WhatsApp desde el que nos escribiste. Si nos
        escribiste por WhatsApp, también podés pedírselo a una persona del
        equipo en la misma conversación. Borramos la conversación completa en
        un máximo de 5 días hábiles y te confirmamos. Los datos que la ley
        nos obliga a conservar (por ejemplo, las facturas) no se pueden
        borrar.
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
          Analytics y Microsoft Clarity (mapas de calor y grabación de cómo se
          navega el sitio). Solo se activan si das consentimiento.
        </li>
        <li>
          <strong>Publicidad</strong> (opt-in): píxel de X (Twitter). Nos
          permite saber si llegaste desde un anuncio nuestro en X y medir
          cuántas visitas terminan en compra. Además guardamos una cookie
          propia, por 30 días, con los datos de la campaña de la que viniste
          (por ejemplo, el anuncio), sin datos personales; si comprás, esa
          fuente se anota en tu pedido. El píxel envía datos a X, un
          proveedor ubicado en el exterior. Solo se activa si das
          consentimiento.
        </li>
      </ul>
      <p>
        Podés gestionar tus preferencias en el banner que aparece al primer
        acceso al sitio. Para retirar tu consentimiento, borrá los datos del
        sitio en tu navegador (el banner vuelve a aparecer y podés elegir
        &ldquo;Solo necesarias&rdquo;) o escribinos y lo gestionamos.
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

      <h2>10. Asistente virtual de WhatsApp</h2>
      <p>
        Las consultas que nos hacés por WhatsApp las atiende primero un{' '}
        <strong>asistente virtual con inteligencia artificial</strong>, que
        puede equivocarse. Está configurado para pasarte con una persona del
        equipo cuando preguntás por recetas o graduación, contás síntomas,
        hacés un reclamo o lo pedís. El primer mensaje de cada conversación te
        avisa que es un asistente virtual y te manda a esta página.
      </p>
      <p>
        Para generar cada respuesta, el texto de tu mensaje se envía a OpenAI y
        Anthropic (Estados Unidos). Los mensajes también los puede leer el
        equipo de la óptica. No interpretamos recetas por chat: eso lo revisa
        siempre una persona.
      </p>

      <h2>11. Cambios a esta política</h2>
      <p>
        Podemos actualizar esta política para reflejar cambios en nuestros
        servicios o en la legislación. La versión vigente siempre está
        publicada en esta página con su fecha de última actualización. Cambios
        materiales te los notificamos por email si tenemos tu contacto.
      </p>

      <p className="text-muted-foreground mt-8 text-xs">
        Última actualización: 2026-11-19.
      </p>
    </InfoPageShell>
  );
}
