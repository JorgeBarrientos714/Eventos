import { useState } from 'react';
import { areas, eventos, Evento } from './lib/mockData';
import AreaSelector from './app/eventos/AreaSelector';
import EventList from './app/eventos/EventList';
import EventListAdmin from './app/eventos/EventListAdmin';
import RegisterModal from './app/eventos/RegisterModal';
import EventForm from './app/eventos/EventForm';
import ReportsView from './app/eventos/ReportsView';
import { FileText, Plus, Edit } from 'lucide-react';

type View = 
  | { type: 'areas' }
  | { type: 'eventos'; areaId: string }
  | { type: 'crear-evento' }
  | { type: 'editar-evento'; evento: Evento }
  | { type: 'lista-eventos-admin' }
  | { type: 'reportes' };

export default function App() {
  const [view, setView] = useState<View>({ type: 'areas' });
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [selectedEvento, setSelectedEvento] = useState<Evento | null>(null);

  const handleSelectArea = (areaId: string) => {
    setView({ type: 'eventos', areaId });
  };

  const handleBackToAreas = () => {
    setView({ type: 'areas' });
  };

  const handleRegister = (evento: Evento) => {
    setSelectedEvento(evento);
    setShowRegisterModal(true);
  };

  const handleRegisterComplete = (dni: string) => {
    console.log('Registro completado para DNI:', dni);
    // Aquí podrías mostrar una notificación de éxito
  };

  const handleCreateEvent = () => {
    setView({ type: 'crear-evento' });
  };

  const handleEditEvent = (evento: Evento) => {
    setView({ type: 'editar-evento', evento });
  };

  const handleViewReports = () => {
    setView({ type: 'reportes' });
  };

  const handleViewEventListAdmin = () => {
    setView({ type: 'lista-eventos-admin' });
  };

  const handleSaveEvent = (evento: Evento) => {
    console.log('Evento guardado:', evento);
    setView({ type: 'lista-eventos-admin' });
  };

  // Filtrar eventos por área
  const eventosPorArea = view.type === 'eventos' 
    ? eventos.filter(e => e.areaId === view.areaId && e.estado !== 'cancelado')
    : [];

  const areaSeleccionada = view.type === 'eventos'
    ? areas.find(a => a.id === view.areaId)
    : null;

  return (
    <div className="min-h-screen">
      {/* Barra de navegación superior */}
      <nav className="bg-brand border-b" style={{ borderColor: 'rgba(230, 242, 240, 0.3)' }}>
        <div className="max-w-[1400px] mx-auto px-2 sm:px-4 lg:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-8">
            </div>
            
            <div className="flex items-center gap-3">

              <button
                onClick={handleCreateEvent}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm bg-white hover:bg-white/90 transition-colors"
                style={{ color: 'var(--color-brand-800)' }}
              >
                <Plus className="w-4 h-4" />
                Crear Evento
              </button>
              <button
                onClick={handleViewEventListAdmin}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm text-white hover:bg-white/10 transition-colors"
                style={{ color: 'var(--color-brand-800)' }}
              >
                <Edit className="w-4 h-4" />
                Editar Eventos
              </button>
               <button
                onClick={handleViewReports}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm text-white hover:bg-white/10 transition-colors"
                style={{ color: 'var(--color-brand-800)' }} >
                <FileText className="w-4 h-4" />
                Reportes
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Contenido principal */}
      <main>
        {view.type === 'areas' && (
          <AreaSelector
            areas={areas}
            onSelectArea={handleSelectArea}
          />
        )}

        {view.type === 'eventos' && areaSeleccionada && (
          <EventList
            area={areaSeleccionada}
            eventos={eventosPorArea}
            onBack={handleBackToAreas}
            onRegister={handleRegister}
          />
        )}

        {view.type === 'lista-eventos-admin' && (
          <EventListAdmin
            eventos={eventos}
            onBack={handleBackToAreas}
            onEdit={handleEditEvent}
          />
        )}

        {view.type === 'crear-evento' && (
          <EventForm
            onBack={() => setView({ type: 'lista-eventos-admin' })}
            onSave={handleSaveEvent}
          />
        )}

        {view.type === 'editar-evento' && (
          <EventForm
            evento={view.evento}
            onBack={() => setView({ type: 'lista-eventos-admin' })}
            onSave={handleSaveEvent}
          />
        )}

        {view.type === 'reportes' && (
          <ReportsView onBack={handleBackToAreas} />
        )}
      </main>

      {/* Modal de registro */}
      {showRegisterModal && selectedEvento && (
        <RegisterModal
          evento={selectedEvento}
          onClose={() => setShowRegisterModal(false)}
          onRegisterComplete={handleRegisterComplete}
        />
      )}
    </div>
  );
}
