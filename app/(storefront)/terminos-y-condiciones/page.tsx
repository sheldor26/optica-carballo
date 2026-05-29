import type { Metadata } from 'next';
import { InfoPageShell } from '@/components/legal/info-page-shell';
import { PlaceholderNote } from '@/components/legal/placeholder-note';
import { buildInfoPageMetadata } from '@/lib/catalog/metadata';
import { getBusinessInfo } from '@/lib/site/business';

const SLUG = 'terminos-y-condiciones';
const TITLE = 'Términos y condiciones';

export const revalidate = 86400;

export function generateMetadata(): Metadata {
  return buildInfoPageMetadata({
    title: TITLE,
    description:
      'Términos y condiciones de uso del sitio y de las compras realizadas en Óptica Carballo. Información del vendedor, pagos, envíos, devoluciones, receta médica y ley aplicable.',
    slug: SLUG,
  });
}

export default function Page() {
  const business = getBusinessInfo();

  return (
    <InfoPageShell title={TITLE} slug={SLUG}>
      <p>
        Estos términos regulan el uso del sitio {business.siteName} y las
        compras que realices a través de él. Al navegar el sitio o hacer una
        compra, aceptás estos términos. Si no estás de acuerdo con alguno, no
        uses el sitio.
      </p>

      <PlaceholderNote>
        <p>
          Términos redactados como template estándar para óptica argentina con
          venta online. Campos <code>[A CONFIRMAR]</code> requieren
          confirmación del founder (razón social, CUIT, domicilio, jurisdicción
          específica). Revisar con abogado antes de activar checkout
          end-to-end.
        </p>
      </PlaceholderNote>

      <h2>1. Identidad del vendedor</h2>
      <ul>
        <li>
          <strong>Nombre comercial</strong>: {business.siteName}.
        </li>
        <li>
          <strong>Razón social</strong>: [A CONFIRMAR].
        </li>
        <li>
          <strong>CUIT</strong>: [A CONFIRMAR].
        </li>
        <li>
          <strong>Domicilio comercial</strong>:{' '}
          {business.locality && business.region ? (
            <>
              {business.street ? `${business.street}, ` : ''}
              {business.locality}, {business.region}, Argentina
            </>
          ) : (
            <>[A CONFIRMAR: dirección completa]</>
          )}
          .
        </li>
        <li>
          <strong>Regente óptica matriculada</strong>:{' '}
          {business.regenteName ?? '[A CONFIRMAR]'}
          {business.regenteMatricula && (
            <> (Matrícula {business.regenteMatricula})</>
          )}
          .
        </li>
      </ul>

      <h2>2. Aceptación de los términos</h2>
      <p>
        El uso del sitio y la realización de una compra implica la aceptación
        completa de estos términos. Si comprás a través de la cuenta de un
        tercero (familiar, amigo) declarás tener su autorización para hacerlo.
      </p>

      <h2>3. Productos y servicios ofrecidos</h2>
      <ul>
        <li>
          <strong>Anteojos de sol</strong>: con protección UV. Marcas que
          trabajamos con stock real declarado en el sitio.
        </li>
        <li>
          <strong>Armazones para anteojos de receta</strong>: el precio
          publicado es del armazón. Los cristales graduados se cotizan
          aparte según tu receta.
        </li>
        <li>
          <strong>Servicio de armado de lentes graduados</strong>: incluido
          en compras de anteojos recetados monofocales estándar. Multifocales,
          bifocales y graduaciones elevadas requieren atención presencial en
          el local.
        </li>
      </ul>
      <p>
        Las descripciones, fotos y precios son informativos. Nos reservamos el
        derecho de corregir errores tipográficos evidentes (por ejemplo,
        precios con orden de magnitud errado) antes de despachar.
      </p>

      <h2>4. Stock y disponibilidad</h2>
      <p>
        <strong>
          Solo vendemos productos con stock real físico en nuestro local.
        </strong>{' '}
        Si un producto aparece como disponible al momento de la compra, lo
        despachamos. En caso excepcional de stock agotado entre la compra y la
        confirmación (ej: dos compras simultáneas del último item), te
        contactamos para reembolso completo o cambio por otro modelo.
      </p>

      <h2>5. Precios y formas de pago</h2>
      <p>
        Los precios están expresados en pesos argentinos (ARS) e incluyen
        IVA. Aceptamos:
      </p>
      <ul>
        <li>Tarjetas de crédito (en cuotas según promociones vigentes).</li>
        <li>Tarjetas de débito.</li>
        <li>Transferencia bancaria.</li>
        <li>Mercado Pago (dinero en cuenta, MODO, etc.).</li>
        <li>Efectivo en local (al retirar).</li>
      </ul>
      <p>
        Las cuotas sin interés dependen de las promociones bancarias vigentes
        y pueden cambiar sin previo aviso por decisión del banco.
      </p>

      <h2>6. Facturación</h2>
      <p>
        Toda compra genera factura electrónica AFIP. Por default emitimos
        factura B (consumidor final). Si necesitás factura A (con CUIT)
        completá los datos correspondientes al hacer la compra.
      </p>

      <h2>7. Envíos</h2>
      <p>
        Enviamos a todo Argentina. Operador principal: <strong>Andreani</strong>.
        Operador alternativo (zonas no cubiertas): <strong>Correo Argentino</strong>.
        Retiro gratis en nuestro local de{' '}
        {business.locality ?? '[A CONFIRMAR]'}.
      </p>
      <p>
        Los plazos son estimados — dependen del operador logístico y no son
        garantizados. Una vez despachado, te enviamos código de seguimiento.
      </p>

      <h2>8. Cambios y devoluciones</h2>
      <p>
        Aplica nuestra{' '}
        <a href="/politica-de-devolucion">política de cambios y devoluciones</a>.
        Resumen:
      </p>
      <ul>
        <li>
          <strong>Arrepentimiento (10 días)</strong>: Defensa del Consumidor
          ley 24.240 art. 34.
        </li>
        <li>
          <strong>Cambios sin uso (30 días)</strong>: producto en condiciones
          originales con estuche y etiquetas.
        </li>
        <li>
          <strong>No aplica a productos personalizados</strong> (lentes
          graduados con tu receta, lentes de contacto con blister abierto).
        </li>
        <li>
          <strong>Defecto de fábrica</strong>: garantía 1 año del fabricante.
        </li>
      </ul>

      <h2>9. Receta médica para anteojos recetados</h2>
      <p>
        <strong>
          Por ley, ningún anteojo recetado se vende sin receta válida
        </strong>{' '}
        de oftalmólogo o técnico óptico matriculado. La receta se valida antes
        del armado. Multifocales, bifocales y graduaciones elevadas requieren
        atención presencial en nuestro local.
      </p>
      <p>
        Al subir tu receta declarás que es real, vigente y tuya. Datos falsos
        invalidan la compra sin reintegro del costo del armado si ya se
        ejecutó.
      </p>

      <h2>10. Garantía</h2>
      <p>
        Todos los productos incluyen garantía de 1 año del fabricante contra
        defectos de fabricación. No cubre:
      </p>
      <ul>
        <li>Uso indebido (golpes, caídas, rotura accidental).</li>
        <li>Ralladuras por limpieza incorrecta.</li>
        <li>Desgaste normal por uso.</li>
      </ul>
      <p>
        En caso de defecto, contactanos y coordinamos reparación o reemplazo
        según corresponda.
      </p>

      <h2>11. Propiedad intelectual</h2>
      <p>
        El contenido del sitio (textos, imágenes, logos, código) es propiedad
        de {business.siteName} o se usa con licencia de los respectivos
        titulares (marcas, fabricantes). No está permitido reproducirlo sin
        autorización escrita.
      </p>
      <p>
        Las marcas mencionadas (Vulk, Rusty, Reef, Mormaii, Paula Cahen
        D&apos;Anvers, etc.) son propiedad de sus respectivos dueños. Las
        usamos para identificar productos en venta autorizada.
      </p>

      <h2>12. Limitación de responsabilidad</h2>
      <p>
        {business.siteName} no es responsable por:
      </p>
      <ul>
        <li>
          Errores de visualización por incompatibilidad con dispositivos
          obsoletos o configuraciones específicas del usuario.
        </li>
        <li>
          Interrupciones temporales del servicio por mantenimiento o factores
          externos (caídas de proveedores de infraestructura).
        </li>
        <li>
          Uso del producto contrario a las instrucciones del fabricante o
          recomendaciones profesionales.
        </li>
        <li>
          Daños indirectos derivados del uso del producto fuera de las
          condiciones normales.
        </li>
      </ul>

      <h2>13. Protección de datos</h2>
      <p>
        El tratamiento de tus datos personales se rige por nuestra{' '}
        <a href="/politica-de-privacidad">política de privacidad</a>, que
        cumple la Ley 25.326.
      </p>

      <h2>14. Modificaciones a estos términos</h2>
      <p>
        Podemos actualizar estos términos para reflejar cambios en nuestros
        servicios o en la legislación. Los términos vigentes son los publicados
        en esta página. Cambios materiales te los notificamos por email si
        tenés cuenta o estás suscripto al newsletter. Tu compra anterior se
        rige por los términos al momento de la transacción.
      </p>

      <h2>15. Ley aplicable y jurisdicción</h2>
      <p>
        Estos términos se rigen por la ley argentina. Cualquier disputa será
        resuelta en los tribunales ordinarios de{' '}
        {business.locality ?? '[A CONFIRMAR: jurisdicción]'}, Argentina,
        renunciando las partes a cualquier otro fuero o jurisdicción que
        pudiera corresponder.
      </p>
      <p>
        Esto no afecta los derechos del consumidor según la Ley 24.240, que
        pueden ejercerse en el fuero del consumidor (domicilio del comprador).
      </p>

      <p className="text-muted-foreground mt-8 text-xs">
        Última actualización: 2026-05-29.
      </p>
    </InfoPageShell>
  );
}
