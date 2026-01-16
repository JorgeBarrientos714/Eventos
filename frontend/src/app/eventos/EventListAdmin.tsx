import { Evento, areas } from '../../lib/mockData';
import { ArrowLeft, Edit2, Calendar, MapPin, Users } from 'lucide-react';

interface EventListAdminProps {
  eventos: Evento[];
  onBack: () => void;
  onEdit: (evento: Evento) => void;
}

export default function EventListAdmin({ eventos, onBack, onEdit }: EventListAdminProps) {
  const getAreaNombre = (areaId: string) => {
    return areas.find(a => a.id === areaId)?.nombre || '';
  };

  const getEstadoBadge = (estado: string) => {
    const styles = {
      activo: 'bg-green-100',
      pospuesto: 'bg-yellow-100',
      cancelado: 'bg-red-100'
    };
    
    const colors = {
      activo: '#059669',
      pospuesto: '#d97706',
      cancelado: '#dc2626'
    };

    return (
      <span 
        className={`inline-flex items-center px-2 py-1 rounded text-xs ${styles[estado as keyof typeof styles]}`}
        style={{ color: colors[estado as keyof typeof colors] }}
      >
        {estado.charAt(0).toUpperCase() + estado.slice(1)}
      </span>
    );
  };

  return (
    <div className="page-shell">
      <div className="mb-6">
        <button onClick={onBack} className="btn-secondary mb-4 gap-2">
          <ArrowLeft className="w-4 h-4" />
          Volver
        </button>
        
        <h1>Gestión de Eventos</h1>
        <p className="section-subtitle mt-2">
          {eventos.length} {eventos.length === 1 ? 'evento registrado' : 'eventos registrados'}
        </p>
      </div>

      <div className="space-y-4">
        {eventos.length === 0 ? (
          <div className="panel p-12 text-center">
            <p className="section-subtitle">No hay eventos registrados</p>
          </div>
        ) : (
          eventos.map((evento) => {
            const cuposRegistrados = evento.cuposTotales - evento.cuposDisponibles;
            
            return (
              <div key={evento.id} className="panel p-6">
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <h2>{evento.nombre}</h2>
                          {getEstadoBadge(evento.estado)}
                        </div>
                        <p className="section-subtitle">{evento.descripcion}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                      <div className="space-y-2">
                        <div className="flex items-start gap-2">
                          <Calendar className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: 'var(--color-brand-600)' }} />
                          <div>
                            <div className="section-title">Fechas</div>
                            <div>{evento.fechaInicio} - {evento.fechaFin}</div>
                            <div className="section-subtitle">{evento.horaInicio} - {evento.horaFin}</div>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-start gap-2">
                          <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: 'var(--color-brand-600)' }} />
                          <div>
                            <div className="section-title">Ubicación</div>
                            <div>{evento.municipio}</div>
                            <div className="section-subtitle">{evento.departamento}</div>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-start gap-2">
                          <Users className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: 'var(--color-brand-600)' }} />
                          <div>
                            <div className="section-title">Cupos</div>
                            <div>{cuposRegistrados}/{evento.cuposTotales} registrados</div>
                            <div className="section-subtitle">{evento.cuposDisponibles} disponibles</div>
                          </div>
                        </div>
                      </div>

                      <div>
                        <div className="section-title">Área</div>
                        <div>{getAreaNombre(evento.areaId)}</div>
                        <div className="section-subtitle">{evento.areaNombre}</div>
                      </div>

                      <div>
                        <div className="section-title">Regional</div>
                        <div>{evento.regional}</div>
                      </div>

                      <div>
                        <div className="section-title">Días</div>
                        <div>{evento.diasSemana.join(', ')}</div>
                      </div>
                    </div>
                  </div>

                  <div className="flex md:flex-col gap-2">
                    <button
                      onClick={() => onEdit(evento)}
                      className="btn-primary gap-2 whitespace-nowrap"
                    >
                      <Edit2 className="w-4 h-4" />
                      Editar
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
