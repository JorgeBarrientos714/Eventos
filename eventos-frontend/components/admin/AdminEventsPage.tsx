// Módulo: frontend-admin
// Función: Página de gestión de eventos admin con diseño idéntico a EventsPage
// Relacionados: AdminEventCard, AdminGuard, Sidebar
// Rutas/Endpoints usados: GET /eventos/evento/todos via adminServices
// Notas: Reutiliza diseño exacto de EventsPage con funcionalidades admin
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Filter } from 'lucide-react';
import backgroundImage from '../../assets/Edificio Color Blanco.jpg';
import { AdminGuard } from './AdminGuard';
import { AdminHeader } from './AdminHeader';
import { AdminEventCard } from './AdminEventCard';
import { EventForm, AdminEventFormValues } from './EventForm';
import { RegisterModal } from './RegisterModal';
import { Sidebar } from '../Sidebar';
import { HeroBanner } from '../HeroBanner';
import { adminServices } from '../../lib/admin/services';
import type { AdminEvent } from '../../lib/admin/types';
import type { Event } from '../../types/event';
import { toast } from 'sonner';

export function AdminEventsPage() {
  const router = useRouter();
  const { filter } = router.query;
  const backgroundUrl = 'src' in backgroundImage ? backgroundImage.src : backgroundImage;

  const [currentPage, setCurrentPage] = useState('eventos');
  const [loading, setLoading] = useState(true);
  const [eventos, setEventos] = useState<AdminEvent[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('Todas las áreas');
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<AdminEvent | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [registerState, setRegisterState] = useState<{ isOpen: boolean; evento: AdminEvent | null }>({
    isOpen: false,
    evento: null,
  });

  // Convertir AdminEvent a Event para HeroBanner
  const mapAdminEventToEvent = (adminEvent: AdminEvent): Event => ({
    id: adminEvent.id,
    title: adminEvent.nombre,
    description: adminEvent.descripcion,
    date: adminEvent.fechaInicio,
    time: adminEvent.horaInicio,
    location: adminEvent.municipio,
    category: adminEvent.areaNombre,
    image: adminEvent.imagen || '',
    isIntermediate: false,
    tipoEvento: adminEvent.tipoEvento,
    cuposDisponibles: adminEvent.cuposDisponibles,
    cuposTotales: adminEvent.cuposTotales,
    estado: adminEvent.estado,
  });

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      setLoading(true);
      const eventosResponse = await adminServices.listEventos();
      setEventos(eventosResponse);
    } catch (error) {
      console.error('Error cargando datos:', error);
      toast.error('Error al cargar eventos');
      setEventos([]);
    } finally {
      setLoading(false);
    }
  }

  const handleNavigate = (page: string) => {
    setCurrentPage(page);
    if (page === 'home') {
      router.push('/admin/home');
    } else if (page === 'eventos') {
      router.push('/admin/eventos');
    }
  };

  // Aplicar filtros
  const filteredEventos = eventos.filter((evento) => {
    // Filtro por tipo (eventos/clases)
    if (filter && filter !== 'all') {
      const tipoEvento = (evento.tipoEvento || '').toLowerCase();
      if (filter === 'eventos' && tipoEvento === 'clase') return false;
      if (filter === 'clases' && tipoEvento !== 'clase') return false;
    }

    // Filtro por área
    if (selectedCategory !== 'Todas las áreas') {
      if (evento.areaNombre !== selectedCategory) return false;
    }

    // Filtro por búsqueda (coincidencia en nombre, descripción, área)
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      const matchNombre = evento.nombre?.toLowerCase().includes(query);
      const matchDescripcion = evento.descripcion?.toLowerCase().includes(query);
      const matchArea = evento.areaNombre?.toLowerCase().includes(query);
      const matchRegional = evento.regional?.toLowerCase().includes(query);
      
      if (!matchNombre && !matchDescripcion && !matchArea && !matchRegional) {
        return false;
      }
    }

    return true;
  });

  const handleCreateEvent = () => {
    setEditingEvent(null);
    setIsFormOpen(true);
  };

  const handleEditEvent = (evento: AdminEvent) => {
    setEditingEvent(evento);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingEvent(null);
  };

  const handleFormSubmit = async (values: AdminEventFormValues) => {
    try {
      const loadingToastId = toast.loading(editingEvent ? 'Actualizando evento...' : 'Creando evento...');

      if (editingEvent) {
        await adminServices.updateEvento(editingEvent.id, values);
      } else {
        await adminServices.createEvento(values);
      }

      toast.dismiss(loadingToastId);
      toast.success(editingEvent ? 'Evento actualizado correctamente' : 'Evento creado con éxito');

      await loadData();
      handleCloseForm();
    } catch (error: any) {
      toast.error(error.message || 'Error al procesar el evento');
    }
  };

  const handleViewParticipants = (evento: AdminEvent) => {
    // TODO: Implementar modal de participantes
    toast.info(`Ver participantes de: ${evento.nombre}`);
  };

  const handleRegisterDocente = (evento: AdminEvent) => {
    setRegisterState({ isOpen: true, evento });
  };

  const handleCloseRegister = () => {
    setRegisterState({ isOpen: false, evento: null });
  };

  // Obtener categorías únicas
  const categoriesFromEvents = ['Todas las áreas', ...new Set(eventos.map(e => e.areaNombre))];

  // Si está mostrando el formulario
  if (isFormOpen) {
    return (
      <AdminGuard>
        <div
          className="min-h-screen"
          style={{
            backgroundImage: `linear-gradient(180deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.96) 75%), url(${backgroundUrl})`,
            backgroundAttachment: 'fixed',
            backgroundSize: 'cover',
          }}
        >
          <AdminHeader currentPage={currentPage} onNavigate={handleNavigate} />
          <main className="mx-auto w-full max-w-[1200px] px-4 py-10">
            <div className="mb-8 space-y-2">
              <h2 className="text-2xl font-semibold text-gray-800">
                {editingEvent ? 'Editar evento' : 'Crear nuevo evento'}
              </h2>
              <p className="text-sm text-gray-500">
                {editingEvent ? 'Actualiza la información del evento seleccionado.' : 'Completa los datos para publicar un nuevo evento.'}
              </p>
            </div>
            <div className="rounded-2xl bg-white/95 p-6 shadow-sm ring-1 ring-gray-100/60 backdrop-blur-sm">
              <EventForm
                evento={editingEvent ?? undefined}
                areas={[]}
                departamentos={[]}
                onCancel={handleCloseForm}
                onSubmit={(values) => handleFormSubmit({ ...values, id: editingEvent?.id })}
              />
            </div>
          </main>
        </div>
      </AdminGuard>
    );
  }

  return (
    <AdminGuard>
      <div
        className="min-h-screen"
        style={{
          backgroundImage: `linear-gradient(180deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.96) 75%), url(${backgroundUrl})`,
          backgroundAttachment: 'fixed',
          backgroundSize: 'cover',
        }}
      >
        <AdminHeader 
          currentPage={currentPage} 
          onNavigate={handleNavigate}
          searchQuery={searchQuery}
          onSearch={setSearchQuery}
        />

        {/* Contenido principal - Igual que EventsPage */}
        <div className="flex min-h-[calc(100vh-180px)]">
          <AdminSidebar
            selectedCategory={selectedCategory}
            onSelectCategory={(category) => {
              setSelectedCategory(category);
              setShowMobileSidebar(false);
            }}
            categories={categoriesFromEvents}
            onCreateEvent={handleCreateEvent}
            showMobile={showMobileSidebar}
            onClose={() => setShowMobileSidebar(false)}
          />

          {/* Main content */}
          <main className="flex-1 p-4 md:p-6 md:ml-64">
            {/* Mobile filter button */}
            <div className="max-w-[1200px] mx-auto mb-6 md:hidden">
              <button
                onClick={() => setShowMobileSidebar(true)}
                className="flex items-center gap-2 px-4 py-2 bg-[#0d7d6e] text-white rounded-lg"
              >
                <Filter className="w-5 h-5" />
                <span>Filtros</span>
              </button>
            </div>

            {/* Hero Banner */}
            <div className="max-w-[1200px] mx-auto mb-6 md:mb-8">
              <HeroBanner events={eventos.slice(0, 4).map(mapAdminEventToEvent)} />
            </div>

            {/* Events Grid */}
            <div className="max-w-[1200px] mx-auto">
              {loading ? (
                <div className="flex justify-center items-center py-12">
                  <div className="text-center">
                    <div className="w-16 h-16 border-4 border-[#0d7d6e] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600">Cargando eventos...</p>
                  </div>
                </div>
              ) : filteredEventos.length === 0 ? (
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-12 text-center shadow-sm">
                  <div className="w-16 h-16 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                    </svg>
                  </div>
                  <h3 className="text-xl text-gray-800 mb-2" style={{ fontWeight: 600 }}>
                    No hay eventos disponibles
                  </h3>
                  <p className="text-gray-600">Crea tu primer evento para comenzar</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                  {filteredEventos.map((evento) => (
                    <AdminEventCard
                      key={evento.id}
                      evento={evento}
                      onViewParticipants={handleViewParticipants}
                      onRegister={handleRegisterDocente}
                      onEdit={handleEditEvent}
                    />
                  ))}
                </div>
              )}
            </div>
          </main>
        </div>

        {/* Modal de inscribir docente */}
        {registerState.isOpen && registerState.evento && (
          <RegisterModal
            evento={registerState.evento}
            docentes={[]}
            gruposEtnicos={[]}
            onClose={handleCloseRegister}
            onRegister={async () => {
              toast.success('Docente inscrito correctamente');
              handleCloseRegister();
              await loadData();
              return undefined;
            }}
          />
        )}
      </div>
    </AdminGuard>
  );
}

// Sidebar Admin con botón Crear Evento
function AdminSidebar({
  selectedCategory,
  onSelectCategory,
  categories,
  onCreateEvent,
  showMobile,
  onClose,
}: {
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
  categories: string[];
  onCreateEvent: () => void;
  showMobile: boolean;
  onClose: () => void;
}) {
  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-64 fixed left-0 top-16 h-[calc(100vh-64px)] flex-col bg-white/40 backdrop-blur-sm">
        <div className="p-6 pt-20">
          <button
            onClick={onCreateEvent}
            className="w-full mb-6 px-4 py-2 bg-[#0d7d6e] text-white rounded-lg font-medium hover:bg-[#0a6357] transition-colors flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Crear Evento
          </button>

          <nav className="space-y-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => onSelectCategory(category)}
                className={`block w-full text-left px-3 py-2 rounded-lg transition-colors ${
                  selectedCategory === category
                    ? 'bg-[#0d7d6e]/90 text-white backdrop-blur-sm'
                    : 'text-gray-700 hover:bg-white/60'
                }`}
              >
                {category}
              </button>
            ))}
          </nav>
        </div>
      </aside>

      {/* Mobile Sidebar */}
      {showMobile && (
        <div className="fixed inset-0 z-40 bg-black/50" onClick={onClose}>
          <div className="absolute left-0 top-16 w-64 h-full bg-white p-6 overflow-y-auto">
            <button
              onClick={() => {
                onCreateEvent();
                onClose();
              }}
              className="w-full mb-6 px-4 py-2 bg-[#0d7d6e] text-white rounded-lg font-medium hover:bg-[#0a6357] transition-colors flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Crear Evento
            </button>

            <nav className="space-y-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => {
                    onSelectCategory(category);
                    onClose();
                  }}
                  className={`block w-full text-left px-3 py-2 rounded-lg transition-colors ${
                    selectedCategory === category
                      ? 'bg-[#0d7d6e]/90 text-white backdrop-blur-sm'
                      : 'text-gray-700 hover:bg-white/60'
                  }`}
                >
                  {category}
                </button>
              ))}
            </nav>
          </div>
        </div>
      )}
    </>
  );
}
