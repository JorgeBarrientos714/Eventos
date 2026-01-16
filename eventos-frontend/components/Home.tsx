import { NetflixCarousel } from './NetflixCarousel';
import type { Event } from '../types/event';

interface HomeProps {
  onNavigate?: (page: string) => void;
  searchQuery?: string;
  events?: Event[];
}

// Mock data para Próximos Eventos - Mostrar algunos de cada área
const upcomingEvents = [
  {
    id: 1,
    title: 'Jornada Recreativa 1',
    area: 'Terapia Ocupacional',
    image: 'https://images.unsplash.com/photo-1761456309232-a1416c392687?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbGRlcmx5JTIwcGVvcGxlJTIwZXZlbnQlMjBjZWxlYnJhdGlvbnxlbnwxfHx8fDE3NjgyMzgxODB8MA&ixlib=rb-4.1.0&q=80&w=1080',
  },
  {
    id: 2,
    title: 'Campamento por la Vida 1',
    area: 'Psicología',
    image: 'https://images.unsplash.com/photo-1582500347014-3fbe150ed85a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzb2NjZXIlMjBmb290YmFsbCUyMHRvdXJuYW1lbnR8ZW58MXx8fHwxNzY4MjM4MTgxfDA&ixlib=rb-4.1.0&q=80&w=1080',
  },
  {
    id: 3,
    title: 'Visita Domiciliaria Integral',
    area: 'Trabajo Social',
    image: 'https://images.unsplash.com/photo-1739285452629-2672b13fa42d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoZWFsdGglMjBtZWRpY2FsJTIwY2hlY2t1cHxlbnwxfHx8fDE3NjgyMzgxODF8MA&ixlib=rb-4.1.0&q=80&w=1080',
  },
  {
    id: 4,
    title: 'Taller de Manualidades',
    area: 'Terapia Ocupacional',
    image: 'https://images.unsplash.com/photo-1611257309952-1389bc301a72?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwYWludGluZyUyMGFydCUyMGNsYXNzfGVufDF8fHx8MTc2ODIzNDc5N3ww&ixlib=rb-4.1.0&q=80&w=1080',
  },
  {
    id: 5,
    title: 'Jornada Navideña',
    area: 'Terapia Ocupacional',
    image: 'https://images.unsplash.com/photo-1734027851931-6e06637151ed?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaHJpc3RtYXMlMjBkaW5uZXIlMjBjZWxlYnJhdGlvbnxlbnwxfHx8fDE3NjgyMzgxODJ8MA&ixlib=rb-4.1.0&q=80&w=1080',
  },
  {
    id: 6,
    title: 'Cuidado al Cuidador 1',
    area: 'Psicología',
    image: 'https://images.unsplash.com/photo-1739285452629-2672b13fa42d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoZWFsdGglMjBtZWRpY2FsJTIwY2hlY2t1cHxlbnwxfHx8fDE3NjgyMzgxODF8MA&ixlib=rb-4.1.0&q=80&w=1080',
  },
];

// Mock data para Clases
const classes = [
  { id: 1, title: 'Danza folclórica', image: 'https://images.unsplash.com/photo-1732023998275-95390af360ee?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmb2xrJTIwZGFuY2UlMjBjbGFzc3xlbnwxfHx8fDE3NjgyMzgxODV8MA&ixlib=rb-4.1.0&q=80&w=1080' },
  { id: 2, title: 'Guitarra', image: 'https://images.unsplash.com/photo-1758524944402-1903b38f848f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxndWl0YXIlMjBsZXNzb24lMjBtdXNpY3xlbnwxfHx8fDE3NjgyMzgxODV8MA&ixlib=rb-4.1.0&q=80&w=1080' },
  { id: 3, title: 'Pintura', image: 'https://images.unsplash.com/photo-1611257309952-1389bc301a72?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwYWludGluZyUyMGFydCUyMGNsYXNzfGVufDF8fHx8MTc2ODIzNDc5N3ww&ixlib=rb-4.1.0&q=80&w=1080' },
  { id: 4, title: 'Zumba', image: 'https://images.unsplash.com/photo-1717500251805-cd0306a48de4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx6dW1iYSUyMGZpdG5lc3MlMjBjbGFzc3xlbnwxfHx8fDE3NjgyMzgxODZ8MA&ixlib=rb-4.1.0&q=80&w=1080' },
  { id: 5, title: 'Marimba', image: 'https://images.unsplash.com/photo-1682268294570-616e9ca9791b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYXJpbWJhJTIwbXVzaWMlMjBpbnN0cnVtZW50fGVufDF8fHx8MTc2ODIzODE4Nnww&ixlib=rb-4.1.0&q=80&w=1080' },
  { id: 6, title: 'Yoga', image: 'https://images.unsplash.com/photo-1717500251805-cd0306a48de4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx6dW1iYSUyMGZpdG5lc3MlMjBjbGFzc3xlbnwxfHx8fDE3NjgyMzgxODZ8MA&ixlib=rb-4.1.0&q=80&w=1080' },
];

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
  // Filtrar eventos/clases por búsqueda
  const filteredUpcomingEvents = upcomingEvents.filter((event) => {
    if (!searchQuery) return true;
    return event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
           event.area.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const filteredClasses = classes.filter((classItem) => {
    if (!searchQuery) return true;
    return classItem.title.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const hasResults = filteredUpcomingEvents.length > 0 || filteredClasses.length > 0;

  return (
    <div className="pb-0 pt-0">
      {/* Hero Banner */}
      <div className="max-w-[1200px] mx-auto px-4 md:px-6 lg:px-8 pt-8 pb-8">
        <div className="relative h-[250px] md:h-[292px] rounded-[28px] overflow-hidden shadow-xl">
          <img
            src={'https://images.unsplash.com/photo-1732023998275-95390af360ee?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080'}
            alt="Portal INPREMA"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#042d27] via-[rgba(1,95,80,0.75)] to-transparent" />
          <div className="relative h-full flex flex-col justify-center px-6 md:px-12">
            <p className="text-white text-2xl md:text-[44.872px] mb-2" style={{ fontWeight: 500, fontStyle: 'italic' }}>
              Bienvenido al
            </p>
            <p className="text-white text-2xl md:text-[44.872px] mb-4" style={{ fontWeight: 700 }}>
              Portal INPREMA
            </p>
            <p className="text-white text-sm md:text-[18px] max-w-[366px]" style={{ fontWeight: 500 }}>
              Entérate e inscríbete en los siguientes eventos hechos especialmente para ti.
            </p>
          </div>
        </div>
      </div>

      {/* Mensaje de no resultados */}
      {searchQuery && !hasResults && (
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
      )}

      {/* Próximos Eventos - Carrusel */}
      <div className="max-w-[1200px] mx-auto px-4 md:px-6 lg:px-8 py-8">
        <h2 className="text-3xl md:text-[54px] text-[#636363] mb-6" style={{ fontWeight: 700 }}>
          Próximos eventos
        </h2>
        
        <div className="relative bg-gradient-to-r from-[#0d7665] to-[#0ead93] rounded-[15px] p-6 md:p-8">
          <NetflixCarousel>
            {filteredUpcomingEvents.map((event) => (
              <div 
                key={event.id} 
                className="bg-white rounded-[15px] shadow-lg overflow-hidden h-full transition-transform duration-300 ease-out hover:scale-105 hover:shadow-2xl cursor-pointer"
              >
                <div className="h-[256px] overflow-hidden">
                  <img
                    src={event.image}
                    alt={event.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-4 text-center">
                  <p className="text-[#0d7d6e] text-xs mb-1" style={{ fontWeight: 600 }}>
                    {event.area}
                  </p>
                  <h3 className="text-[#636363] text-[18px] mb-3" style={{ fontWeight: 700 }}>
                    {event.title}
                  </h3>
                  <button className="border border-[#0e9c85] text-[#0e9c85] px-6 py-1.5 rounded-[27px] text-[16px] hover:bg-[#0e9c85] hover:text-white transition-colors" style={{ fontWeight: 700 }}>
                    Más información
                  </button>
                </div>
              </div>
            ))}
          </NetflixCarousel>
        </div>
      </div>

      {/* Clases - Carrusel */}
      <div className="max-w-[1200px] mx-auto px-4 md:px-6 lg:px-8 py-8">
        <h2 className="text-3xl md:text-[54px] text-[#636363] mb-6" style={{ fontWeight: 700 }}>
          Clases
        </h2>
        
        <div className="relative bg-gradient-to-r from-[#0d7665] to-[#0ead93] rounded-[15px] p-6 md:p-8 mb-8">
          <NetflixCarousel>
            {classes.filter((c) => !searchQuery || c.title.toLowerCase().includes(searchQuery.toLowerCase())).map((classItem) => (
              <div 
                key={classItem.id} 
                className="bg-white rounded-[15px] shadow-lg overflow-hidden h-full transition-transform duration-300 ease-out hover:scale-105 hover:shadow-2xl cursor-pointer"
              >
                <div className="h-[256px] overflow-hidden">
                  <img
                    src={classItem.image}
                    alt={classItem.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-4 text-center">
                  <h3 className="text-[#636363] text-[18px] mb-3" style={{ fontWeight: 700 }}>
                    {classItem.title}
                  </h3>
                  <button className="border border-[#0e9c85] text-[#0e9c85] px-6 py-1.5 rounded-[27px] text-[16px] hover:bg-[#0e9c85] hover:text-white transition-colors" style={{ fontWeight: 700 }}>
                    Más información
                  </button>
                </div>
              </div>
            ))}
          </NetflixCarousel>
        </div>

        {/* Ver todos los eventos button */}
        {onNavigate && (
          <div className="flex justify-center">
            <button
              onClick={() => onNavigate('events')}
              className="bg-[#0d7665] text-white px-12 py-3 rounded-[27px] text-[25px] shadow-md hover:bg-[#0a6356] transition-colors"
              style={{ fontWeight: 700 }}
            >
              Ver todos los eventos
            </button>
          </div>
        )}
      </div>

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
    </div>
  );
}
