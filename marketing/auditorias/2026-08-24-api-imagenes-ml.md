# Reemplazo de las 2 primeras fotos de MLA1549858831

**Camino elegido: subir por multipart y hacer un solo PUT con los 7 `id`. Nunca `{"source": url}`.** El motivo está en Precauciones (riesgo de que ML despause el ítem solo).

---

## 0. Preparación (antes de tocar la API)

**Token.** El `access_token` vive encriptado en Supabase (`marketplace_integrations`, columna `access_token`, AES-256-GCM). El patrón de desencriptado ya está resuelto en `/Users/juan/Proyectos web/optica-carballo/scripts/ml-item.ts` (líneas 12-24). Para los curls de abajo, exportarlo:

```bash
export ML_TOKEN="<access_token desencriptado>"
export ITEM=MLA1549858831
```

**Fotos nuevas.** Dos JPG 1500x1500, RGB, ya diagnosticadas. Rutas a mano:
```bash
export FOTO1=/ruta/nueva-portada.jpg   # va a quedar en posición 1
export FOTO2=/ruta/nueva-2.jpg
```

---

## 1. GET del ítem + backup (obligatorio, no saltear)

```bash
curl -s -H "Authorization: Bearer $ML_TOKEN" \
  "https://api.mercadolibre.com/items/$ITEM" \
  > "/Users/juan/Proyectos web/optica-carballo/marketing/backup-imagenes/${ITEM}-antes.json"
```

Nota: `GET /items/{id}` ya **no** responde sin token (devuelve 403 `PA_UNAUTHORIZED_RESULT_FROM_POLICIES`). El header va sí o sí.

Extraer los ids en orden:

```bash
jq -r '.pictures[] | "\(.id)\t\(.size)\t\(.secure_url)"' "...${ITEM}-antes.json"
```

De ese listado:
- Posiciones 1 y 2 → las apaisadas (1200x546 y 1200x440). **Descargar los dos `secure_url` a disco antes de seguir** — no hay undo ni versionado de fotos en ML, y no hay fuente oficial sobre si la URL vieja del CDN sigue resolviendo después.
- Posiciones 3 a 7 → copiar los 5 `id` **en ese orden exacto**. Son los que hay que reenviar.

Chequeo barato de salud de esos 5 (si alguno está en `ERROR`, el PUT entero falla con `cause_id: 508`):

```bash
for P in ID3 ID4 ID5 ID6 ID7; do
  echo "== $P"; curl -s -H "Authorization: Bearer $ML_TOKEN" \
    "https://api.mercadolibre.com/pictures/$P/errors"
done
```

---

## 2. Subir las 2 fotos nuevas al CDN

```bash
curl -s -X POST \
  -H "Authorization: Bearer $ML_TOKEN" \
  -F "file=@$FOTO1" \
  "https://api.mercadolibre.com/pictures/items/upload"
```

- Campo del binario: **`file`**, exacto. No existe `source` en este endpoint ("El endpoint solo soporta subidas multipart (de data directa) y para ítem").
- No setear `Content-Type` a mano si se hace desde fetch/axios con FormData — que el cliente ponga el boundary.
- Esperar ~1 segundo y repetir con `$FOTO2`. El endpoint tiene RPM limitado por `app_id`; un 429 es cuota excedida.

Respuesta esperada (HTTP 200):
```json
{ "id": "959699-MLA...._082026", "max_size": "1360x1360", "crop": {...}, "variations": [ {"size":"...","url":"...","secure_url":"..."} ] }
```

**Leer `max_size` de cada respuesta antes de seguir.** El upload aplica smartcrop: recorta el fondo blanco sobrante dejando ~10% de margen total, así que el archivo NO queda en 1500x1500 en el CDN. Si el anteojo ocupa poco cuadro, el recorte puede dejar el lado corto abajo de 500px y el endpoint devuelve 400 con el detalle ("la imagen subida, procesados los bordes blancos, tiene un tamaño de XXXpx x XXXpx"). Si pasa eso: recuadrar la foto más ajustada al producto y volver a subir.

Guardar los dos ids: `PIC_NUEVA_1`, `PIC_NUEVA_2`.

---

## 3. Re-diagnosticar las nuevas ya con el smartcrop aplicado (recomendado, barato)

El diagnóstico previo se corrió sobre el archivo original en base64 (`scripts/ml-diagnostico-imagenes.ts` línea 134). Post-upload la composición cambió, así que conviene re-chequear por `picture_id`:

```bash
curl -s -X POST \
  -H "Authorization: Bearer $ML_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"picture_id":"PIC_NUEVA_1","context":{"category_id":"MLA417128","title":"<título exacto del ítem>","picture_type":"thumbnail"}}' \
  "https://api.mercadolibre.com/moderations/pictures/diagnostic"
```

Y la segunda con `"picture_type":"other"` (reglas más flexibles). Regla: si mandás `picture_id`, usás ese campo; si mandás URL o base64, `picture_url`. Nunca los dos. `action: "empty"` = imagen válida. Espaciar las llamadas: este endpoint también tiene rate limit por `app_id`.

---

## 4. El PUT (el único paso destructivo)

```bash
curl -s -X PUT \
  -H "Authorization: Bearer $ML_TOKEN" \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d '{
    "pictures": [
      {"id": "PIC_NUEVA_1"},
      {"id": "PIC_NUEVA_2"},
      {"id": "ID3"},
      {"id": "ID4"},
      {"id": "ID5"},
      {"id": "ID6"},
      {"id": "ID7"}
    ]
  }' \
  "https://api.mercadolibre.com/items/$ITEM" \
  > "/Users/juan/Proyectos web/optica-carballo/marketing/backup-imagenes/${ITEM}-despues.json"
```

Reglas duras de este body:
- **El array reemplaza la galería entera.** Doc textual: "Para borrar la imagen, deberás mandar sólo los IDs de las imágenes cargadas que deseas conservar". No hay modo append ni flag de preservar. Si faltan los 5, se borran.
- Los 2 malos desaparecen por omisión. No hace falta (ni existe documentado) un DELETE por foto.
- **Solo `pictures` en el body.** Nada de `price` (desde el 18/03/2026 un PUT solo-price se rechaza con 400, y mezclado se ignora con warning). Nada de `variations`/`picture_ids` — el ítem no tiene variaciones y el bloque del ejemplo de la doc no aplica acá.
- Nunca mandar el array vacío: hay regla vigente desde marzo 2026 que rechaza con 400 los `gold_pro` con `requires_picture: true` que queden sin fotos.

El PUT devuelve el ítem completo actualizado en el 200 — ahí mismo se lee `status`, `sub_status`, `thumbnail_id` y `pictures[]`.

**No confirmado por fuente oficial:** que "la primera del array es la portada" no está escrito con esas palabras en ninguna doc. Se deduce de que el orden lo define el body, de que no hay otro campo escribible (`thumbnail`/`thumbnail_id` son derivados, no se escriben), y de que la API de diagnóstico llama `thumbnail` a "la imagen principal de la publicación". Por eso el paso 4 del checklist verifica `thumbnail_id` explícitamente.

---

## Qué se rompe si sale mal, y cómo se vuelve atrás

| Falla | Síntoma | Vuelta atrás |
|---|---|---|
| Omitiste un id de los 5 | esa foto desaparece del ítem, sin aviso | segundo PUT con el array completo, tomando los ids del `${ITEM}-antes.json`. Los picture_id no se destruyen al desvincularlos: se reenvían y vuelven. **Esto es lo que salva el operativo, por eso el backup es obligatorio.** |
| Orden mal armado | galería desordenada / portada equivocada | PUT nuevo con el orden correcto. Cero riesgo. |
| 400 `cause_id: 508` | "Picture id X has an invalid status 'ERROR'. Only ACTIVE or PENDING pictures are allowed" | el PUT no se aplicó (falla entero). Identificar cuál, resubirla y rearmar el array. |
| 400 `cause_id: 509` | "is below the minimum allowed size" | el PUT no se aplicó. Recuadrar y resubir. |
| 409 `item optimistic locking error: conflict` | escritura concurrente | esperar unos segundos y reintentar **una** vez. No loopear: ahí sí se pega contra el rate limit. |
| 429 en upload o diagnóstico | cuota del `app_id` excedida | backoff exponencial con jitter. No reintentar en ráfaga. |
| Querés volver a las fotos originales viejas | — | PUT con los 7 ids del backup. Reversible mientras los ids sigan ACTIVE. |

Lo que **no** es reversible: nada, mientras tengas el `${ITEM}-antes.json`. Lo único sin red es haber borrado los archivos locales originales de las dos apaisadas — de ahí el paso de descargarlas antes.

**Sin fuente oficial (no lo doy por bueno):** si las URLs viejas de `http2.mlstatic.com` siguen resolviendo después del cambio, y qué foto muestran las preguntas y órdenes anteriores. Inferencia razonable pero no verificada: preguntas y órdenes referencian el `item_id`, no un snapshot, así que pasarían a mostrar las nuevas. Si eso importa para el negocio, hay que probarlo, no asumirlo.

---

## Precauciones

**Despausar: ni antes ni durante. Después, y sólo si el founder lo decide.**
- No hace falta despausar para cambiar fotos. La guía de sincronización dice textual: "Siempre puedes agregar o reemplazar imágenes de ítems". Las restricciones documentadas de edición son sobre título (con ventas), modo de compra y métodos de pago — nunca sobre imágenes.
- Honestidad sobre la confianza: la única frase explícita "remember your item must be active in order to be modified" aparece **sólo** en la guía del vertical Servicios, no en la de ítems de Marketplace. Por eso el paso 4 verifica el status en la respuesta del propio PUT en vez de asumir.
- `paused_by_seller` es pegajoso: no se reactiva solo. Reactivar es un PUT aparte y explícito `{"status":"active"}` — decisión del founder, no del script.

**El riesgo #1 del operativo es usar `{"source":"https://..."}`.** Desde el rollout de junio en MLA, la carga por URL deja la publicación en `sub_status: picture_download_pending` y, cuando la descarga termina OK, **ML la pone en `status: active` automáticamente**. Un ítem pausado a propósito puede terminar publicado y vendible sin que nadie lo pida. Sumale whitelist de IPs de ML, redirects 301 que rompen, y certificados SSL. El multipart evita todo eso de una. (Ambigüedad honesta: la sección detallada arranca con "Al crear un nuevo ítem…", así que no está 100% claro que aplique a updates de ítems existentes. No es un riesgo que valga la pena testear en producción cuando el camino seguro existe.)

**Re-moderación de la portada: sí, se re-evalúa.** La moderación de imágenes es por foto (el payload trae `evidence.text_matched` = el picture_id y `section_name: "pictures"`) y los wordings apuntan explícitamente a la portada. No hay doc de que editar una foto reencole la publicación entera a revisión manual: lo que se evalúa es la imagen nueva contra los filtros automáticos.
- Desenlace típico si algo no gusta: **no** es `under_review`, es `Active + poor_quality_thumbnail` — el ítem sigue vivo pero pierde exposición. El único camino documentado a `under_review` por fotos es vía descarga fallida por `source`, que acá no aplica.
- Ojo con la expectativa: pasar el diagnóstico sin observaciones **no blinda**. La API sólo evalúa `white_background`, `minimum_size`, `text_logo` y `watermark`. La moderación real también castiga producto mal iluminado y producto cortado o tocando los bordes. Esos dos hay que mirarlos a ojo antes de subir.

**Esperas entre requests:** 1 segundo entre los dos uploads; el PUT inmediatamente después; después del PUT, unos segundos antes del GET de verificación (las fotos pueden quedar en PENDING, "Procesando imagen…" — eso no es error y no se corrige reintentando el PUT).

**Cupo:** verificado en vivo, `MLA417128` tiene `max_pictures_per_item: 12`. Con 7 finales estás holgado.

---

## Checklist de verificación post-cambio

```bash
sleep 10
curl -s -H "Authorization: Bearer $ML_TOKEN" "https://api.mercadolibre.com/items/$ITEM" \
| jq '{status, sub_status, tags, thumbnail_id,
       n: (.pictures|length),
       pics: [.pictures[] | {id, size, max_size}]}'
```

1. **Cantidad**: `n == 7`. Ni 5 (te comiste los conservados), ni 9 (usaste `POST /items/{id}/pictures` por error, que agrega al final y deja las apaisadas en portada).
2. **Orden**: `pics[0].id == PIC_NUEVA_1`, `pics[1].id == PIC_NUEVA_2`, y `pics[2..6]` idénticos a ID3..ID7 del backup, en ese orden.
3. **Las malas se fueron**: ninguno de los dos ids apaisados aparece en el array.
4. **Portada**: `thumbnail_id` apunta a `PIC_NUEVA_1`. Si no, revisar **antes** de despausar.
5. **Dimensiones**: ninguna `size`/`max_size` con un lado por debajo de 500px, y las nuevas ya no son apaisadas.
6. **Estado intacto**: `status == "paused"` y `sub_status` sigue conteniendo `paused_by_seller`. Si aparece `picture_download_pending`, algo se fue por el camino de `source` — frenar y revisar.
7. **Tags**: que no aparezca `poor_quality_thumbnail`.
8. **Moderación** (si el punto 7 prende alguna alarma, o por prolijidad):
   ```bash
   curl -s -H "Authorization: Bearer $ML_TOKEN" \
     "https://api.mercadolibre.com/moderations/last_moderation/${ITEM}-ITM"
   ```
   El `reference_id` es el item_id + `-ITM`. Si hay observación, el remedy viene en el campo `wordings`.
9. **A ojo**: abrir el `permalink` y mirar el encuadre real. El smartcrop pudo recortar distinto al archivo que preparaste — no asumir que quedó igual al 1500x1500 original.
10. **Recién ahí**, si el founder lo decide, despausar como paso separado: `PUT /items/$ITEM` con `{"status":"active"}`.

**Archivos de referencia del repo:** patrón de token OAuth en `/Users/juan/Proyectos web/optica-carballo/scripts/ml-item.ts`; diagnóstico en `/Users/juan/Proyectos web/optica-carballo/scripts/ml-diagnostico-imagenes.ts` (hoy manda base64, para el paso 3 hay que agregarle soporte de `picture_id`); backups en `/Users/juan/Proyectos web/optica-carballo/marketing/backup-imagenes/`.