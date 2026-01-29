// Módulo: global/public
// Función: Composición de la página Home pública (carruseles y listados) - ahora con datos reales
// Relacionados: HeroBanner, NetflixCarousel, EventCard, pages/index.tsx
// Rutas/Endpoints usados: GET /eventos/evento/todos via lib/events
// Notas: No se renombra para conservar imports.
import { NetflixCarousel } from './NetflixCarousel';
import { EventModal } from './EventModal';
import { ImageOff } from 'lucide-react';
import { useEffect, useState } from 'react';
import type { Event } from '../types/event';
import { getAllEvents } from '../lib/events';
import { docenteAuth } from '../lib/authDocente';
import FondoPanel from '../assets/Fondo Panel.jpg';
import PersonasPanel from '../assets/Personas panel.png';
import BannerInprema from '../assets/Banner (1).svg';

interface HomeProps {
  onNavigate?: (page: string) => void;
  searchQuery?: string;
  events?: Event[];
}

// Mock data para Avisos
const announcements = [
  {
    id: 1,
    title: 'Título del aviso',
    description: 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat.',
    image: 'https://images.unsplash.com/photo-1739285452629-2672b13fa42d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
  },
  {
    id: 2,
    title: 'Título del aviso',
    description: 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat.',
    image: 'https://images.unsplash.com/photo-1582500347014-3fbe150ed85a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
  },
];

export function Home({ onNavigate, searchQuery = '', events = [] }: HomeProps) {
  const [upcomingEvents, setUpcomingEvents] = useState<Array<{ id: string | number; title: string; area: string; image: string }>>([]);
  const [classesData, setClassesData] = useState<Array<{ id: string | number; title: string; area: string; image: string }>>([]);
  const [loading, setLoading] = useState(true);
  const [allEventsData, setAllEventsData] = useState<Event[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [docenteNombre, setDocenteNombre] = useState<string>('');
  const [dniInput, setDniInput] = useState<string>('');

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const [eventos, me] = await Promise.all([
          getAllEvents(),
          docenteAuth.me().catch(() => null),
        ]);
        setAllEventsData(eventos);
        const visibles = eventos.filter(e => (e.estado || '').toLowerCase() !== 'cancelado');
        const normalizeTipo = (tipo?: string) => (tipo ?? '').toString().toLowerCase();
        const mappedEventos = visibles
          .filter((e) => normalizeTipo(e.tipoEvento) !== 'clase')
          .map((e) => ({
            id: e.id,
            title: e.title,
            area: e.category,
            image: e.image,
          }));
        const mappedClases = visibles
          .filter((e) => normalizeTipo(e.tipoEvento) === 'clase')
          .map((e) => ({
            id: e.id,
            title: e.title,
            area: e.category,
            image: e.image,
          }));
        setUpcomingEvents(mappedEventos);
        setClassesData(mappedClases);
        if (me?.nombreCompleto) setDocenteNombre(me.nombreCompleto);
      } catch (error) {
        console.error('Error al cargar eventos:', error);
        setUpcomingEvents([]);
        setAllEventsData([]);
        setClassesData([]);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  // Filtrar eventos/clases por búsqueda
  const filteredUpcomingEvents = upcomingEvents.filter((event) => {
    if (!searchQuery) return true;
    return event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.area.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const filteredClasses = classesData.filter((classItem) => {
    if (!searchQuery) return true;
    return classItem.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      classItem.area.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const hasResults = filteredUpcomingEvents.length > 0 || filteredClasses.length > 0;

  return (



    <div className="pb-0 pt-0">
      <div className="flex justify-center">
        <div className="relative w-full max-w-[1400px]">
          {/* Imagen */}
          <img
            src={BannerInprema.src}
            alt="Portal INPREMA"
            className="block w-full rounded-2xl object-cover"
          />

          {/* Overlay */}
          <div className="
      absolute inset-0
      grid grid-cols-1 md:grid-cols-2
      rounded-2xl overflow-hidden
    ">

            {/* Columna izquierda */}
            <div
              className="
          flex flex-col justify-center
          px-6 py-6
          md:px-16 md:py-0
          text-center md:text-left
        "
            >
              {/* TÍTULO 1 */}
              <p
                className="text-white italic font-medium leading-tight mb-1"
                style={{
                  fontSize: 'clamp(1.1rem, 3vw, 2.85rem)'
                }}
              >
                Bienvenido al
              </p>

              {/* TÍTULO 2 */}
              <p
                className="text-white font-extrabold leading-tight tracking-tight mb-3"
                style={{
                  fontSize: 'clamp(1.3rem, 4vw, 3rem)'
                }}
              >
                Portal INPREMA
              </p>

              {/* DESCRIPCIÓN */}
              <p
                className="text-white font-medium max-w-[42ch] mx-auto md:mx-0"
                style={{
                  fontSize: 'clamp(0.85rem, 2.5vw, 1.125rem)',
                  lineHeight: '1.35'
                }}
              >
                Entérate e inscríbete en los siguientes eventos hechos especialmente para ti.
              </p>
            </div>

            {/* Columna derecha solo en desktop */}
            <div className="hidden md:block" />
          </div>
        </div>
      </div>




      {/* Hero Banner */}
      <section
        className="max-w-[1200px] mx-auto px-4 md:px-6 lg:px-8 pb-8"
        aria-label="Banner de bienvenida al portal"
      >
      </section>




      {/* Mensaje de no resultados */}
      {
        searchQuery && !hasResults && (
          <div className="max-w-[1200px] mx-auto px-4 md:px-6 lg:px-8 py-12">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-12 text-center shadow-sm">
              <div className="w-16 h-16 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h3 className="text-xl text-gray-800 mb-2" style={{ fontWeight: 600 }}>
                No se encontraron resultados
              </h3>
              <p className="text-gray-600">
                No hay eventos o clases que coincidan con "{searchQuery}"
              </p>
            </div>
          </div>
        )
      }

      {/* ================= PRÓXIMOS EVENTOS ================= */}
      <section className="py-8">
        {/* TÍTULO */}
        <h2
          className="max-w-[1200px] mx-auto px-4 md:px-6 lg:px-8
               text-3xl md:text-[54px] text-[#636363] mb-6 font-bold"
        >
          Próximos eventos
        </h2>

        {/* CONTENEDOR GENERAL */}
        <div className="relative w-full overflow-hidden">
          {/* FONDO TRANSPARENTE | VERDE */}
          <div
            className="absolute inset-0 flex pointer-events-none"
            style={{ margin: '0rem 0rem 0rem 0rem' }}
          >
            {/* IZQUIERDA TRANSPARENTE */}
            <div className="w-1/2 bg-transparent" />

            {/* DERECHA VERDE CON DEGRADADO + BORDES */}
            <div
              className="
    w-1/2
    bg-[#0d7665]
    rounded-l-[24px]
  "
            />
          </div>

          {/* CONTENIDO (CARRUSEL) */}
          <div
            className="relative z-10"
            style={{
              padding: '2rem 3rem 2rem 14rem', // 👈 EXACTO como pediste
            }}
          >
            <NetflixCarousel>
              {filteredUpcomingEvents.map((event) => (
                <div
                  key={event.id}
                  className="
              bg-white rounded-[15px] shadow-lg overflow-hidden
              min-w-[280px] max-w-[280px]
              transition-transform duration-300
              hover:scale-105 hover:shadow-2xl
              cursor-pointer
            "
                >
                  {/* IMAGEN */}
                  <div className="h-[220px] overflow-hidden bg-gray-100">
                    {event.image ? (
                      <img
                        src={event.image}
                        alt={event.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-200">
                        <ImageOff className="w-12 h-12 text-gray-400" />
                      </div>
                    )}
                  </div>

                  {/* TEXTO */}
                  <div className="p-4 text-center">
                    <p className="text-[#0d7d6e] text-xs font-semibold mb-1">
                      {event.area}
                    </p>

                    <h3 className="text-[#636363] text-[18px] font-bold mb-3">
                      {event.title}
                    </h3>

                    <button
                      onClick={() => {
                        const fullEvent = allEventsData.find(
                          (e) => String(e.id) === String(event.id)
                        );
                        if (fullEvent) setSelectedEvent(fullEvent);
                      }}
                      className="
                  border border-[#0e9c85] text-[#0e9c85]
                  px-6 py-1.5 rounded-[27px] text-[16px] font-bold
                  hover:bg-[#0e9c85] hover:text-white
                  transition-colors
                "
                    >
                      Más información
                    </button>
                  </div>
                </div>
              ))}
            </NetflixCarousel>
          </div>
        </div>
      </section>





      {/* ================= CLASES ================= */}
      <section className="py-8">
        {/* TÍTULO */}
        <h2
          className="
      max-w-[1200px] mx-auto px-4 md:px-6 lg:px-8
      text-3xl md:text-[54px] text-[#636363] mb-6 font-bold
    "
        >
          Clases
        </h2>

        {/* CONTENEDOR GENERAL */}
        <div className="relative w-full overflow-hidden">
          {/* FONDO TRANSPARENTE | VERDE */}
          <div
            className="absolute inset-0 flex pointer-events-none"
          >
            {/* IZQUIERDA TRANSPARENTE */}
            <div className="w-1/2 bg-transparent" />

            {/* DERECHA VERDE */}
            <div
              className="
                w-1/2
                bg-[#0d7665]
                rounded-l-[24px]
              "
            />
          </div>

          {/* CONTENIDO (CARRUSEL) */}
          <div
            className="relative z-10"
            style={{ padding: '2rem 3rem 2rem 14rem' }}
          >
            <NetflixCarousel itemsPerView={{ mobile: 1, tablet: 2, desktop: 2 }}>
              {filteredClasses.map((classItem) => (
                <div
                  key={classItem.id}
                  className="
              bg-white rounded-[15px] shadow-lg overflow-hidden
              min-w-[280px] max-w-[280px]
              transition-transform duration-300
              hover:scale-105 hover:shadow-2xl
              cursor-pointer
            "
                >
                  {/* IMAGEN */}
                  <div className="h-[220px] overflow-hidden bg-gray-100">
                    {classItem.image ? (
                      <img
                        src={classItem.image}
                        alt={classItem.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-200">
                        <ImageOff className="w-12 h-12 text-gray-400" />
                      </div>
                    )}
                  </div>

                  {/* TEXTO */}
                  <div className="p-4 text-center">
                    <p className="text-[#0d7d6e] text-xs font-semibold mb-1">
                      {classItem.area}
                    </p>

                    <h3 className="text-[#636363] text-[18px] font-bold mb-3">
                      {classItem.title}
                    </h3>

                    <button
                      onClick={() => {
                        const fullEvent = allEventsData.find(
                          (e) => String(e.id) === String(classItem.id)
                        );
                        if (fullEvent) setSelectedEvent(fullEvent);
                      }}
                      className="
                  border border-[#0e9c85] text-[#0e9c85]
                  px-6 py-1.5 rounded-[27px] text-[16px] font-bold
                  hover:bg-[#0e9c85] hover:text-white
                  transition-colors
                "
                    >
                      Más información
                    </button>
                  </div>
                </div>
              ))}
            </NetflixCarousel>
          </div>
        </div>
      </section>

      {/* Avisos */}
      <div className="max-w-[1200px] mx-auto px-4 md:px-6 lg:px-8 py-8 pb-12">
        <h2 className="text-3xl md:text-[54px] text-[#636363] mb-6" style={{ fontWeight: 700 }}>
          Avisos
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {announcements.map((announcement) => (
            <div key={announcement.id} className="flex flex-col sm:flex-row bg-white rounded-[17px] shadow-lg overflow-hidden">
              <div className="w-full sm:w-[290px] h-[200px] sm:h-auto flex-shrink-0">
                <img
                  src={announcement.image}
                  alt={announcement.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 p-6">
                <h3 className="text-[#636363] text-xl md:text-[24px] mb-4" style={{ fontWeight: 800 }}>
                  {announcement.title}
                </h3>
                <p className="text-[#636363] text-sm md:text-[14px] leading-relaxed" style={{ fontWeight: 400 }}>
                  {announcement.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Event Modal */}
      {
        selectedEvent && (
          <EventModal
            event={selectedEvent}
            isRegistered={false}
            onClose={() => setSelectedEvent(null)}
            onRegister={() => {
              if (onNavigate) {
                onNavigate('events');
              }
              setSelectedEvent(null);
            }}
            onCancel={() => setSelectedEvent(null)}
          />
        )
      }
    </div >
  );
}
