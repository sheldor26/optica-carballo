# Skill: Generar Migración Supabase (`/migration`)

## Cuándo usar esto

Cuando hay que modificar el schema de la base de datos: agregar tabla, columna, índice, política RLS, función, trigger, enum, etc.

## Antes de arrancar

Leer:
- `ARCHITECTURE.md` (sección de DB structure)
- `DECISIONS.md` (decisiones de schema ya tomadas)
- `MISTAKES.md` (errores de migraciones previas)

## Proceso

### Step 1 — Definir el cambio

Describir exactamente:
- Qué se agrega / modifica / elimina
- Por qué (referencia a ADR o feature)
- Es breaking change para data existente o no
- Es reversible o no

### Step 2 — Decidir tipo de cambio

| Tipo | Risk | Notas |
|------|------|-------|
| Agregar tabla nueva | 🟢 Bajo | Siempre seguro |
| Agregar columna nullable | 🟢 Bajo | Seguro |
| Agregar índice | 🟢 Bajo | Mejora performance, sin breaking |
| Agregar policy RLS | 🟢 Bajo | Sólo agrega seguridad |
| Agregar enum value | 🟡 Medio | OK si no se remueven valores existentes |
| Renombrar columna | 🔴 Alto | Breaking si código no se actualiza en paralelo |
| Drop columna | 🔴 Alto | Pérdida de data |
| Drop tabla | 🔴 Crítico | Pérdida de data |
| Cambiar tipo de columna | 🔴 Alto | Puede fallar por conversión |

**Para cambios 🔴**: requiere plan de rollback explícito y backup confirmado.

### Step 3 — Generar el archivo de migración

Formato Supabase CLI:

```bash
supabase migration new descripcion_corta_en_snake_case
```

Esto crea `supabase/migrations/YYYYMMDDHHMMSS_descripcion_corta.sql`.

Estructura del archivo:

```sql
-- ============================================
-- Migration: [descripción]
-- ADR: [referencia si aplica]
-- Fecha: YYYY-MM-DD
-- ============================================

-- Up migration
BEGIN;

-- Cambios aquí
[SQL statements]

COMMIT;

-- ============================================
-- Rollback plan
-- ============================================
-- [SQL para revertir, comentado]
-- BEGIN;
-- DROP TABLE IF EXISTS public.nueva_tabla;
-- COMMIT;
```

### Step 4 — Convenciones de naming

Tablas:
- `snake_case`, plural
- Sin prefijos como `tbl_`
- Schemas: `public` por default, otros cuando se justifica

Columnas:
- `snake_case`
- IDs: `id` (UUID), foreign keys: `[tabla_singular]_id` (ej: `product_id`)
- Timestamps: `created_at`, `updated_at` (siempre `timestamptz`)
- Booleanos: `is_X`, `has_X`, `can_X`
- JSONB: para data variable o cuando hace sentido

Indexes:
- `idx_[tabla]_[columna(s)]`
- Para queries comunes: indexar las columnas de WHERE / JOIN / ORDER BY
- Indexes parciales cuando aplica: `WHERE is_active = true`
- GIN index en JSONB cuando se queryea contenido

Enums:
- `snake_case`, singular: `order_status`, `product_category`

Policies RLS:
- Nombre descriptivo: `users can view own orders`, `admins can update products`

### Step 5 — RLS obligatorio en tablas con data de usuarios

Toda tabla nueva que toque datos personales DEBE tener RLS:

```sql
ALTER TABLE public.nueva_tabla ENABLE ROW LEVEL SECURITY;

-- Política para SELECT
CREATE POLICY "users can view own records"
  ON public.nueva_tabla
  FOR SELECT
  USING (auth.uid() = user_id);

-- Política para INSERT
CREATE POLICY "users can insert own records"
  ON public.nueva_tabla
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Política para UPDATE
CREATE POLICY "users can update own records"
  ON public.nueva_tabla
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Servicio role siempre tiene acceso (no necesita policy)
```

Para tablas públicas (lectura sin auth):
```sql
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "anyone can read active products"
  ON public.products
  FOR SELECT
  USING (is_active = true);

-- Escritura solo con service_role
```

### Step 6 — Triggers para `updated_at`

Toda tabla con `updated_at` debería tener trigger automático:

```sql
-- Function (crear una vez, reutilizable)
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger por tabla
CREATE TRIGGER on_update_set_timestamp
  BEFORE UPDATE ON public.nueva_tabla
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();
```

### Step 7 — Probar localmente

```bash
# Reset de DB local
supabase db reset

# Aplica todas las migraciones desde cero
```

Verificar:
- Migración se aplica sin errores
- Tabla / columna existe
- Policies RLS funcionan (probar con `anon` y `authenticated`)
- Índices se crearon
- Triggers funcionan

### Step 8 — Aplicar a producción

Vía Supabase Dashboard → SQL Editor:

1. Pegar el SQL completo
2. Run
3. Verificar logs (no errores)
4. Verificar visualmente en Table Editor que el cambio está

**Alternativa**: Supabase CLI con `db push` (más sofisticado, requiere setup).

### Step 9 — Verificar post-deploy

Smoke tests:
- Query la tabla con rol anon → ¿devuelve lo esperado por RLS?
- Insert una row de prueba → ¿funciona?
- Si hay trigger de `updated_at` → ¿actualiza?
- Si hay FK → ¿constraint funciona?

### Step 10 — Documentar

1. **Si la migración generó decisión nueva**: agregar ADR a `DECISIONS.md`.
2. **`CURRENT_STATE.md`**: registrar la migración con fecha.
3. **`ARCHITECTURE.md`**: si cambió el schema descrito, actualizar.

## Patrones comunes

### Tabla con audit trail

```sql
CREATE TABLE public.audit_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  table_name text NOT NULL,
  record_id uuid NOT NULL,
  action text NOT NULL CHECK (action IN ('insert', 'update', 'delete')),
  changed_by uuid REFERENCES auth.users(id),
  changed_at timestamptz DEFAULT now(),
  old_data jsonb,
  new_data jsonb
);

CREATE INDEX idx_audit_log_record ON public.audit_log(table_name, record_id);
```

### Soft delete

```sql
ALTER TABLE public.products ADD COLUMN deleted_at timestamptz;
CREATE INDEX idx_products_not_deleted ON public.products(id) WHERE deleted_at IS NULL;

-- Actualizar policies para excluir deleted
CREATE POLICY "anyone can read non-deleted products"
  ON public.products
  FOR SELECT
  USING (is_active = true AND deleted_at IS NULL);
```

### Full-text search

```sql
ALTER TABLE public.products
  ADD COLUMN search_vector tsvector
  GENERATED ALWAYS AS (
    to_tsvector('spanish', coalesce(name, '') || ' ' || coalesce(description, ''))
  ) STORED;

CREATE INDEX idx_products_search ON public.products USING gin(search_vector);

-- Query
SELECT * FROM public.products
WHERE search_vector @@ to_tsquery('spanish', 'wayfarer & negro');
```

### pgvector para embeddings (RAG)

```sql
CREATE EXTENSION IF NOT EXISTS vector;

ALTER TABLE public.articles
  ADD COLUMN embedding vector(1536);  -- dimensión de OpenAI embeddings

CREATE INDEX idx_articles_embedding
  ON public.articles
  USING hnsw (embedding vector_cosine_ops);
```

## Reglas duras

1. **NUNCA aplicar migración sin haberla probado localmente primero**.
2. **NUNCA aplicar migración destructiva sin backup confirmado**.
3. **NUNCA dropear columna sin haber verificado que el código no la usa**.
4. **NUNCA olvidar RLS en tabla con data de usuarios**.
5. **NUNCA crear tabla sin `created_at` y `updated_at`**.
6. **NUNCA crear FK sin entender ON DELETE behavior** (CASCADE, SET NULL, RESTRICT).
7. **NUNCA mezclar varios cambios complejos en una sola migración** — separar por feature.

## Anti-patrones conocidos

- **Migración que asume estado de data específico** (ej: "todos los productos tienen X") → puede fallar si data real es diferente.
- **RLS policy que reusa función custom mal definida** → silent failures.
- **Índice innecesario** → ocupa espacio sin acelerar nada.
- **JSONB en lugar de tabla relacional** cuando hay esquema conocido y se hacen joins → performance pésima.
- **Triggers que llaman APIs externas síncronas** → bloquean writes.

## Casos especiales

### Backfill de data

Si una migración requiere llenar columnas nuevas con data calculada:

```sql
-- 1. Agregar columna nullable
ALTER TABLE public.orders ADD COLUMN total_with_shipping numeric(10,2);

-- 2. Backfill (en transacción)
UPDATE public.orders SET total_with_shipping = subtotal + shipping_cost;

-- 3. Cuando todo está OK, hacer NOT NULL
ALTER TABLE public.orders ALTER COLUMN total_with_shipping SET NOT NULL;
```

Para tablas grandes, hacer backfill en batches.

### Schema change con downtime cero

Estrategia "expand → migrate → contract":
1. **Expand**: agregar nueva columna/tabla nueva (sin tocar la vieja)
2. **Migrate**: código empieza a escribir en la nueva mientras sigue leyendo la vieja, backfill
3. **Switch**: código empieza a leer la nueva
4. **Contract**: deprecar y dropear la vieja

Más complejo pero permite deploys sin frenar producción.
