// Módulo: frontend-admin
// Función: Página del tablero de eventos admin con guardia de autenticación
// Relacionados: AdminEventsDashboard, AdminGuard
// Rutas/Endpoints usados: delega en componentes/servicios
// Notas: No se renombra para preservar la ruta Next.js.
import { AdminEventsDashboard } from '../../../components/admin/AdminEventsDashboard';
import { AdminGuard } from '../../../components/admin/AdminGuard';

export default function AdminEventosPage() {
  return (
    <AdminGuard>
      <AdminEventsDashboard />
    </AdminGuard>
  );
}
