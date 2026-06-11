import type { Metadata } from 'next';
import { InfoPageShell } from '@/components/legal/info-page-shell';
import { buildInfoPageMetadata } from '@/lib/catalog/metadata';
import { getBusinessInfo } from '@/lib/site/business';

const SLUG = 'politica-de-devolucion';
const TITLE = 'Política de cambios y devoluciones';

export const revalidate = 86400;

export function generateMetadata(): Metadata {
  return buildInfoPageMetadata({
    title: TITLE,
    description:
      'Política de cambios y devoluciones de Óptica Carballo. Arrepentimiento de 10 días, cambios hasta 30 días, garantía legal de 1 año y cómo iniciar el trámite.',
    slug: SLUG,
  });
}

/**
 * Política definitiva confirmada por el founder (2026-06-11) + verificación
 * legal del agente argentine-ecom (misma fecha):
 * - Arrepentimiento: 10 días corridos desde la entrega; el envío de
 *   devolución lo paga el VENDEDOR — irrenunciable (art. 34 Ley 24.240 y
 *   art. 1115 CCyC). NO se puede trasladar al comprador.
 * - Cambios voluntarios: 30 días (ya definidos en BUSINESS_POLICIES.md §4),
 *   acá SÍ el envío corre por cuenta del comprador (política comercial libre
 *   desde la derogación de la Res. 915-E/2017 por Res. 139/2025).
 * - Recetados a medida: exceptuados del arrepentimiento (CCyC art. 1116
 *   inc. a — productos personalizados); solo garantía por defectos.
 * - Garantía legal: 1 AÑO para productos nuevos (art. 11 Ley 24.240, texto
 *   según Ley 27.701) — no 6 meses; flete de garantía a cargo del vendedor.
 */
export default function Page() {
  const business = getBusinessInfo();

  return (
    <InfoPageShell title={TITLE} slug={SLUG}>
      <p>
        En Óptica Carballo queremos que estés conforme con tu compra. Acá te
        explicamos los tres caminos posibles — arrepentimiento, cambio y
        garantía — con sus plazos y condiciones, sin letra chica.
      </p>

      <h2>Resumen rápido</h2>
      <ul>
        <li>
          <strong>Te arrepentiste de la compra</strong>: 10 días corridos desde
          que lo recibiste. Te devolvemos el total y el envío de vuelta lo
          pagamos nosotros.
        </li>
        <li>
          <strong>Querés cambiarlo</strong> (otro modelo, otro color): hasta 30
          días corridos. El envío del cambio corre por tu cuenta.
        </li>
        <li>
          <strong>Vino con un defecto de fabricación</strong>: garantía legal
          de 1 año. Todos los costos los cubrimos nosotros.
        </li>
      </ul>

      <h2>Derecho de arrepentimiento (10 días)</h2>
      <p>
        Si compraste a distancia (por este sitio o por WhatsApp), tenés{' '}
        <strong>10 días corridos desde que recibís el producto</strong> para
        arrepentirte de la compra, sin necesidad de justificar el motivo. Es un
        derecho garantizado por el artículo 34 de la Ley 24.240 de Defensa del
        Consumidor y los artículos 1110 a 1116 del Código Civil y Comercial.
      </p>
      <ul>
        <li>
          El producto tiene que estar <strong>sin uso</strong> (probártelos
          está bien — eso es inspección normal), completo y en buen estado, con
          sus etiquetas y accesorios (estuche y franela).
        </li>
        <li>
          <strong>El envío de la devolución lo pagamos nosotros</strong> — el
          arrepentimiento no puede implicarte ningún costo (art. 1115 CCyC).
        </li>
        <li>
          Te reintegramos el <strong>total</strong> por el mismo medio de pago,
          dentro de los <strong>10 días hábiles</strong> de recibido y revisado
          el producto.
        </li>
      </ul>
      <p>
        Para ejercerlo, mirá la página{' '}
        <a href="/boton-de-arrepentimiento">Botón de arrepentimiento</a>.
      </p>

      <h2>Cambios por modelo o color (30 días)</h2>
      <p>
        Si preferís otro modelo u otro color, aceptamos cambios dentro de los{' '}
        <strong>30 días corridos</strong> desde la entrega, siempre que el
        producto esté:
      </p>
      <ul>
        <li>Sin uso, con sus etiquetas intactas.</li>
        <li>Completo: estuche, franela y embalaje original.</li>
        <li>Acompañado de la factura o comprobante de compra.</li>
      </ul>
      <p>
        En los cambios, <strong>el costo de envío</strong> (mandarnos el
        producto y recibir el nuevo) <strong>corre por cuenta del comprador</strong>.
        El cambio queda sujeto a stock disponible; si el producto nuevo tiene
        otro precio, se abona o acredita la diferencia.
      </p>

      <h2>Productos que NO admiten cambio ni devolución</h2>
      <ul>
        <li>
          <strong>Anteojos de receta con lentes hechas a medida</strong> según
          tu prescripción. Son productos personalizados (art. 1116 inc. a del
          Código Civil y Comercial): una vez fabricados con tu graduación no
          pueden revenderse. Tienen <strong>garantía completa por defectos de
          fabricación o de elaboración</strong> (ver abajo), pero no admiten
          arrepentimiento ni cambio.
        </li>
        <li>
          <strong>Lentes de contacto</strong> con la caja abierta o el blister
          violado, por razones sanitarias.
        </li>
      </ul>

      <h2>Defectos de fábrica y garantía (1 año)</h2>
      <p>
        Todos nuestros productos nuevos tienen la{' '}
        <strong>garantía legal de 1 año</strong> desde la entrega (art. 11, Ley
        24.240) contra defectos de fabricación. Si tu producto presenta un
        defecto, lo reparamos o lo cambiamos sin cargo, y{' '}
        <strong>los costos de envío los cubrimos nosotros</strong>.
      </p>
      <p>
        La garantía cubre defectos de fabricación y de elaboración (en
        recetados: tallado o montaje de las lentes). No cubre roturas por
        golpes, ralladuras por uso ni daños por limpieza con productos
        inadecuados.
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
            <> por nuestros canales de contacto</>
          )}{' '}
          dentro del plazo correspondiente.
        </li>
        <li>Pasanos el número de orden y el motivo del cambio o devolución.</li>
        <li>
          Coordinamos el envío o retiro del producto. El costo del envío de
          retorno corre por nuestra cuenta en arrepentimiento y garantía, y por
          cuenta del comprador en cambios voluntarios.
        </li>
        <li>
          Recibido y revisado el producto, procesamos el reintegro o el cambio
          dentro de los <strong>10 días hábiles</strong>.
        </li>
      </ol>

      <h2>Reintegros</h2>
      <p>
        Los reintegros se realizan por el mismo medio de pago original. Mercado
        Pago tiene sus propios tiempos de acreditación que escapan a nuestro
        control (en general, de 3 a 10 días hábiles adicionales según el medio
        de pago).
      </p>
    </InfoPageShell>
  );
}
