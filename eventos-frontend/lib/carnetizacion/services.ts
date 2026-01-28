// Servicios para carnetización (paso 1, paso 2, etc.)
if (!process.env.NEXT_PUBLIC_API_URL) {
  throw new Error(
    'La variable de entorno NEXT_PUBLIC_API_URL no está definida. ' +
    'Por favor, configúrala en tu archivo .env.local'
  );
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export const carnetizacionServices = {
  /**
   * Buscar docente por DNI (paso 1: búsqueda)
   */
  async buscarDocentePorDni(dni: string) {
    const response = await fetch(`${API_BASE_URL}/eventos/carnetizacion/docente/dni/${dni}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const message = await response.text();
      throw new Error(message || `Docente con DNI ${dni} no encontrado`);
    }

    return response.json();
  },

  /**
   * Actualizar datos personales del docente (paso 1: edición)
   */
  async actualizarDocentePaso1(docenteId: number, datos: any) {
    const response = await fetch(`${API_BASE_URL}/eventos/carnetizacion/docente/${docenteId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(datos),
    });

    if (!response.ok) {
      const message = await response.text();
      throw new Error(message || 'Error al actualizar datos del docente');
    }

    return response.json();
  },

  /**
   * Listar departamentos (ubicación)
   */
  async listarDepartamentos() {
    const response = await fetch(`${API_BASE_URL}/eventos/departamentos`, {
      method: 'GET',
    });

    if (!response.ok) {
      throw new Error('Error al listar departamentos');
    }

    return response.json();
  },

  /**
   * Listar municipios por departamento
   */
  async listarMunicipios(departamentoId: number) {
    const response = await fetch(`${API_BASE_URL}/eventos/municipios/departamento/${departamentoId}`, {
      method: 'GET',
    });

    if (!response.ok) {
      throw new Error('Error al listar municipios');
    }

    return response.json();
  },

  /**
   * Listar aldeas por municipio
   */
  async listarAldeas(municipioId: number) {
    const response = await fetch(`${API_BASE_URL}/eventos/aldeas/municipio/${municipioId}`, {
      method: 'GET',
    });

    if (!response.ok) {
      throw new Error('Error al listar aldeas');
    }

    return response.json();
  },

  /**
   * Listar grupos étnicos (desde datos mock o backend)
   */
  async listarGruposEtnicos() {
    // Datos mock temporales; cuando esté disponible en BD, reemplazar con fetch
    return [
      { id: 1, nombre: 'Mestizo' },
      { id: 2, nombre: 'Lenca' },
      { id: 3, nombre: 'Maya-Chortí' },
      { id: 4, nombre: 'Garífuna' },
      { id: 5, nombre: 'Tawahka' },
      { id: 6, nombre: 'Tolupán' },
      { id: 7, nombre: 'Pech' },
      { id: 8, nombre: 'Miskito' },
      { id: 9, nombre: 'Nahualt' },
      { id: 10, nombre: 'Negro de habla inglesa (Creole)' },
    ];
  },
};
