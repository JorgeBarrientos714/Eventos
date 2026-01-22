import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import { Header } from '../components/Header';
import { Events } from '../components/EventsPage';
import { registroServices } from '../lib/registro/services';
import { docenteAuth } from '../lib/authDocente';
import type { Registration } from '../types/teacher';

export default function EventsPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState<string>(() => {
    const q = router.query.q;
    return typeof q === 'string' ? q : '';
  });
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [estadosPorEvento, setEstadosPorEvento] = useState<Record<string, string>>({});

  useEffect(() => {
    async function loadData() {
      const token = docenteAuth.getToken();
      if (token) {
        try {
          // Cargar mis inscripciones (incluyendo canceladas)
          const mis = await registroServices.listarMisInscripciones();
          const activas = (mis || []).filter((r: any) => (r?.estado || '').toLowerCase() !== 'cancelado');
          const mapped: Registration[] = activas.map((r: any) => ({
            id: String(r.idRegistro),
            eventId: String(r.evento?.id ?? ''),
            teacherDni: '',
            registeredAt: r.fechaRegistro || new Date().toISOString(),
          }));
          setRegistrations(mapped);
          
          // Mapear estados por evento
          const estados: Record<string, string> = {};
          for (const r of mis || []) {
            estados[r.evento?.id] = r.estado;
          }
          setEstadosPorEvento(estados);
        } catch (e) {
          console.error('Error cargando mis inscripciones:', e);
        }
      }
    }
    loadData();
  }, []);

  const handleNavigate = (page: string) => {
    const map: Record<string, string> = {
      home: '/',
      events: '/events',
      'my-registrations': '/my-registrations',
      'cancel-registrations': '/cancel-registrations',
      'cancellation-history': '/cancellation-history',
      'carnetizacion': '/carnetizacion',
    };
    router.push(map[page] || '/');
  };

  const onSearch = (q: string) => {
    setSearchQuery(q);
    const url = { pathname: router.pathname, query: q ? { q } : {} };
    router.replace(url, undefined, { shallow: true });
  };

  const onRegisterClick = (event: { id: string }) => {
    router.push(`/registration/${event.id}`);
  };

  const onMoreInfo = () => {};

  return (
    <main className="min-h-screen">
      <Header currentPage="events" onNavigate={handleNavigate} onSearch={onSearch} searchQuery={searchQuery} />
      <Events
        registrations={registrations}
        estadosPorEvento={estadosPorEvento}
        onRegisterClick={onRegisterClick as any}
        onMoreInfo={onMoreInfo as any}
        searchQuery={searchQuery}
      />
    </main>
  );
}
