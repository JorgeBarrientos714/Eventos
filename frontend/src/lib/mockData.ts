// Tipos de datos
export interface Area {
  id: string;
  nombre: string;
  imagen: string;
}

export interface Evento {
  id: string;
  nombre: string;
  descripcion: string;
  regional: string;
  areaId: string;
  areaNombre: string;
  terapiaOClase: 'terapia' | 'clase';
  diasSemana: string[];
  departamento: string;
  municipio: string;
  direccion: string;
  fechaInicio: string;
  fechaFin: string;
  horaInicio: string;
  horaFin: string;
  cuposDisponibles: number;
  cuposTotales: number;
  imagen?: string;
  estado: 'activo' | 'pospuesto' | 'cancelado';
}

export interface Docente {
  dni: string;
  nombre: string;
  telefono: string;
  genero: 'Masculino' | 'Femenino' | 'Otro';
  fechaNacimiento: string;
  discapacidad: 'si' | 'no';
  detalleDiscapacidad?: string;
  municipio: string;
  grupoEtnico: string;
}

export interface Registro {
  id: string;
  eventoId: string;
  dni: string;
  fechaRegistro: string;
}

// Datos mock
export const areas: Area[] = [
  {
    id: 'trabajo-ocupacional',
    nombre: 'Trerapias Ocupacionales',
    imagen: 'https://images.unsplash.com/photo-1484820540004-14229fe36ca4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvY2N1cGF0aW9uYWwlMjB0aGVyYXB5fGVufDF8fHx8MTc2Mjk2ODU3MHww&ixlib=rb-4.1.0&q=80&w=1080'
  },
  {
    id: 'geriatria',
    nombre: 'Geriatría',
    imagen: 'https://images.unsplash.com/photo-1633158832433-11a30ad1e10d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbGRlcmx5JTIwY2FyZSUyMGdlcmlhdHJpY3N8ZW58MXx8fHwxNzYyOTY4NjY3fDA&ixlib=rb-4.1.0&q=80&w=1080'
  },
  {
    id: 'psicologia',
    nombre: 'Psicologia',
    imagen: 'https://images.unsplash.com/photo-1551728069-3ae0d8b619a0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxodW1hbiUyMHJpZ2h0cyUyMGNvbW11bml0eXxlbnwxfHx8fDE3NjI5Njg2Njh8MA&ixlib=rb-4.1.0&q=80&w=1080'
  }
];

export const eventos: Evento[] = [
  {
    id: '1',
    nombre: 'Motivación',
    descripcion: 'Motivación al docente',
    regional: 'Central',
    areaId: 'trabajo-ocupacional',
    areaNombre: '🎨 Canto',
    terapiaOClase: 'terapia',
    diasSemana: ['Lunes', 'Jueves'],
    departamento: 'Francisco Morazán',
    municipio: 'Distrito Central',
    direccion: 'Distrito Central, Francisco Morazán',
    fechaInicio: '2025-11-07',
    fechaFin: '2025-11-29',
    horaInicio: '03:00',
    horaFin: '05:00',
    cuposDisponibles: 25,
    cuposTotales: 25,
    estado: 'activo'
  },
  {
    id: '2',
    nombre: 'Terapia de Arte',
    descripcion: 'Terapia ocupacional mediante actividades artísticas',
    regional: 'Norte',
    areaId: 'trabajo-ocupacional',
    areaNombre: '🎨 Arte',
    terapiaOClase: 'terapia',
    diasSemana: ['Martes', 'Viernes'],
    departamento: 'Cortés',
    municipio: 'San Pedro Sula',
    direccion: 'Centro de Rehabilitación, San Pedro Sula',
    fechaInicio: '2025-11-10',
    fechaFin: '2025-12-15',
    horaInicio: '09:00',
    horaFin: '11:00',
    cuposDisponibles: 18,
    cuposTotales: 20,
    estado: 'activo'
  },
  {
    id: '3',
    nombre: 'Cuidado del Adulto Mayor',
    descripcion: 'Técnicas de cuidado y atención geriátrica',
    regional: 'Central',
    areaId: 'geriatria',
    areaNombre: '👴 Geriatría',
    terapiaOClase: 'clase',
    diasSemana: ['Miércoles'],
    departamento: 'Francisco Morazán',
    municipio: 'Tegucigalpa',
    direccion: 'Hospital Geriátrico',
    fechaInicio: '2025-11-15',
    fechaFin: '2025-12-20',
    horaInicio: '14:00',
    horaFin: '16:00',
    cuposDisponibles: 12,
    cuposTotales: 15,
    estado: 'activo'
  },
  {
    id: '4',
    nombre: 'Derechos y Dignidad',
    descripcion: 'Formación en procesos fundamentales',
    regional: 'Sur',
    areaId: 'psicologia',
    areaNombre: '⚖️ Derechos',
    terapiaOClase: 'clase',
    diasSemana: ['Lunes', 'Miércoles', 'Viernes'],
    departamento: 'Choluteca',
    municipio: 'Choluteca',
    direccion: 'Centro Comunitario',
    fechaInicio: '2025-11-12',
    fechaFin: '2025-12-10',
    horaInicio: '10:00',
    horaFin: '12:00',
    cuposDisponibles: 30,
    cuposTotales: 30,
    estado: 'activo'
  },
  {
    id: '5',
    nombre: 'Musicoterapia',
    descripcion: 'Terapia ocupacional mediante música',
    regional: 'Central',
    areaId: 'trabajo-ocupacional',
    areaNombre: '🎵 Música',
    terapiaOClase: 'terapia',
    diasSemana: ['Martes', 'Jueves'],
    departamento: 'Francisco Morazán',
    municipio: 'Distrito Central',
    direccion: 'Instalaciones INPREMA',
    fechaInicio: '2025-11-08',
    fechaFin: '2025-11-30',
    horaInicio: '15:00',
    horaFin: '17:00',
    cuposDisponibles: 0,
    cuposTotales: 15,
    estado: 'pospuesto'
  }
];

export const docentes: Docente[] = [
  {
    dni: '0801199012345',
    nombre: 'María López García',
    telefono: '+504 9876-5432',
    genero: 'Femenino',
    fechaNacimiento: '1990-05-15',
    discapacidad: 'no',
    municipio: 'Tegucigalpa',
    grupoEtnico: 'Mestizo'
  },
  {
    dni: '0501198543210',
    nombre: 'Carlos Martínez Pérez',
    telefono: '+504 8765-4321',
    genero: 'Masculino',
    fechaNacimiento: '1985-08-22',
    discapacidad: 'si',
    detalleDiscapacidad: 'Discapacidad visual parcial',
    municipio: 'San Pedro Sula',
    grupoEtnico: 'Mestizo'
  },
  {
    dni: '1801199254321',
    nombre: 'Ana Rodríguez Flores',
    telefono: '+504 7654-3210',
    genero: 'Femenino',
    fechaNacimiento: '1992-03-10',
    discapacidad: 'no',
    municipio: 'La Ceiba',
    grupoEtnico: 'Garífuna'
  }
];

export const registros: Registro[] = [
  {
    id: 'r1',
    eventoId: '2',
    dni: '0801199012345',
    fechaRegistro: '2025-11-05T10:30:00'
  },
  {
    id: 'r2',
    eventoId: '3',
    dni: '0501198543210',
    fechaRegistro: '2025-11-06T14:15:00'
  }
];

// Departamentos de Honduras en orden alfabético
export const departamentosHonduras = [
  'Atlántida',
  'Choluteca',
  'Colón',
  'Comayagua',
  'Copán',
  'Cortés',
  'El Paraíso',
  'Francisco Morazán',
  'Gracias a Dios',
  'Intibucá',
  'Islas de la Bahía',
  'La Paz',
  'Lempira',
  'Ocotepeque',
  'Olancho',
  'Santa Bárbara',
  'Valle',
  'Yoro'
];

// Grupos étnicos de Honduras
export const gruposEtnicos = [
  'Mestizo',
  'Garífuna',
  'Miskito',
  'Lenca',
  'Maya Chortí',
  'Pech',
  'Tolupán',
  'Tawahka',
  'Nahua',
  'Criollo/Afrodescendiente',
  'Otro'
];
