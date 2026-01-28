// Módulo: frontend-admin
// Función: Layout base para vistas admin (navegación, shell y logout)
// Relacionados: AdminGuard, AdminEventsDashboard, pages/admin/*, AdminHeader
// Rutas/Endpoints usados: ninguno directo (usa logout del contexto)
// Notas: Ahora usa AdminHeader para navegación consistente con el portal público
import { useState } from 'react';
import { useRouter } from 'next/router';
import backgroundImage from '../../assets/Edificio Color Blanco.jpg';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { AdminHeader } from './AdminHeader';

interface AdminLayoutProps {
  title?: string;
  description?: string;
  children: React.ReactNode;
  showHeader?: boolean; // Permite ocultar header si se necesita
}

export function AdminLayout({ title, description, children, showHeader = true }: AdminLayoutProps) {
  const router = useRouter();
  const { session } = useAdminAuth();
  const backgroundUrl = 'src' in backgroundImage ? backgroundImage.src : backgroundImage;
  const [currentPage, setCurrentPage] = useState('eventos');

  const handleNavigate = (page: string) => {
    setCurrentPage(page);
    if (page === 'home') {
      router.push('/admin/home');
    } else if (page === 'eventos') {
      router.push('/admin/eventos');
    }
  };

  return (
    <div className="events-shell">
      <div
        className="events-bg-fixed"
        style={{
          backgroundImage: `linear-gradient(180deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.96) 75%), url(${backgroundUrl})`,
        }}
      />
      <div className="events-content">
        {showHeader && <AdminHeader currentPage={currentPage} onNavigate={handleNavigate} />}

        <main className="mx-auto w-full max-w-[1200px] px-4 py-10">
          <div className="mb-8 space-y-2">
            {title && <h2 className="text-2xl font-semibold text-gray-800">{title}</h2>}
            {description && <p className="text-sm text-gray-500">{description}</p>}
            {session && (
              <p className="text-xs text-gray-400">
                Conectado como <span className="font-medium text-gray-600">{session.usuario.correoElectronico}</span>
                {session.usuario.empleado?.areaNombre && (
                  <>
                    {' '}| Área: <span className="font-medium text-gray-600">{session.usuario.empleado.areaNombre}</span>
                  </>
                )}
              </p>
            )}
          </div>
          <div className="rounded-2xl bg-white/95 p-6 shadow-sm ring-1 ring-gray-100/60 backdrop-blur-sm">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
