import type { Metadata } from 'next';
import { InfoPageShell } from '@/components/legal/info-page-shell';
import { PlaceholderNote } from '@/components/legal/placeholder-note';
import { buildInfoPageMetadata } from '@/lib/catalog/metadata';
import { getBusinessInfo } from '@/lib/site/business';

const SLUG = 'politica-de-devolucion';
const TITLE = 'Política de cambios y devoluciones';

export const revalidate = 86400;

export function generateMetadata(): Metadata {
  return buildInfoPageMetadata({
    title: TITLE,
    description:
      'Política de cambios y devoluciones de Óptica Carballo. Plazos, condiciones, productos que aplican y cómo iniciar el trámite.',
    slug: SLUG,
  });
}

export default function Page() {
  const business = getBusinessInfo();

  return (
    <InfoPageShell title={TITLE} slug={SLUG}>
      <p>
        En Óptica Carballo queremos que estés conforme con tu compra. Si
        recibiste un producto que no cumple con tus expectativas o se entregó
        con un defecto, esta es nuestra política de cambios y devoluciones.
      </p>

      <PlaceholderNote>
        <p>
          Los plazos exactos, productos exceptuados y condiciones específicas
          deben ser confirmadas por la óptica antes de habilitar el
          checkout. Lo que sigue es un esqueleto estándar; reemplazá los{' '}
          <code>[PENDIENTE]</code> con la política definitiva del negocio.
        </p>
      </PlaceholderNote>

      <h2>Derecho de arrepentimiento (10 días)</h2>
      <p>
        Si compraste a distancia (por este sitio o WhatsApp), tenés{' '}
        <strong>10 días corridos</strong> desde la recepción del producto para
        arrepentirte de la compra, sin necesidad de justificar el motivo. Esto
        está garantizado por el artículo 34 de la Ley 24.240 de Defensa del
        Consumidor.
      </p>
      <p>
        Para ejercerlo, mirá la página{' '}
        <a href="/boton-de-arrepentimiento">Botón de arrepentimiento</a>.
      </p>

      <h2>Cambios por talle, color o modelo</h2>
      <p>
        Si querés cambiar el producto por otro motivo (no te queda, querés otro
        color, etc.), aceptamos cambios dentro de los{' '}
        <strong>[PENDIENTE: días, por ejemplo 15] días corridos</strong> desde
        la entrega, siempre que el producto esté:
      </p>
      <ul>
        <li>Sin uso, con todos sus accesorios y embalaje original.</li>
        <li>Sin marcas, rayones o signos visibles de manipulación.</li>
        <li>Acompañado de la factura o comprobante de compra.</li>
      </ul>

      <h2>Productos que NO admiten cambio ni devolución</h2>
      <p>
        Por razones sanitarias y de personalización, NO aceptamos cambios ni
        devoluciones de:
      </p>
      <ul>
        <li>
          <strong>Anteojos de receta con cristales graduados a medida</strong>{' '}
          según tu prescripción. Una vez fabricados con tu graduación, no
          podemos revenderlos.
        </li>
        <li>
          <strong>Lentes de contacto</strong> con la caja abierta o el blister
          violado.
        </li>
        <li>
          Productos en oferta marcados explícitamente como{' '}
          <em>&quot;sin cambio&quot;</em>.
        </li>
      </ul>
      <p>
        Esta restricción NO se aplica al derecho de arrepentimiento del art. 34
        cuando se trata de productos no personalizados.
      </p>

      <h2>Defectos de fábrica y garantía</h2>
      <p>
        Si el producto presenta un defecto de fabricación, lo cambiamos sin
        cargo. La garantía de fábrica varía por marca y producto —
        normalmente <strong>[PENDIENTE: 6 a 12 meses]</strong> según el modelo.
        En estos casos cubrimos el costo de envío de retorno y reposición.
      </p>

      <h2>Cómo iniciar el trámite</h2>
      <ol className="list-decimal space-y-2 pl-6">
        <li>
          Contactanos
          {business.whatsappLink ? (
            <>
              {' '}
              por{' '}
              <a
                href={business.whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
              >
                WhatsApp
              </a>
            </>
          ) : (
            <> [PENDIENTE: canal de contacto]</>
          )}{' '}
          dentro del plazo correspondiente.
        </li>
        <li>Pasanos el número de orden y el motivo del cambio o devolución.</li>
        <li>
          Coordinamos el retiro o reenvío del producto. El costo del envío de
          retorno corre por cuenta del cliente, salvo defecto de fábrica.
        </li>
        <li>
          Recibido y revisado el producto, procesamos el reintegro o el cambio
          según corresponda, en un plazo máximo de{' '}
          <strong>[PENDIENTE: días hábiles]</strong>.
        </li>
      </ol>

      <h2>Reintegros</h2>
      <p>
        Los reintegros se realizan por el mismo medio de pago original. Mercado
        Pago tiene sus propios tiempos de procesamiento que escapan a nuestro
        control.
      </p>
    </InfoPageShell>
  );
}
