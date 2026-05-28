# Skill: Deploy (`/deploy`)

## Cuándo usar esto

Cuando el founder está por pushear cambios a producción (Vercel main branch).

## Filosofía

**Es preferible no deployar un viernes** salvo emergencia. Es preferible deployar en chunks chicos que en uno grande. Es preferible tener checklist aburrido que tener producción rota.

## Pre-deploy Checklist (correr SIEMPRE)

### 1. Código

- [ ] No quedan `console.log` ni `print()` de debug
- [ ] No quedan API keys o secrets hardcodeados
- [ ] No quedan TODO sin fecha o sin owner
- [ ] No quedan bloques de código comentados sin explicación
- [ ] Error handling en todos los endpoints nuevos
- [ ] Server actions con validación de input (Zod)
- [ ] TypeScript compila sin errores (`pnpm tsc --noEmit`)
- [ ] Lint pasa (`pnpm lint`)
- [ ] Build local pasa (`pnpm build`)

### 2. Base de datos

- [ ] Migraciones nuevas testeadas en local antes de producción
- [ ] RLS policies verificadas en tablas nuevas o modificadas
- [ ] Indexes en columnas nuevas que se filtran/joinean
- [ ] No hay breaking changes a tablas existentes sin plan de migración
- [ ] Backups recientes existen (Supabase los hace solo, pero verificar)
- [ ] Si hay cambio destructivo (drop column, drop table): plan de rollback explícito

### 3. Variables de entorno

- [ ] Todas las nuevas vars agregadas en Vercel dashboard (Production env)
- [ ] `.env.example` actualizado con las nuevas (sin valores reales)
- [ ] Verificar que producción y preview tienen los mismos valores donde corresponde
- [ ] Secrets rotados si fueron expuestos por error en commits viejos

### 4. Performance

- [ ] Imágenes nuevas en WebP/AVIF, dimensiones explícitas
- [ ] Bundle no creció >20% sin justificación
- [ ] LCP no degradado en preview deploy
- [ ] No hay loops infinitos, fetches en client sin caché, etc.

### 5. SEO (si tocó páginas indexables)

- [ ] Meta title + description en cada página nueva
- [ ] Canonical URL configurado
- [ ] H1 único por página
- [ ] Structured data válido (verificar en https://validator.schema.org)
- [ ] Sitemap se regenera correctamente
- [ ] robots.txt sigue siendo correcto

### 6. Integraciones externas

- [ ] Webhook URLs apuntan al dominio de producción
- [ ] Mercado Pago: tokens de producción (no sandbox)
- [ ] Tusfacturas: ambiente correcto
- [ ] Resend: dominio verificado, sender autorizado

### 7. Testing manual end-to-end

Como mínimo correr el flujo principal del usuario:

- [ ] Home carga rápido
- [ ] Navegación a categoría funciona
- [ ] Página de producto carga, variantes funcionan
- [ ] Add to cart funciona
- [ ] Checkout (en sandbox o producción con orden de prueba)
- [ ] Webhook MP procesa correctamente
- [ ] Email de confirmación llega
- [ ] Mobile + desktop probados

### 8. Comunicación

- [ ] Si hay downtime esperado, comunicar antes
- [ ] Si hay breaking change para usuarios existentes, comunicar
- [ ] Cambios mayores documentados en CURRENT_STATE.md

## Proceso de deploy

### Para Vercel (Next.js frontend + backend)

1. **Commit con mensaje claro**:
   ```
   feat: agregar lector de receta IA
   
   - Endpoint /api/ai/parse-prescription
   - Componente PrescriptionUploader
   - Tabla prescriptions con RLS
   - Validation con Zod
   ```

2. **Push a main**:
   ```bash
   git push origin main
   ```

3. **Vercel deploya automático**. Esperar a que termine (1-3 min).

4. **Verificar en dashboard de Vercel**:
   - Build successful
   - No errores en logs de deployment
   - Preview deployment también está OK

5. **Smoke test en producción**:
   - Abrir la URL real
   - Probar el flujo afectado
   - Revisar console del browser
   - Revisar logs de Vercel del primer minuto

6. **Si hay errores**: rollback inmediato en Vercel dashboard (1 click).

### Para migraciones de Supabase

1. **Probar la migración en proyecto local primero**:
   ```bash
   supabase db reset
   ```

2. **Generar el SQL file con timestamp**:
   ```bash
   supabase migration new nombre_descriptivo
   ```

3. **Verificar que la migración es idempotente** o que tiene `IF NOT EXISTS` donde corresponde.

4. **Aplicar a producción** vía Supabase Dashboard → SQL Editor:
   - Pegar el SQL completo
   - Run
   - Verificar que no hay errores

5. **Verificar RLS**:
   - Si la tabla nueva tiene `ENABLE ROW LEVEL SECURITY`
   - Verificar que las policies estén creadas

6. **Smoke test**: query una row con el rol anon para verificar permisos.

### Para webhooks (MP, Tusfacturas, etc.)

1. **Actualizar URL del webhook** en el dashboard del servicio (no se hace automático).

2. **Probar con evento de prueba** (MP tiene "simular webhook" en developer dashboard).

3. **Verificar logs** del endpoint en Vercel.

## Post-deploy

### Primeros 30 minutos

- [ ] Monitor de errores (Vercel logs, Sentry si está)
- [ ] Métricas básicas no degradadas (Vercel Analytics)
- [ ] No hay alertas en MP / Tusfacturas / Resend

### Primer día

- [ ] Conversion rate no cayó
- [ ] No hay reportes de usuarios sobre el flujo afectado
- [ ] Logs no muestran patrón de errores nuevo

### Actualizar documentación

- [ ] `CURRENT_STATE.md` con qué se deployó y la fecha
- [ ] Si algo nuevo está en producción que afecta a métricas, agregarlo al tracking de `METRICS.md`

## Rollback

Si algo se rompe gravemente post-deploy:

### Vercel
- Dashboard → Deployments → seleccionar el deployment anterior estable → "Promote to Production"
- Resuelve en <30 segundos sin necesidad de revertir git

### Supabase (migración destructiva)
- Restore desde backup (admin panel)
- Esto SÍ es costoso, por eso el checklist de migración es estricto

### Combinado
- Revertir código (Vercel) y mantener migración de DB si es non-breaking
- Si la migración rompió: rollback de migración + rollback de código simultáneo

## Reglas duras

1. **NUNCA deployar sin haber corrido el checklist** completo.
2. **NUNCA deployar un viernes** salvo emergencia.
3. **NUNCA deployar migración destructiva sin plan de rollback**.
4. **NUNCA usar secrets de producción en preview deploys**.
5. **NUNCA dejar el monitor sin mirar las primeras 30 minutos**.
6. **NUNCA hacer "hot fix" directo en producción** sin pasar por dev local primero.

## Casos en los que NO se hace `/deploy`

- Cambios solo de documentación (`.md`) → push directo, no requiere checklist completo, pero sí mensaje de commit claro
- Cambios en `.claude/` → idem
- Cambios solo de copy menor (no afectan SEO ni schema) → checklist abreviado pero hacer smoke test
