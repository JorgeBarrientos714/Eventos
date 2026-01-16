import { Evento } from '../../lib/mockData';
import { Calendar, Clock, MapPin, Users } from 'lucide-react';

interface EventCardProps {
  evento: Evento;
  onRegister: (evento: Evento) => void;
}

export default function EventCard({ evento, onRegister }: EventCardProps) {
  const cuposRegistrados = evento.cuposTotales - evento.cuposDisponibles;
  const isPospuesto = evento.estado === 'pospuesto';
  const isCancelado = evento.estado === 'cancelado';
  
  if (isCancelado) {
    return null; // No mostrar eventos cancelados
  }

  return (
    <div className="panel p-6">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h2 className="mb-1">{evento.nombre}</h2>
          <p className="section-subtitle">{evento.descripcion}</p>
        </div>
        {isPospuesto && (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs bg-yellow-100" style={{ color: 'var(--color-ink-700)' }}>
            Pospuesto
          </span>
        )}
      </div>

      <div className="space-y-3 mb-4">
        <div className="flex items-start gap-2">
          <Calendar className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: 'var(--color-brand-600)' }} />
          <div className="text-sm">
            <div>{evento.fechaInicio} - {evento.fechaFin}</div>
          </div>
        </div>

        <div className="flex items-start gap-2">
          <Clock className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: 'var(--color-brand-600)' }} />
          <div className="text-sm">
            {evento.horaInicio} - {evento.horaFin}
          </div>
        </div>

        <div className="flex items-start gap-2">
          <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: 'var(--color-brand-600)' }} />
          <div className="text-sm">
            {evento.direccion}
          </div>
        </div>

        <div className="flex items-start gap-2">
          <div className="text-sm">
            <span>Área: {evento.areaNombre}</span>
          </div>
        </div>

        <div className="flex items-start gap-2">
          <div className="text-sm">
            <span>Días: 📅 {evento.diasSemana.join(', ')}</span>
          </div>
        </div>

        <div className="flex items-start gap-2">
          <Users className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: 'var(--color-brand-600)' }} />
          <div className="text-sm">
            <div>{cuposRegistrados}/{evento.cuposTotales} registrados</div>
            <div className="section-subtitle">{evento.cuposDisponibles} cupos disponibles</div>
          </div>
        </div>
      </div>

      <button
        onClick={() => onRegister(evento)}
        disabled={isPospuesto || evento.cuposDisponibles === 0}
        className="btn-primary w-full"
      >
        {isPospuesto ? 'Evento Pospuesto' : evento.cuposDisponibles === 0 ? 'Sin cupos disponibles' : 'Registrarse'}
      </button>
    </div>
  );
}
