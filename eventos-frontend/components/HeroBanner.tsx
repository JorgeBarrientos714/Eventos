// Módulo: global/public
// Función: Carrusel hero para destacar eventos en la página pública
// Relacionados: components/Home.tsx, pages/index.tsx
// Rutas/Endpoints usados: ninguno (datos provistos por props)
// Notas: No se renombra para conservar imports.
import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, ImageOff } from 'lucide-react';
import type { Event } from '../types/event';

interface HeroBannerProps {
  events: Event[];
}

export function HeroBanner({ events }: HeroBannerProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!events || events.length === 0) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % events.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [events.length, events]);

  const goToPrevious = () => {
    if (!events || events.length === 0) return;
    setCurrentIndex((prev) => (prev - 1 + events.length) % events.length);
  };

  const goToNext = () => {
    if (!events || events.length === 0) return;
    setCurrentIndex((prev) => (prev + 1) % events.length);
  };

  // Validación: mostrar placeholder si no hay eventos
  if (!events || events.length === 0) {
    return (
      <div className="relative w-full h-[200px] md:h-[300px] rounded-xl md:rounded-2xl overflow-hidden bg-gray-200 flex items-center justify-center">
        <p className="text-gray-500">No hay eventos disponibles</p>
      </div>
    );
  }

  const currentEvent = events[currentIndex];

  return (
    <div className="relative w-full h-[200px] md:h-[300px] rounded-xl md:rounded-2xl overflow-hidden bg-gray-200 group">
      {/* Image */}
      {currentEvent.image ? (
        <img
          src={currentEvent.image}
          alt={currentEvent.title}
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-gray-300">
          <ImageOff className="w-16 h-16 text-gray-400" />
        </div>
      )}

      {/* Overlay gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

      {/* Content */}
      <div className="absolute bottom-4 md:bottom-6 left-4 md:left-6 right-4 text-white z-10">
        <h2 className="text-xl md:text-3xl mb-1 md:mb-2" style={{ fontWeight: 600 }}>
          {currentEvent.title}
        </h2>
      </div>

      {/* Navigation buttons */}
      <button
        onClick={goToPrevious}
        className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-1.5 md:p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-10"
        aria-label="Anterior"
      >
        <ChevronLeft className="w-4 h-4 md:w-6 md:h-6 text-gray-800" />
      </button>

      <button
        onClick={goToNext}
        className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-1.5 md:p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-10"
        aria-label="Siguiente"
      >
        <ChevronRight className="w-4 h-4 md:w-6 md:h-6 text-gray-800" />
      </button>

      {/* Dots indicator */}
      <div className="absolute bottom-2 md:bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 md:gap-2 z-10">
        {events.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-1.5 h-1.5 md:w-2 md:h-2 rounded-full transition-colors ${index === currentIndex ? 'bg-white' : 'bg-white/50'
              }`}
            aria-label={`Ir a diapositiva ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
