export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  category: string;
  image: string;
  isIntermediate: boolean;
  cuposDisponibles?: number;
  cuposTotales?: number;
  cantidadInvPermitidos?: number;
}
