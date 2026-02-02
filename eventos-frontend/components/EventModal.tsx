import { X, Calendar, Clock, MapPin } from 'lucide-react';
import type { Event } from '../types/event';
import { useRouter } from 'next/router';

// Módulo: global/public
// Función: Modal de detalle de evento con acciones de registro
// Relacionados: EventCard.tsx, Home.tsx, pages/events.tsx
// Rutas/Endpoints usados: ninguno (acciones provistas por props)
// Notas: No se renombra para conservar imports.
interface EventModalProps {
  event: Event;
  isRegistered: boolean;
  onClose: () => void;
  onRegister: () => void;
  onCancel: () => void;
  onMoreInfo?: () => void;
}

export function EventModal({ event, isRegistered, onClose, onRegister, onCancel, onMoreInfo }: EventModalProps) {
  const router = useRouter();

  return (
    <div className="fixed inset-0 bg-white/30 backdrop-blur-md flex items-center justify-center z-50 p-4">
      <div className="bg-white/95 backdrop-blur-sm rounded-xl md:rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Close button */}
        <div className="sticky top-0 bg-white/95 backdrop-blur-sm z-10 flex justify-end p-3 md:p-4 border-b border-gray-200">
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
            aria-label="Cerrar"
          >
            <X className="w-5 h-5 md:w-6 md:h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 md:p-6">
          {/* Image */}
          <div className="mb-4 md:mb-6 rounded-lg md:rounded-xl overflow-hidden">
            <img
              src={event.image}
              alt={event.title}
              className="w-full h-48 md:h-64 object-cover"
            />
          </div>

          {/* Title */}
          <h2 className="text-xl md:text-2xl mb-3 md:mb-4" style={{ fontWeight: 600 }}>
            {event.title}
          </h2>

          {/* Status badge if registered */}
          {isRegistered && (
            <div className="inline-block px-4 py-1.5 bg-green-100 text-green-700 rounded-full text-sm mb-4" style={{ fontWeight: 600 }}>
              Ya estás inscrito en este evento
            </div>
          )}


          {/* Description */}
          <p className="text-sm md:text-base text-gray-600 mb-4 md:mb-6 leading-relaxed">
            {event.description}
          </p>

          {/* Event details */}
          <div className="space-y-2 md:space-y-3 mb-6 md:mb-8">
            <div className="flex items-start gap-2 md:gap-3">
              <Calendar className="w-4 h-4 md:w-5 md:h-5 text-gray-600 mt-0.5 flex-shrink-0" />
              <span className="text-sm md:text-base text-gray-700">{event.date}</span>
            </div>
            <div className="flex items-start gap-2 md:gap-3">
              <Clock className="w-4 h-4 md:w-5 md:h-5 text-gray-600 mt-0.5 flex-shrink-0" />
              <span className="text-sm md:text-base text-gray-700">{event.time}</span>
            </div>
            <div className="flex items-start gap-2 md:gap-3">
              <MapPin className="w-4 h-4 md:w-5 md:h-5 text-gray-600 mt-0.5 flex-shrink-0" />
              <span className="text-sm md:text-base text-gray-700">{event.location}</span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3">
            {isRegistered ? (
              <>
                <button
                  onClick={onClose}
                  className="w-full px-4 md:px-6 py-2.5 md:py-3 text-sm md:text-base border-2 border-gray-300 text-gray-700 rounded-full hover:bg-gray-50 transition-colors"
                >
                  Cerrar
                </button>
                {onMoreInfo && (
                  <button
                    onClick={onMoreInfo}
                    className="w-full px-4 md:px-6 py-2.5 md:py-3 text-sm md:text-base bg-[#0d7d6e] text-white rounded-full hover:bg-[#0a6357] transition-colors"
                  >
                    Ver mis inscripciones
                  </button>
                )}
              </>
            ) : (
              <>
                <button
                  onClick={onClose}
                  className="w-full px-4 md:px-6 py-2.5 md:py-3 text-sm md:text-base border-2 border-gray-300 text-gray-700 rounded-full hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={() => router.push(`/registration/${event.id}`)}
                  className="w-full px-4 md:px-6 py-2.5 md:py-3 text-sm md:text-base bg-[#0d7d6e] text-white rounded-full hover:bg-[#0a6357] transition-colors"
                >
                  Inscribirse ahora
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
