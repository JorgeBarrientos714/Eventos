import { useRouter } from 'next/router';
import { useEffect, useMemo } from 'react';
import { Header } from '../../components/Header';
import { Registration } from '../../components/RegistrationPage';
import { MOCK_EVENTS } from '../../lib/events';
import { addRegistration } from '../../lib/registrations';

export default function RegistrationPage() {
  const router = useRouter();
  const { id } = router.query;

  const event = useMemo(() => MOCK_EVENTS.find(e => e.id === id), [id]);

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

  if (!event) return null;

  return (
    <main className="min-h-screen">
      <Header currentPage="events" onNavigate={handleNavigate} />
      <Registration
        event={event}
        onBack={() => router.push('/events')}
        onConfirm={(dni) => {
          addRegistration(event.id, dni);
        }}
      />
    </main>
  );
}
