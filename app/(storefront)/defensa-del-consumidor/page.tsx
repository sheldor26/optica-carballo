import type { Metadata } from 'next';
import { InfoPageShell } from '@/components/legal/info-page-shell';
import { buildInfoPageMetadata } from '@/lib/catalog/metadata';
import { getBusinessInfo } from '@/lib/site/business';

const SLUG = 'defensa-del-consumidor';
const TITLE = 'Defensa del consumidor';

export const revalidate = 86400;

export function generateMetadata(): Metadata {
  return buildInfoPageMetadata({
    title: TITLE,
    description:
      'Información sobre tus derechos como consumidor y los canales oficiales para hacer reclamos en Argentina.',
    slug: SLUG,
  });
}

export default function Page() {
  const business = getBusinessInfo();

  return (
    <InfoPageShell title={TITLE} slug={SLUG}>
      <p>
        Como consumidor, tenés derechos garantizados por la{' '}
        <strong>Ley 24.240 de Defensa del Consumidor</strong> y sus
        modificatorias. En Óptica Carballo respetamos plenamente esos
        derechos.
      </p>

      <h2>Tus derechos como consumidor</h2>
      <ul>
        <li>
          <strong>Información clara y veraz</strong> sobre los productos
          (características, precio, condiciones de venta).
        </li>
        <li>
          <strong>Derecho a la salud y seguridad</strong>: los productos no
          deben implicar riesgos para tu salud.
        </li>
        <li>
          <strong>Trato digno y equitativo</strong>: sin discriminación, sin
          prácticas abusivas.
        </li>
        <li>
          <strong>Garantía legal mínima</strong> de 6 meses para productos
          nuevos (3 para usados) por defectos no aparentes al momento de la
          compra.
        </li>
        <li>
          <strong>Botón de arrepentimiento</strong> de 10 días corridos para
          compras a distancia (sitio web, WhatsApp, teléfono).
        </li>
        <li>
          <strong>Cumplimiento de la oferta</strong>: lo que publicamos es
          vinculante. No vendemos lo que no tenemos.
        </li>
      </ul>

      <h2>Canales oficiales para reclamos</h2>
      <p>
        Si tenés un problema que no pudiste resolver con nosotros, podés
        recurrir a:
      </p>
      <ul>
        <li>
          <strong>Ventanilla Única Federal de Defensa del Consumidor</strong>{' '}
          (nivel nacional):{' '}
          <a
            href="https://www.argentina.gob.ar/produccion/defensadelconsumidor/formulario"
            target="_blank"
            rel="noopener noreferrer"
          >
            argentina.gob.ar/produccion/defensadelconsumidor
          </a>
        </li>
        <li>
          <strong>Defensa del Consumidor de tu provincia o municipio</strong>:
          buscá la oficina más cercana a tu domicilio. Cada jurisdicción tiene
          sus canales propios.
        </li>
        <li>
          <strong>COPREC</strong> (Conciliación Previa en Relaciones de
          Consumo): instancia gratuita y obligatoria para reclamos en compras
          a distancia menores a un monto determinado por la autoridad de
          aplicación.
        </li>
      </ul>

      <h2>Antes de hacer un reclamo formal, contactanos</h2>
      <p>
        Si hay un problema con tu compra, la forma más rápida de resolverlo es
        contactarnos directamente. Estamos para ayudarte.
      </p>
      {business.whatsappLink ? (
        <p>
          Escribinos por{' '}
          <a
            href={business.whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
          >
            WhatsApp
          </a>{' '}
          y resolvemos en horario comercial.
        </p>
      ) : null}

      <h2>Marco legal aplicable</h2>
      <ul>
        <li>
          Ley 24.240 de Defensa del Consumidor (Argentina) y modificatorias
          (Ley 26.361, Ley 27.250).
        </li>
        <li>
          Código Civil y Comercial de la Nación (arts. 1092 a 1122).
        </li>
        <li>
          Resolución 1033/2021 sobre comercio electrónico y información al
          consumidor.
        </li>
      </ul>
    </InfoPageShell>
  );
}
