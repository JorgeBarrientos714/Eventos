// Módulo: frontend-admin
// Función: Página de inicio para usuarios internos (muestra Home público con header administrativo)
// Relacionados: AdminGuard, AdminHeader, AdminLayout, components/Home
// Rutas/Endpoints usados: GET /eventos/evento/todos via lib/events
// Notas: Usa el Home público completo sin contenedores adicionales
import { useEffect, useState } from 'react';
import backgroundImage from '../../assets/Edificio Color Blanco.jpg';
import { AdminGuard } from '../../components/admin/AdminGuard';
import { AdminHeader } from '../../components/admin/AdminHeader';
import { Home } from '../../components/Home';
import { useRouter } from 'next/router';

export default function AdminHomePage() {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState('home');
  const [searchQuery, setSearchQuery] = useState('');
  const backgroundUrl = 'src' in backgroundImage ? backgroundImage.src : backgroundImage;

  const handleNavigate = (page: string) => {
    setCurrentPage(page);
    if (page === 'home') {
      router.push('/admin/home');
    } else if (page === 'eventos') {
      router.push('/admin/eventos');
    }
  };

  return (
    <AdminGuard>
      <div
        className="min-h-screen"
        style={{
          backgroundImage: `linear-gradient(180deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.96) 75%), url(${backgroundUrl})`,
          backgroundAttachment: 'fixed',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <AdminHeader 
          currentPage={currentPage} 
          onNavigate={handleNavigate}
          searchQuery={searchQuery}
          onSearch={setSearchQuery}
        />
        <Home searchQuery={searchQuery} />
      </div>
    </AdminGuard>
  );
}
