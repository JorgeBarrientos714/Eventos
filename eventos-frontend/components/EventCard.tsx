// Módulo: global/public
// Función: Tarjeta de evento para listados públicos
// Relacionados: Home.tsx, NetflixCarousel.tsx, pages/events.tsx
// Rutas/Endpoints usados: ninguno (datos por props)
// Notas: No se renombra para conservar imports.

import { Calendar, Clock, MapPin, ImageOff } from 'lucide-react';
import type { Event } from '../types/event';

interface EventCardProps {
  event: Event;
  isRegistered: boolean;
  estado?: string;
  onMoreInfo: () => void;
  onRegister: () => void;
  onCancel: () => void;
}

export function EventCard({
  event,
  isRegistered,
  estado,
  onMoreInfo,
  onRegister,
  onCancel,
}: EventCardProps) {
  const cuposTotales = event.cuposTotales ?? 0;
  const cuposUsados =
    event.cuposUsados ??
    (cuposTotales > 0 && event.cuposDisponibles != null
      ? Math.max(0, cuposTotales - event.cuposDisponibles)
      : 0);

  return (
    <div className="bg-white rounded-lg shadow-sm hover:shadow-2xl transition-all duration-300 ease-out hover:scale-105 h-full flex flex-col cursor-pointer">

      {/* IMAGEN (IMPORTANTE: overflow-visible) */}
      <div className="relative h-40 md:h-48 bg-gray-100 overflow-visible rounded-t-lg">
        {event.image ? (
          <img
            src={event.image}
            alt={event.title}
            className="w-full h-full object-cover rounded-t-lg"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-200 rounded-t-lg">
            <ImageOff className="w-12 h-12 text-gray-400" />
          </div>
        )}

        {/* CÍRCULO DE CUPOS — sobresale del borde */}
        {cuposTotales > 0 && (
          <div className="
            absolute 
            -top-6 
            -left-6 
            w-16 
            h-16 
            rounded-full 
            bg-yellow-400 
            text-black 
            shadow-lg 
            flex 
            flex-col 
            items-center 
            justify-center 
            leading-tight
          ">
            <span className="text-xs font-extrabold">Cupos</span>
            <span className="text-sm font-extrabold">
              {cuposUsados}/{cuposTotales}
            </span>
          </div>
        )}

        {/* Estado */}
        {estado && (
          <div
            className={`absolute top-2 right-2 px-3 py-1 rounded-full text-xs text-white font-semibold ${estado === 'Inscrito'
                ? 'bg-green-600'
                : estado === 'Cancelado'
                  ? 'bg-red-600'
                  : 'bg-gray-600'
              }`}
          >
            {estado}
          </div>
        )}
      </div>

      {/* CONTENIDO */}
      <div className="p-3 md:p-4 flex flex-col flex-1">
        <h3 className="text-base md:text-lg mb-2 md:mb-3 font-semibold">
          {event.title}
        </h3>

        {/* DETALLES */}
        <div className="space-y-1.5 md:space-y-2 mb-3 md:mb-4">
          <div className="flex items-start gap-2 text-xs md:text-sm text-gray-600">
            <Calendar className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <span className="line-clamp-2">{event.date}</span>
          </div>

          <div className="flex items-start gap-2 text-xs md:text-sm text-gray-600">
            <Clock className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <span>{event.time}</span>
          </div>

          <div className="flex items-start gap-2 text-xs md:text-sm text-gray-600">
            <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <span className="line-clamp-2">{event.location}</span>
          </div>

          {event.isIntermediate && (
            <div className="flex items-start gap-2 text-xs md:text-sm text-gray-600">
              <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <span>Hotel intercontinental</span>
            </div>
          )}
        </div>

        {/* ACCIONES */}
        <div className="space-y-2 mt-auto">
          <button
            onClick={onMoreInfo}
            className="w-full px-4 py-2 border-2 border-[#0d7d6e] text-[#0d7d6e] rounded-full hover:bg-[#0d7d6e] hover:text-white transition-colors"
          >
            Más información
          </button>

          {!isRegistered && (
            <button
              onClick={onRegister}
              className="w-full px-4 py-2 bg-[#0d7d6e] text-white rounded-full hover:bg-[#0a6357] transition-colors"
            >
              Inscribirse ahora
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
