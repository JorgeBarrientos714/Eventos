export interface Teacher {
  dni: string;
  name: string;
  phone: string;
  location: string;
}

export interface TeacherDetails extends Teacher {
  gender: 'M' | 'F' | 'Otro';
  birthDate: string; // dd/mm/yyyy
  department: string;
  municipality: string;
  ethnicGroup: 'Mestizo' | 'Lenca' | 'Maya-Chortí' | 'Garífuna' | 'Tawahka' | 'Tolupán' | 'Pech' | 'Miskito' | 'Nahualt' | 'Creole';
  hasDisability: boolean;
  disabilityTypes?: ('Física (Motora)' | 'Sensorial (Visual)' | 'Sensorial (Auditiva)' | 'Cognitiva' | 'Múltiple')[];
}

export interface Registration {
  id: string;
  eventId: string;
  teacherDni: string;
  registeredAt: string;
}
