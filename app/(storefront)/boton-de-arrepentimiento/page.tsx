import type { Metadata } from 'next';
import { InfoPageShell } from '@/components/legal/info-page-shell';
import { buildInfoPageMetadata } from '@/lib/catalog/metadata';
import { getBusinessInfo, getWhatsappLinkWithContext } from '@/lib/site/business';

const SLUG = 'boton-de-arrepentimiento';
const TITLE = 'Botón de arrepentimiento';

export const revalidate = 86400;

export function generateMetadata(): Metadata {
  return buildInfoPageMetadata({
    title: TITLE,
    description:
      'Ejercé tu derecho de arrepentimiento dentro de los 10 días corridos desde la entrega, según la Ley 24.240 de Defensa del Consumidor. Cómo hacerlo en Óptica Carballo.',
    slug: SLUG,
  });
}

export default function Page() {
  const business = getBusinessInfo();
  const whatsappLink = getWhatsappLinkWithContext(
    'Hola, quiero ejercer el botón de arrepentimiento por una compra reciente.',
  );

  return (
    <InfoPageShell title={TITLE} slug={SLUG}>
      <p>
        Si compraste a distancia (por este sitio, por WhatsApp, por teléfono),
        tenés derecho a arrepentirte de la compra dentro de los{' '}
        <strong>10 días corridos</strong> desde la recepción del producto, sin
        necesidad de justificar el motivo y sin costo adicional alguno.
      </p>
      <p>
        Este derecho está garantizado por el{' '}
        <strong>artículo 34 de la Ley 24.240 de Defensa del Consumidor</strong>{' '}
        y su modificatoria por Ley 26.361. En Óptica Carballo lo respetamos
        plenamente.
      </p>

      <h2>Cómo ejercer el botón de arrepentimiento</h2>
      <p>
        La forma más rápida y efectiva es contactarnos directamente por
        WhatsApp o por email indicando:
      </p>
      <ul>
        <li>Tu nombre completo y DNI.</li>
        <li>Número de orden o fecha de compra.</li>
        <li>Producto que querés devolver.</li>
        <li>Fecha en que recibiste el producto.</li>
        <li>Una declaración clara de que ejercés el botón de arrepentimiento.</li>
      </ul>
      <p>
        Una vez recibida tu solicitud, te confirmamos la recepción y
        coordinamos el retiro o reenvío del producto.
      </p>

      <h2>Qué pasa después</h2>
      <ol className="list-decimal space-y-2 pl-6">
        <li>Te confirmamos la recepción de tu solicitud por escrito.</li>
        <li>
          Coordinamos el retiro o reenvío del producto.{' '}
          <strong>El envío de la devolución lo pagamos nosotros</strong> — por
          ley, el arrepentimiento no puede implicarte ningún costo (art. 34 Ley
          24.240 y art. 1115 del Código Civil y Comercial). El producto debe
          devolverse sin uso (probártelos está bien), con todos sus accesorios
          y en embalaje original.
        </li>
        <li>
          Una vez recibido y verificado el estado del producto, procesamos el
          reintegro total del precio pagado, por el mismo medio de pago, dentro
          de los <strong>10 días hábiles</strong>.
        </li>
      </ol>

      <h2>Canales de contacto</h2>
      <p>
        Podés ejercer tu derecho por cualquier medio que deje constancia
        escrita. El más rápido:
      </p>
      <ul>
        {whatsappLink ? (
          <li>
            <strong>WhatsApp:</strong>{' '}
            <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
              Iniciar conversación
            </a>
          </li>
        ) : (
          <li>
            <strong>WhatsApp</strong>: el número figura en el pie de página del
            sitio.
          </li>
        )}
        {business.phone && (
          <li>
            <strong>Teléfono:</strong> {business.phone}
          </li>
        )}
      </ul>

      <h2>Excepciones</h2>
      <p>
        El derecho de arrepentimiento <strong>no se aplica</strong> a productos
        personalizados según especificaciones del consumidor (art. 1116 inc. a
        del Código Civil y Comercial). En nuestro caso, esto incluye:
      </p>
      <ul>
        <li>
          Anteojos de receta con lentes graduadas a medida según tu
          prescripción oftalmológica.
        </li>
      </ul>
      <p>
        Para esos casos, mirá nuestra{' '}
        <a href="/politica-de-devolucion">
          política de cambios y devoluciones
        </a>{' '}
        completa.
      </p>
    </InfoPageShell>
  );
}
