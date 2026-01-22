import { useRouter } from 'next/router';
import { useMemo, useState } from 'react';
import { Header } from '../components/Header';
import { Home as HomePage } from '../components/Home';

export default function Home() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState<string>(() => {
    const q = router.query.q;
    return typeof q === 'string' ? q : '';
  });

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
      <Header currentPage="home" onNavigate={handleNavigate} onSearch={onSearch} searchQuery={searchQuery} />
      <HomePage onNavigate={handleNavigate} searchQuery={searchQuery} />
    </main>
  );
}
