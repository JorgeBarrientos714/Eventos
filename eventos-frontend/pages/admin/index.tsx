// Módulo: frontend-admin
// Función: Redirección inicial del panel admin hacia /admin/login
// Relacionados: pages/admin/login.tsx
// Rutas/Endpoints usados: ninguno
// Notas: No se renombra para mantener ruta Next.js.
import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function AdminIndexRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/admin/login');
  }, [router]);

  return null;
}
