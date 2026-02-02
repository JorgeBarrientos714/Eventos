import { useState, useEffect } from 'react';
import { Filter } from 'lucide-react';
import { useRouter } from 'next/router';
import { Sidebar } from './Sidebar';
import { EventCard } from './EventCard';
import { HeroBanner } from './HeroBanner';
import { EventModal } from './EventModal';
import type { Event } from '../types/event';
import type { Registration } from '../types/teacher';
import { useAllEvents } from '../lib/events';

interface EventsProps {
  events?: Event[];
  registrations: Registration[];
  estadosPorEvento?: Record<string, string>;
  onRegisterClick: (event: Event) => void;
  onMoreInfo: (event: Event) => void;
  searchQuery?: string;
  onSearch?: (query: string) => void;
}

export function Events({ events: eventsProp, registrations, estadosPorEvento = {}, onRegisterClick, onMoreInfo, searchQuery = '' }: EventsProps) {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState<string>('Todas las áreas');
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);
  const [filterType, setFilterType] = useState<'all' | 'eventos' | 'clases'>('all');
  
  // Usar SWR para cachear eventos
  const { events, isLoading } = useAllEvents();

  // Detectar filtro de la URL
  useEffect(() => {
    if (router.query.filter) {
      const filter = router.query.filter as string;
      if (filter === 'eventos' || filter === 'clases') {
        setFilterType(filter);
      }
    }
  }, [router.query.filter]);

  // Filtrar eventos por categoría, búsqueda y tipo
  const filteredEvents = events.filter((event) => {
    // Aplicar filtro de tipo (eventos/clases)
    const normalizeTipo = (tipo?: string) => (tipo ?? '').toString().toLowerCase();
    const tipoEvento = normalizeTipo(event.tipoEvento);
    
    if (filterType === 'eventos' && tipoEvento === 'clase') return false;
    if (filterType === 'clases' && tipoEvento !== 'clase') return false;

    // Mostrar todos los estados cuando la categoría seleccionada es "Todas las áreas"
    // En otras categorías, opcionalmente se pueden ocultar cancelados si se requiere.
    const isCanceled = (event.estado || '').toLowerCase() === 'cancelado';
    if (selectedCategory !== 'Todas las áreas' && isCanceled) return false;
    
    const eventCategory = (event.category || '').trim().toLowerCase();
    const selectedCat = selectedCategory.trim().toLowerCase();
    const matchesCategory = selectedCat === 'todas las áreas' || eventCategory === selectedCat;
    
    const matchesSearch = !searchQuery ||
      event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const isEventRegistered = (eventId: string) => {
    return registrations.some(reg => reg.eventId === eventId);
  };

  return (
    <>
      <div className="flex min-h-[calc(100vh-180px)]">
        <Sidebar
          selectedCategory={selectedCategory}
          onSelectCategory={(category) => {
            setSelectedCategory(category);
            setShowMobileSidebar(false);
          }}
          showMobile={showMobileSidebar}
          onClose={() => setShowMobileSidebar(false)}
        />

        {/* Main content con margin-left para compensar el sidebar fijo en desktop */}
        <main className="flex-1 p-4 md:p-6 md:ml-64">
          {/* Mobile filter button */}
          <div className="max-w-[1200px] mx-auto mb-6 md:hidden">
            <button
              onClick={() => setShowMobileSidebar(true)}
              className="flex items-center gap-2 px-4 py-2 bg-[#0d7d6e] text-white rounded-lg"
            >
              <Filter className="w-5 h-5" />
              <span>Filtros</span>
            </button>
          </div>

          {/* Hero Banner */}
          <div className="max-w-[1200px] mx-auto mb-6 md:mb-8">
            <HeroBanner events={events.slice(0, 4)} />
          </div>

          {/* Events Grid */}
          <div className="max-w-[1200px] mx-auto">
            {isLoading ? (
              <div className="flex justify-center items-center py-12">
                <div className="text-center">
                  <div className="w-16 h-16 border-4 border-[#0d7d6e] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-gray-600">Cargando eventos...</p>
                </div>
              </div>
            ) : filteredEvents.length === 0 ? (
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-12 text-center shadow-sm">
                <div className="w-16 h-16 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                  </svg>
                </div>
                <h3 className="text-xl text-gray-800 mb-2" style={{ fontWeight: 600 }}>
                  No hay eventos disponibles
                </h3>
                <p className="text-gray-600">
                  {searchQuery ? `No se encontraron eventos que coincidan con "${searchQuery}"` : 'Aún no hay eventos publicados en esta categoría'}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                {filteredEvents.map((event) => (
                  <EventCard
                    key={event.id}
                    event={event}
                    isRegistered={isEventRegistered(event.id)}
                    estado={estadosPorEvento[event.id] || event.estado}
                    onMoreInfo={() => setSelectedEvent(event)}
                    onRegister={() => onRegisterClick(event)}
                    onCancel={() => { }}
                  />
                ))}
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Event Modal */}
      {selectedEvent && (
        <EventModal
          event={selectedEvent}
          isRegistered={isEventRegistered(selectedEvent.id)}
          onClose={() => setSelectedEvent(null)}
          onRegister={() => {
            onRegisterClick(selectedEvent);
            setSelectedEvent(null);
          }}
          onCancel={() => { }}
          onMoreInfo={() => {
            onMoreInfo(selectedEvent);
            setSelectedEvent(null);
          }}
        />
      )}
    </>
  );
}
