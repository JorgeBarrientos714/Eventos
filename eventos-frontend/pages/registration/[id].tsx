import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { Header } from '../../components/Header';
import { RegistroDocenteForm } from '../../components/RegistroDocenteForm';
import { getAllEvents } from '../../lib/events';
import type { Event } from '../../types/event';

export default function RegistrationPage() {
  const router = useRouter();
  const { id } = router.query;
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    async function loadEvent() {
      try {
        const events = await getAllEvents();
        const found = events.find(e => e.id === String(id));
        setEvent(found || null);
      } catch (error) {
        console.error('Error al cargar evento:', error);
        setEvent(null);
      } finally {
        setLoading(false);
      }
    }

    loadEvent();
  }, [id]);

  const handleNavigate = (page: string) => {
    const map: Record<string, string> = {
      home: '/',
      events: '/events',
      'my-registrations': '/my-registrations',
      'cancel-registrations': '/cancel-registrations',
      'cancellation-history': '/cancellation-history',
    };
    router.push(map[page] || '/');
  };

  if (loading) {
    return (
      <main className="min-h-screen">
        <Header currentPage="events" onNavigate={handleNavigate} />
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-[#0d7d6e] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Cargando evento...</p>
          </div>
        </div>
      </main>
    );
  }

  if (!event) {
    return (
      <main className="min-h-screen">
        <Header currentPage="events" onNavigate={handleNavigate} />
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <p className="text-gray-600">El evento no fue encontrado</p>
            <button onClick={() => router.push('/events')} className="mt-4 px-6 py-2 bg-[#0d7d6e] text-white rounded">
              Volver a eventos
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen">
      <Header currentPage="events" onNavigate={handleNavigate} />
      <RegistroDocenteForm
        event={event}
        onBack={() => router.push('/events')}
        onSuccess={() => router.push('/my-registrations')}
      />
    </main>
  );
}
