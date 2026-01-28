import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Header } from '../components/Header';
import { CancellationHistory } from '../components/CancellationHistoryPage';
import { useAllEvents } from '../lib/events';
import { registroServices } from '../lib/registro/services';
import { docenteAuth } from '../lib/authDocente';
import type { Registration } from '../types/teacher';

export default function CancellationHistoryPage() {
  const router = useRouter();

  const [searchQuery, setSearchQuery] = useState<string>(() => {
    const q = router.query.q;
    return typeof q === 'string' ? q : '';
  });

  const [cancelledRegistrations, setCancelledRegistrations] = useState<Registration[]>([]);
  const { events, isLoading } = useAllEvents();

  useEffect(() => {
    async function loadData() {
      try {
        const me = await docenteAuth.me();
        const canceladas = await registroServices.listarMisCancelaciones();

        const mapped: Registration[] = (canceladas || []).map((r: any) => ({
          id: String(r.idRegistro),
          eventId: String(r.evento?.id ?? ''),
          teacherDni: me?.nIdentificacion || '',
          registeredAt: r.fechaRegistro || new Date().toISOString(),
        }));

        setCancelledRegistrations(mapped);
      } catch (error) {
        console.error('Error al cargar datos:', error);
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
      carnetizacion: '/carnetizacion',
    };

    router.push(map[page] || '/');
  };

  const onSearch = (q: string) => {
    setSearchQuery(q);
    router.replace(
      {
        pathname: router.pathname,
        query: q ? { q } : {},
      },
      undefined,
      { shallow: true }
    );
  };

  /* ===========================
     LOADING
  =========================== */
  if (isLoading) {
    return (
      <main className="min-h-screen">
        <Header
          currentPage="cancellation-history"
          onNavigate={handleNavigate}
          onSearch={onSearch}
          searchQuery={searchQuery}
        />

        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-[#0d7d6e] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Cargando historial...</p>
          </div>
        </div>
      </main>
    );
  }

  /* ===========================
     RENDER PRINCIPAL
  =========================== */
  return (
    <main className="min-h-screen">
      <Header
        currentPage="cancellation-history"
        onNavigate={handleNavigate}
        onSearch={onSearch}
        searchQuery={searchQuery}
      />

      <CancellationHistory
        events={events}
        cancelledRegistrations={cancelledRegistrations}
        searchQuery={searchQuery}
      />
    </main>
  );
}
