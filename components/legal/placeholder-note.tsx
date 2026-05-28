import { AlertTriangle } from 'lucide-react';

/**
 * Bloque visual que marca contenido como borrador pendiente de confirmación
 * del founder. Visible en producción intencionalmente: es preferible que
 * el visitante vea "borrador" a que el founder olvide editar y se publique
 * data inventada.
 */
export function PlaceholderNote({ children }: { children: React.ReactNode }) {
  return (
    <aside
      role="note"
      className="border-l-4 border-amber-500 bg-amber-50 p-4 text-sm text-amber-900"
    >
      <div className="flex gap-3">
        <AlertTriangle className="size-5 shrink-0" aria-hidden="true" />
        <div className="space-y-1">
          <p className="font-semibold">Borrador pendiente de revisión</p>
          <div className="space-y-2">{children}</div>
        </div>
      </div>
    </aside>
  );
}
