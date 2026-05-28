import type { Metadata } from 'next';
import { InfoPageShell } from '@/components/legal/info-page-shell';
import { PlaceholderNote } from '@/components/legal/placeholder-note';
import { buildInfoPageMetadata } from '@/lib/catalog/metadata';
import { getBusinessInfo } from '@/lib/site/business';

const SLUG = 'sobre-nosotros';
const TITLE = 'Sobre nosotros';

export const revalidate = 86400;

export function generateMetadata(): Metadata {
  return buildInfoPageMetadata({
    title: TITLE,
    description:
      'Óptica Carballo: óptica familiar con 30+ años de experiencia en la región. Regente óptica matriculada, atención profesional y stock real.',
    slug: SLUG,
  });
}

export default function Page() {
  const business = getBusinessInfo();
  const location = [business.locality, business.region]
    .filter((v): v is string => Boolean(v))
    .join(', ');

  return (
    <InfoPageShell title={TITLE} slug={SLUG}>
      <p>
        Óptica Carballo es una óptica familiar con más de 30 años de experiencia
        en la región{location ? ` de ${location}` : ''}. Vendemos anteojos de
        sol y armazones de receta de las marcas que efectivamente tenemos en
        stock —{' '}
        <strong>nunca publicamos modelos que no podemos entregar</strong>.
      </p>

      <h2>Nuestro equipo</h2>
      {business.regenteName ? (
        <p>
          <strong>{business.regenteName}</strong> es nuestra regente óptica
          matriculada
          {business.regenteMatricula ? (
            <> (Matrícula {business.regenteMatricula})</>
          ) : null}
          . Toda venta de anteojos de receta en Argentina requiere supervisión
          profesional matriculada, y en Óptica Carballo respetamos eso a
          rajatabla: las recetas se revisan, los cristales se gradúan según
          prescripción real, y el armado final lo hace personal capacitado.
        </p>
      ) : (
        <PlaceholderNote>
          <p>
            Completar nombre de la regente óptica matriculada (variable de
            entorno <code>NEXT_PUBLIC_REGENTE_NAME</code>) y su matrícula
            profesional (<code>NEXT_PUBLIC_REGENTE_MATRICULA</code>). Una vez
            cargadas, este bloque se actualiza automáticamente.
          </p>
        </PlaceholderNote>
      )}
      {business.tecnicoName && (
        <p>
          La parte digital del proyecto la lleva{' '}
          <strong>{business.tecnicoName}</strong>, Técnico Superior en Óptica y
          Contactología{business.tecnicoMatricula ? (
            <> (Matrícula {business.tecnicoMatricula})</>
          ) : null}
          . Esa combinación —óptica tradicional + formación técnica actualizada—
          es lo que queremos transmitir en cada compra.
        </p>
      )}

      <h2>Cómo trabajamos</h2>
      <ul>
        <li>
          <strong>Stock real, siempre.</strong> Cada producto publicado existe
          físicamente en nuestro local. Si no lo tenemos, no aparece.
        </li>
        <li>
          <strong>Asesoramiento profesional.</strong> Si tenés dudas sobre qué
          modelo te queda mejor o sobre tu receta, escribinos por WhatsApp y te
          ayudamos.
        </li>
        <li>
          <strong>Envíos a todo el país.</strong> Trabajamos con Andreani como
          operador principal y Correo Argentino como respaldo. Retiro gratis en
          nuestro local si vivís cerca.
        </li>
        <li>
          <strong>Cuotas sin interés.</strong> Aceptamos Mercado Pago con
          opciones de financiación.
        </li>
        <li>
          <strong>Cumplimiento legal completo.</strong> Facturación electrónica
          AFIP, botón de arrepentimiento, política de devolución clara.
        </li>
      </ul>

      <h2>Marcas que trabajamos</h2>
      <p>
        Hoy tenemos stock real de <strong>Rusty, Vulk, Reef, Mormaii</strong> y
        la colección de <strong>Paula Cahen D&apos;Anvers</strong>, en sus
        líneas de sol y receta. Si te interesa otra marca, consultanos por
        WhatsApp antes de comprar.
      </p>

      <h2>Atención al cliente</h2>
      {business.whatsappLink ? (
        <p>
          La forma más rápida de contactarnos es por WhatsApp.{' '}
          <a href={business.whatsappLink} target="_blank" rel="noopener noreferrer">
            Escribinos
          </a>{' '}
          y te respondemos en horario comercial.
        </p>
      ) : (
        <PlaceholderNote>
          <p>
            Configurar el número de WhatsApp del negocio en{' '}
            <code>NEXT_PUBLIC_WHATSAPP_NUMBER</code> (formato internacional sin
            +, ejemplo: 5493780123456).
          </p>
        </PlaceholderNote>
      )}
    </InfoPageShell>
  );
}
