import { useState } from 'react';
import { Calendar, MapPin, Clock, AlertTriangle } from 'lucide-react';
import type { Event } from '../types/event';
import type { Registration } from '../types/teacher';

interface CancelRegistrationsProps {
  events: Event[];
  registrations: Registration[];
  onCancel: (eventId: string) => void;
  searchQuery?: string;
}

export function CancelRegistrations({ events, registrations, onCancel, searchQuery = '' }: CancelRegistrationsProps) {
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  const registeredEvents = events.filter(event =>
    registrations.some(reg => reg.eventId === event.id)
  );

  // Filtrar por búsqueda global
  const filteredEvents = registeredEvents.filter((event) => {
    if (!searchQuery) return true;
    return event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
           event.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
           event.category.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const handleCancelClick = (event: Event) => {
    setSelectedEvent(event);
    setShowConfirmDialog(true);
  };

  const handleConfirmCancel = () => {
    if (selectedEvent) {
      onCancel(selectedEvent.id);
      setShowConfirmDialog(false);
      setSelectedEvent(null);
    }
  };

  const handleCancelDialog = () => {
    setShowConfirmDialog(false);
    setSelectedEvent(null);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-3xl md:text-4xl text-[#0d7d6e] mb-8" style={{ fontWeight: 700 }}>
        Cancelar Inscripciones
      </h1>

      {filteredEvents.length === 0 ? (
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-12 text-center shadow-sm">
          <div className="w-16 h-16 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <h3 className="text-xl text-gray-800 mb-2" style={{ fontWeight: 600 }}>
            {searchQuery ? 'No se encontraron resultados' : 'No tienes inscripciones'}
          </h3>
          <p className="text-gray-600">
            {searchQuery 
              ? `No hay inscripciones que coincidan con "${searchQuery}"`
              : 'No hay eventos o clases inscritos disponibles para cancelar'
            }
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredEvents.map((event) => {
            const registration = registrations.find(reg => reg.eventId === event.id);
            return (
              <div key={event.id} className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 ease-out hover:scale-105 cursor-pointer">
                <img
                  src={event.image}
                  alt={event.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <div className="inline-block px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm mb-3" style={{ fontWeight: 600 }}>
                    Inscrito
                  </div>
                  <h3 className="text-xl text-gray-800 mb-2" style={{ fontWeight: 700 }}>
                    {event.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {event.description}
                  </p>
                  <div className="space-y-1 text-sm text-gray-700 mb-4">
                    <p><Calendar className="inline-block w-4 h-4 mr-1" /> {event.date}</p>
                    <p><Clock className="inline-block w-4 h-4 mr-1" /> {event.time}</p>
                    <p><MapPin className="inline-block w-4 h-4 mr-1" /> {event.location}</p>
                  </div>
                  {registration && (
                    <p className="text-xs text-gray-500 mb-4">
                      Inscrito el: {new Date(registration.registeredAt).toLocaleDateString('es-HN', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric'
                      })}
                    </p>
                  )}
                  <button
                    onClick={() => handleCancelClick(event)}
                    className="w-full px-4 py-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors"
                    style={{ fontWeight: 600 }}
                  >
                    Cancelar Inscripción
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Confirmation Dialog */}
      {showConfirmDialog && selectedEvent && (
        <div className="fixed inset-0 bg-white/30 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-6 md:p-8 max-w-md w-full shadow-2xl">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center">
                <AlertTriangle className="w-8 h-8 text-orange-600" />
              </div>
            </div>
            
            <h3 className="text-2xl text-gray-800 mb-4 text-center" style={{ fontWeight: 700 }}>
              Confirmar Cancelación
            </h3>
            
            <p className="text-gray-600 mb-2 text-center">
              ¿Estás seguro de que deseas cancelar tu inscripción al evento:
            </p>
            
            <p className="text-lg text-gray-800 mb-6 text-center" style={{ fontWeight: 600 }}>
              {selectedEvent.title}
            </p>
            
            <p className="text-sm text-gray-500 mb-6 text-center">
              Esta acción no se puede deshacer
            </p>
            
            <div className="flex gap-3">
              <button
                onClick={handleCancelDialog}
                className="flex-1 px-6 py-2.5 bg-gray-200 text-gray-700 rounded-full hover:bg-gray-300 transition-colors"
                style={{ fontWeight: 600 }}
              >
                No, mantener
              </button>
              <button
                onClick={handleConfirmCancel}
                className="flex-1 px-6 py-2.5 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors"
                style={{ fontWeight: 600 }}
              >
                Sí, cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
