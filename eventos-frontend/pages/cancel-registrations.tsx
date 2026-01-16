import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Header } from '../components/Header';
import { CancelRegistrations } from '../components/CancelRegistrationsPage';
import { MOCK_EVENTS } from '../lib/events';
import { getRegistrations, removeRegistration } from '../lib/registrations';
import type { Registration } from '../types/teacher';

export default function CancelRegistrationsPage() {
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

  const onCancel = (eventId: string) => {
    removeRegistration(eventId);
    setRegistrations(getRegistrations());
  };

  return (
    <main className="min-h-screen">
      <Header currentPage="cancel-registrations" onNavigate={handleNavigate} onSearch={onSearch} searchQuery={searchQuery} />
      <CancelRegistrations events={MOCK_EVENTS} registrations={registrations} onCancel={onCancel} searchQuery={searchQuery} />
    </main>
  );
}
