// Módulo: frontend-admin
// Función: Redirección inicial del panel admin hacia /admin/eventos
// Relacionados: pages/admin/login.tsx, pages/admin/eventos/index.tsx
// Rutas/Endpoints usados: ninguno
// Notas: Ahora redirige a eventos si está autenticado, o al login si no lo está
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAdminAuth } from '../../context/AdminAuthContext';

export default function AdminIndexRedirect() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAdminAuth();

  useEffect(() => {
    if (isLoading) return;
    
    if (isAuthenticated) {
      router.replace('/admin/eventos');
    } else {
      router.replace('/admin/login');
    }
  }, [router, isAuthenticated, isLoading]);

  return null;
}
