// Módulo: frontend-admin
// Función: Tarjeta de evento con botones administrativos (Ver Participantes, Inscribir, Editar)
// Relacionados: AdminEventsPage, AdminEventsDashboard
// Rutas/Endpoints usados: ninguno directo
// Notas: Reutiliza el diseño de EventCard pero con botones admin
import { Users, Edit } from 'lucide-react';
import type { AdminEvent } from '../../lib/admin/types';

interface AdminEventCardProps {
  evento: AdminEvent;
  onViewParticipants: (evento: AdminEvent) => void;
  onRegister: (evento: AdminEvent) => void;
  onEdit: (evento: AdminEvent) => void;
}

export function AdminEventCard({
  evento,
  onViewParticipants,
  onRegister,
  onEdit,
}: AdminEventCardProps) {
  const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-300 ease-out hover:scale-105 h-full flex flex-col cursor-default">
      {/* Imagen */}
      <div className="relative h-40 md:h-48 overflow-hidden bg-gray-100">
        {evento.imagen ? (
          <img 
            src={evento.imagen} 
            alt={evento.nombre} 
            className="w-full h-full object-cover"
            onError={(e) => {
              // Si la imagen no carga, mostrar fondo
              (e.target as HTMLImageElement).style.display = 'none';
            }}
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-[#0d7d6e]/10 to-[#0d7d6e]/5 flex items-center justify-center text-gray-400">
            Sin imagen
          </div>
        )}
      </div>

      {/* Contenido */}
      <div className="p-3 md:p-4 flex flex-col flex-1">
        <h3 className="text-base md:text-lg mb-2 md:mb-3 font-semibold text-gray-800 line-clamp-2">
          {evento.nombre}
        </h3>

        <div className="space-y-1.5 md:space-y-2 mb-3 md:mb-4">
          {/* Fecha */}
          <div className="flex items-start gap-2 text-xs md:text-sm text-gray-600">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-3.5 h-3.5 md:w-4 md:h-4 mt-0.5 flex-shrink-0"
            >
              <path d="M8 2v4" />
              <path d="M16 2v4" />
              <rect width="18" height="18" x="3" y="4" rx="2" />
              <path d="M3 10h18" />
            </svg>
            <span className="line-clamp-2">{formatDate(evento.fechaInicio)}</span>
          </div>

          {/* Hora */}
          <div className="flex items-start gap-2 text-xs md:text-sm text-gray-600">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-3.5 h-3.5 md:w-4 md:h-4 mt-0.5 flex-shrink-0"
            >
              <path d="M12 6v6l4 2" />
              <circle cx="12" cy="12" r="10" />
            </svg>
            <span>
              {evento.horaInicio} - {evento.horaFin}
            </span>
          </div>

          {/* Ubicación */}
          <div className="flex items-start gap-2 text-xs md:text-sm text-gray-600">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-3.5 h-3.5 md:w-4 md:h-4 mt-0.5 flex-shrink-0"
            >
              <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0" />
              <circle cx="12" cy="10" r="3" />
            </svg>
            <span className="line-clamp-2">
              {evento.departamento}, {evento.municipio}
            </span>
          </div>

          {/* Cupos */}
          <div className="flex items-start gap-2 text-xs md:text-sm text-gray-600">
            <Users className="w-3.5 h-3.5 md:w-4 md:h-4 mt-0.5 flex-shrink-0" />
            <span>
              {evento.cuposDisponibles} / {evento.cuposTotales} cupos disponibles
            </span>
          </div>

          {/* Estado */}
          <div className="flex items-center gap-2 text-xs md:text-sm">
            <span
              className={`px-2 py-1 rounded-full font-medium ${
                evento.estado === 'activo'
                  ? 'bg-green-100 text-green-700'
                  : evento.estado === 'pospuesto'
                    ? 'bg-yellow-100 text-yellow-700'
                    : 'bg-red-100 text-red-700'
              }`}
            >
              {evento.estado}
            </span>
          </div>
        </div>

        {/* Botones Admin */}
        <div className="space-y-2 mt-auto">
          <button
            onClick={() => onViewParticipants(evento)}
            className="w-full px-3 md:px-4 py-1.5 md:py-2 text-sm md:text-base border-2 border-[#0d7d6e] text-[#0d7d6e] rounded-full hover:bg-[#0d7d6e] hover:text-white transition-colors flex items-center justify-center gap-2"
          >
            <Users className="w-4 h-4" />
            Ver Participantes
          </button>
          <button
            onClick={() => onRegister(evento)}
            className="w-full px-3 md:px-4 py-1.5 md:py-2 text-sm md:text-base border-2 border-[#0d7d6e] text-[#0d7d6e] rounded-full hover:bg-[#0d7d6e] hover:text-white transition-colors"
          >
            Inscribir docente
          </button>
          <button
            onClick={() => onEdit(evento)}
            className="w-full px-3 md:px-4 py-1.5 md:py-2 text-sm md:text-base bg-[#0d7d6e] text-white rounded-full hover:bg-[#0a6357] transition-colors flex items-center justify-center gap-2"
          >
            <Edit className="w-4 h-4" />
            Editar Evento
          </button>
        </div>
      </div>
    </div>
  );
}
