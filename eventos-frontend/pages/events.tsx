import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import { Header } from '../components/Header';
import { Events } from '../components/EventsPage';
import { MOCK_EVENTS } from '../lib/events';
import { getRegistrations } from '../lib/registrations';
import type { Registration } from '../types/teacher';

export default function EventsPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState<string>(() => {
    const q = router.query.q;
    return typeof q === 'string' ? q : '';
  });
  const [registrations, setRegistrations] = useState<Registration[]>([]);

  useEffect(() => {
    setRegistrations(getRegistrations());
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
        events={MOCK_EVENTS}
        registrations={registrations}
        onRegisterClick={onRegisterClick as any}
        onMoreInfo={onMoreInfo as any}
        searchQuery={searchQuery}
      />
    </main>
  );
}
