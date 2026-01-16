import { AdminEventsDashboard } from '../../../components/admin/AdminEventsDashboard';
import { AdminGuard } from '../../../components/admin/AdminGuard';

export default function AdminEventosPage() {
  return (
    <AdminGuard>
      <AdminEventsDashboard />
    </AdminGuard>
  );
}
