import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Header } from '../components/Header';
import { CancellationHistory } from '../components/CancellationHistoryPage';
import { MOCK_EVENTS } from '../lib/events';
import { getCancelledRegistrations } from '../lib/registrations';
import type { Registration } from '../types/teacher';

export default function CancellationHistoryPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState<string>(() => {
    const q = router.query.q;
    return typeof q === 'string' ? q : '';
  });
  const [cancelledRegistrations, setCancelledRegistrations] = useState<Registration[]>([]);

  useEffect(() => {
    setCancelledRegistrations(getCancelledRegistrations());
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

  return (
    <main className="min-h-screen">
      <Header currentPage="cancellation-history" onNavigate={handleNavigate} onSearch={onSearch} searchQuery={searchQuery} />
      <CancellationHistory events={MOCK_EVENTS} cancelledRegistrations={cancelledRegistrations} searchQuery={searchQuery} />
    </main>
  );
}
