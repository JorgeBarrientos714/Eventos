import { Calendar, MapPin, Clock, Ban } from 'lucide-react';
import type { Event } from '../types/event';
import type { Registration } from '../types/teacher';

interface CancellationHistoryProps {
  events: Event[];
  cancelledRegistrations: Registration[];
  searchQuery?: string;
}

export function CancellationHistory({ events, cancelledRegistrations, searchQuery = '' }: CancellationHistoryProps) {
  const cancelledEvents = events.filter(event =>
    cancelledRegistrations.some(reg => reg.eventId === event.id)
  );

  // Filtrar por búsqueda global
  const filteredEvents = cancelledEvents.filter((event) => {
    if (!searchQuery) return true;
    return event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
           event.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
           event.category.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-3xl md:text-4xl text-[#0d7d6e] mb-2" style={{ fontWeight: 700 }}>
        Historial de Cancelaciones
      </h1>
      <p className="text-gray-600 mb-8">
        Aquí puedes ver las inscripciones que has cancelado
      </p>

      {filteredEvents.length === 0 ? (
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-12 text-center shadow-sm">
          <div className="w-16 h-16 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center">
            <Ban className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-xl text-gray-800 mb-2" style={{ fontWeight: 600 }}>
            {searchQuery ? 'No se encontraron resultados' : 'No tienes cancelaciones'}
          </h3>
          <p className="text-gray-600">
            {searchQuery 
              ? `No hay cancelaciones que coincidan con "${searchQuery}"`
              : 'Cuando canceles una inscripción a un evento o clase, aparecerá aquí.'
            }
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredEvents.map((event) => {
            const registration = cancelledRegistrations.find(reg => reg.eventId === event.id);
            return (
              <div
                key={event.id}
                className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-200 hover:shadow-lg transition-all duration-300 ease-out hover:scale-[1.02] cursor-pointer"
              >
                <div className="flex flex-col md:flex-row">
                  {/* Image */}
                  <div className="md:w-48 h-48 md:h-auto flex-shrink-0 relative">
                    <img
                      src={event.image}
                      alt={event.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-3 right-3">
                      <span className="px-3 py-1 bg-red-500 text-white text-xs rounded-full" style={{ fontWeight: 600 }}>
                        Cancelado
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 p-6">
                    <h3 className="text-xl md:text-2xl text-gray-800 mb-3" style={{ fontWeight: 600 }}>
                      {event.title}
                    </h3>

                    <div className="space-y-2 mb-4">
                      <div className="flex items-start gap-2 text-gray-600">
                        <Calendar className="w-5 h-5 flex-shrink-0 mt-0.5" />
                        <span className="text-sm">{event.date}</span>
                      </div>
                      <div className="flex items-start gap-2 text-gray-600">
                        <Clock className="w-5 h-5 flex-shrink-0 mt-0.5" />
                        <span className="text-sm">{event.time}</span>
                      </div>
                      <div className="flex items-start gap-2 text-gray-600">
                        <MapPin className="w-5 h-5 flex-shrink-0 mt-0.5" />
                        <span className="text-sm">{event.location}</span>
                      </div>
                    </div>

                    <div className="text-sm text-gray-500">
                      Cancelado el: {registration ? new Date(registration.registeredAt).toLocaleDateString('es-HN', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      }) : '-'}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
