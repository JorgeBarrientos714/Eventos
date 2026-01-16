import type { Teacher, TeacherDetails } from '../types/teacher';

export const MOCK_TEACHERS: TeacherDetails[] = [
  {
    dni: '0801196601254',
    name: 'María González Pérez',
    gender: 'F',
    birthDate: '15/06/1966',
    phone: '+504 9876-5432',
    location: 'Tegucigalpa, Francisco Morazán',
    department: 'Francisco Morazán',
    municipality: 'Tegucigalpa',
    ethnicGroup: 'Mestizo',
    hasDisability: false,
    disabilityTypes: [],
  },
  {
    dni: '0801198512345',
    name: 'Juan Carlos Martínez',
    gender: 'M',
    birthDate: '22/03/1985',
    phone: '+504 9988-7766',
    location: 'San Pedro Sula, Cortés',
    department: 'Cortés',
    municipality: 'San Pedro Sula',
    ethnicGroup: 'Lenca',
    hasDisability: true,
    disabilityTypes: ['Sensorial (Visual)'],
  },
  {
    dni: '0801199054321',
    name: 'Ana Patricia López',
    gender: 'F',
    birthDate: '10/12/1990',
    phone: '+504 3344-5566',
    location: 'La Ceiba, Atlántida',
    department: 'Atlántida',
    municipality: 'La Ceiba',
    ethnicGroup: 'Garífuna',
    hasDisability: false,
    disabilityTypes: [],
  },
  {
    dni: '0801197898765',
    name: 'Roberto Hernández',
    gender: 'M',
    birthDate: '05/07/1978',
    phone: '+504 2211-3344',
    location: 'Comayagua, Comayagua',
    department: 'Comayagua',
    municipality: 'Comayagua',
    ethnicGroup: 'Mestizo',
    hasDisability: true,
    disabilityTypes: ['Física (Motora)', 'Cognitiva'],
  },
];

export const ETHNIC_GROUPS = {
  Mestizo: 'Población de origen mixto, mayoritaria en Honduras.',
  Lenca: 'Ubicados en: Comayagua, Copán, Francisco Morazán, Intibucá, La Paz, Lempira, Ocotepeque, Santa Bárbara y Valle.',
  'Maya-Chortí': 'Ubicados en: Copán, en la frontera con Guatemala.',
  Garífuna: 'Ubicados en: Atlántida, Cortés, Islas de la Bahía y Trujillo (Colón).',
  Tawahka: 'Ubicados en: Olancho, en la región de La Mosquitia.',
  Tolupán: 'Ubicados en: Yoro, en la zona norte-central de Honduras.',
  Pech: 'Ubicados en: Olancho, en la región de La Mosquitia.',
  Miskito: 'Ubicados en: Colón y la región de La Mosquitia.',
  Nahualt: 'Ubicados en: Cortés, en la zona norte de Honduras.',
  Creole: 'Población de habla inglesa ubicada en: Atlántida, Cortés, Islas de la Bahía y Colón.',
};

export function findTeacherByDNI(dni: string): TeacherDetails | undefined {
  return MOCK_TEACHERS.find(teacher => teacher.dni === dni);
}
