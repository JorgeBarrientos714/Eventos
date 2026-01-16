import { useState } from 'react';
import { Filter } from 'lucide-react';
import { Sidebar } from './Sidebar';
import { EventCard } from './EventCard';
import { HeroBanner } from './HeroBanner';
import { EventModal } from './EventModal';
import type { Event } from '../types/event';
import type { Registration } from '../types/teacher';

interface EventsProps {
  events: Event[];
  registrations: Registration[];
  onRegisterClick: (event: Event) => void;
  onMoreInfo: (event: Event) => void;
  searchQuery?: string;
  onSearch?: (query: string) => void;
}

export function Events({ events, registrations, onRegisterClick, onMoreInfo, searchQuery = '' }: EventsProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('Todas las áreas');
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);

  // Filtrar eventos por categoría y búsqueda global
  const filteredEvents = events.filter((event) => {
    const matchesCategory = selectedCategory === 'Todas las áreas' || event.category === selectedCategory;
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
              {filteredEvents.map((event) => (
                <EventCard
                  key={event.id}
                  event={event}
                  isRegistered={isEventRegistered(event.id)}
                  onMoreInfo={() => setSelectedEvent(event)}
                  onRegister={() => onRegisterClick(event)}
                  onCancel={() => {}}
                />
              ))}
            </div>
            
            {filteredEvents.length === 0 && (
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-12 text-center shadow-sm">
                <div className="w-16 h-16 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <h3 className="text-xl text-gray-800 mb-2" style={{ fontWeight: 600 }}>
                  No se encontraron resultados
                </h3>
                <p className="text-gray-600">
                  {searchQuery 
                    ? `No hay eventos o clases que coincidan con "${searchQuery}"`
                    : 'No hay eventos disponibles en esta área'
                  }
                </p>
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
          onCancel={() => {}}
          onMoreInfo={() => {
            onMoreInfo(selectedEvent);
            setSelectedEvent(null);
          }}
        />
      )}
    </>
  );
}
