// Módulo: global/shared
// Función: Servicios de eventos públicos - consume SOLO backend (BD)
// Relacionados: pages/events.tsx, components/EventCard.tsx, Home.tsx
// Rutas/Endpoints usados: GET /eventos/evento/todos, GET /eventos/areas
// Notas: NO hay datos hardcodeados. Todo viene de la BD.
import type { Event } from '../types/event';

const API_BASE_URL = typeof window !== 'undefined' 
  ? process.env.NEXT_PUBLIC_API_URL ?? `http://${window.location.hostname}:3000`
  : process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000';

const formatDate = (dateStr?: string | Date): string => {
  if (!dateStr) return '';
  const date = typeof dateStr === 'string' ? new Date(dateStr) : dateStr;
  if (Number.isNaN(date.getTime())) return '';
  
  const dias = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
  const meses = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
  
  const diaSemana = dias[date.getDay()];
  const dia = date.getDate();
  const mes = meses[date.getMonth()];
  const anio = date.getFullYear();
  
  return `${diaSemana} ${dia} de ${mes} del ${anio}`;
};

const mapEventoToEvent = (evento: any): Event => {
  const area = evento?.clase?.area;
  const municipio = evento?.municipio;
  const departamento = municipio?.departamento;
  const tipoRaw = (evento?.tipoEvento ?? evento?.TIPO_EVENTO ?? '').toString().toLowerCase();
  const tipoEvento = tipoRaw === 'clase' || tipoRaw === 'evento' ? (tipoRaw as 'clase' | 'evento') : undefined;
  
  // Construir URL completa de imagen si existe
  let imageUrl = 'https://images.unsplash.com/photo-1739285452629-2672b13fa42d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080';
  if (evento?.imagenUrl) {
    // Si la URL ya es completa (http/https), usarla directamente
    if (evento.imagenUrl.startsWith('http')) {
      imageUrl = evento.imagenUrl;
    } else {
      // Si es una ruta relativa, construir URL completa
      imageUrl = `${API_BASE_URL}${evento.imagenUrl}`;
    }
  }
  
  return {
    id: String(evento?.id ?? evento?.ID_EVENTO ?? Date.now()),
    title: evento?.nombreEvento ?? evento?.NOMBRE_EVENTO ?? 'Evento',
    description: evento?.descripcion ?? 'Sin descripción',
    date: formatDate(evento?.fechaInicio),
    time: `${evento?.horaInicio ?? '00:00'} - ${evento?.horaFin ?? '00:00'}`,
    location: [
      departamento?.nombres ?? '',
      municipio?.nombres ?? municipio?.NOMBRES_MUNICIPIO ?? '',
      evento?.direccion ?? ''
    ].filter(Boolean).join(', ') || 'Sin ubicación',
    category: area?.nombres ?? area?.NOMBRE_AREA ?? 'Sin área',
    image: imageUrl,
    isIntermediate: false,
    tipoEvento,
    cuposDisponibles: evento?.cuposDisponibles ?? 0,
    cuposTotales: evento?.cuposTotales ?? 0,
    cantidadInvPermitidos: evento?.cantidadInvPermitidos ?? 0,
    estado: (evento?.estado ?? evento?.ESTADO ?? '').toString().toLowerCase() || undefined,
  };
};

/**
 * Obtiene TODOS los eventos desde la BD
 */
export async function getAllEvents(): Promise<Event[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/eventos/evento/todos`);
    if (!response.ok) {
      console.error('Error al obtener eventos:', response.statusText);
      return [];
    }
    const data = await response.json();
    return Array.isArray(data) ? data.map(mapEventoToEvent) : [];
  } catch (error) {
    console.error('Error al obtener eventos:', error);
    return [];
  }
}

/**
 * Obtiene eventos filtrados por área desde la BD
 */
export async function getEventsByArea(areaName: string): Promise<Event[]> {
  if (areaName === 'Todas las áreas') {
    return getAllEvents();
  }
  
  try {
    // Filtrar eventos en el cliente por nombre de área
    const allEvents = await getAllEvents();
    return allEvents.filter(e => e.category === areaName);
  } catch (error) {
    console.error('Error al filtrar eventos por área:', error);
    return [];
  }
}

/**
 * Obtiene TODAS las áreas desde la BD
 */
export async function getAreas(): Promise<Array<{ id: string; nombre: string }>> {
  try {
    const response = await fetch(`${API_BASE_URL}/eventos/areas`);
    if (!response.ok) {
      console.error('Error al obtener áreas:', response.statusText);
      return [];
    }
    const data = await response.json();
    return Array.isArray(data) ? data.map((a: any) => ({
      id: String(a.id ?? a.ID_AREA),
      nombre: a.nombres ?? a.NOMBRE_AREA ?? 'Área'
    })) : [];
  } catch (error) {
    console.error('Error al obtener áreas:', error);
    return [];
  }
}

// Datos de respaldo SOLO si la BD falla completamente
// NO se usan por defecto - array vacío
export const MOCK_EVENTS: Event[] = [];
