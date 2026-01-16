import { Area } from '../../lib/mockData';

interface AreaSelectorProps {
  areas: Area[];
  onSelectArea: (areaId: string) => void;
}

export default function AreaSelector({ areas, onSelectArea }: AreaSelectorProps) {
  return (
    <div className="page-shell">
      <div className="mb-8 text-center">
        <h1 className="text-3xl sm:text-4xl">Sistema de Gestión de Eventos</h1>
        <p className="section-subtitle mt-2">Selecciona un área para ver los eventos disponibles</p>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {areas.map((area) => (
          <div key={area.id} className="panel overflow-hidden">
            <div className="aspect-video w-full overflow-hidden bg-gray-100">
              <img
                src={area.imagen}
                alt={area.nombre}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-6">
              <h2 className="mb-4">{area.nombre}</h2>
              <button
                onClick={() => onSelectArea(area.id)}
                className="btn-primary w-full"
              >
                Acceder
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
