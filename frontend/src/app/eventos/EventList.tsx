import { Evento } from '../../lib/mockData';
import EventCard from './EventCard';
import { ArrowLeft } from 'lucide-react';

interface EventListProps {
  area: { id: string; nombre: string };
  eventos: Evento[];
  onBack: () => void;
  onRegister: (evento: Evento) => void;
}

export default function EventList({ area, eventos, onBack, onRegister }: EventListProps) {
  return (
    <div className="page-shell">
      <div className="mb-6">
        <button onClick={onBack} className="btn-secondary mb-4 gap-2">
          <ArrowLeft className="w-4 h-4" />
          Volver a áreas
        </button>
        
        <h1 className="text-3xl sm:text-4xl">{area.nombre}</h1>
        <p className="section-subtitle mt-2">
          {eventos.length} {eventos.length === 1 ? 'evento disponible' : 'eventos disponibles'}
        </p>
      </div>

      {eventos.length === 0 ? (
        <div className="panel p-8 sm:p-12 text-center">
          <p className="section-subtitle">No hay eventos disponibles en esta área</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {eventos.map((evento) => (
            <EventCard
              key={evento.id}
              evento={evento}
              onRegister={onRegister}
            />
          ))}
        </div>
      )}
    </div>
  );
}
