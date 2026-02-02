export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  startDate?: string;
  startTime?: string;
  location: string;
  category: string;
  image: string;
  isIntermediate: boolean;
  tipoEvento?: 'evento' | 'clase';
  cuposDisponibles?: number;
  cuposTotales?: number;
  cuposUsados?: number;
  cantidadInvPermitidos?: number;
  estado?: string; // activo | pospuesto | cancelado
}
