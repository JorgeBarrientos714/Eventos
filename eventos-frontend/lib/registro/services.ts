/**
 * Servicios para registro de docente a evento
 * Módulo: eventos/registro
 * Función: Comunicación con backend para búsqueda y registro de docentes
 */

interface DocenteRegistroResponse {
  id: number;
  nIdentificacion: string;
  primerNombre: string;
  segundoNombre?: string;
  tercerNombre?: string;
  primerApellido: string;
  segundoApellido?: string;
  nombreCompleto: string;
  genero: 'M' | 'F' | 'O';
  fechaNacimiento: string;
  telefono1: string;
  direccionResidencia?: string;
  idDepartamento?: number;
  departamento?: {
    id: number;
    nombre: string;
  };
  idMunicipioResidencia?: number;
  municipio?: {
    id: number;
    nombre: string;
  };
  idAldea?: number;
  aldea?: {
    id: number;
    nombre: string;
  };
  idGrupoEtnico?: number;
  grupoEtnico?: {
    id: number;
    nombreGrupoEtnico: string;
  };
}

interface DepartamentoResponse {
  id: number;
  nombres: string;
}

interface MunicipioResponse {
  id: number;
  nombres: string;
  idDepartamento: number;
}

interface AldeaResponse {
  id: number;
  nombreAldea: string;
  idMunicipio: number;
  municipio?: {
    id: number;
    nombres: string;
    idDepartamento: number;
    departamento?: {
      id: number;
      nombres: string;
    };
  };
}

interface GrupoEtnicoResponse {
  id: number;
  nombreGrupoEtnico: string;
}

interface DiscapacidadResponse {
  id: number;
  nombre: string;
  descripcion?: string;
}

interface InvitadoData {
  dniInvitado: string;
  nombreInvitado: string;
}

interface InscripcionEventoRequest {
  idEvento: number;
  idDocente: number;
  tieneDiscapacidad: boolean;
  idsDiscapacidades?: number[];
  llevaInvitados: boolean;
  invitados?: InvitadoData[];
}

interface InscripcionEventoResponse {
  idRegistro: number;
  mensaje: string;
  cuposRestantes: number;
  cantidadInvitados: number;
  discapacidadesRegistradas: number;
}

interface MiInscripcionItem {
  idRegistro: number;
  fechaRegistro: string;
  estado: string;
  idEstado: number | null;
  invitadosRegistrados: number;
  evento: {
    id: number;
    nombreEvento: string;
    descripcion?: string;
    fechaInicio?: string;
    horaInicio?: string;
    horaFin?: string;
    direccion?: string;
    cuposTotales?: number;
    cuposDisponibles?: number;
    cantidadInvPermitidos?: number;
  };
}

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export const registroServices = {
  /**
   * Buscar docente por DNI en NET_DOCENTE
   */
  async buscarDocentePorDni(dni: string): Promise<DocenteRegistroResponse> {
    const response = await fetch(`${API_BASE}/eventos/carnetizacion/docente/dni/${dni}`);
    if (!response.ok) {
      throw new Error(`Docente no encontrado (${response.status})`);
    }
    return response.json();
  },

  /**
   * Actualizar datos del docente antes de registro
   */
  async actualizarDocenteRegistro(
    docenteId: number,
    datos: Partial<DocenteRegistroResponse>
  ): Promise<DocenteRegistroResponse> {
    const response = await fetch(`${API_BASE}/eventos/carnetizacion/docente/${docenteId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(datos),
    });
    if (!response.ok) {
      throw new Error('Error al actualizar docente');
    }
    return response.json();
  },

  /**
   * Listar departamentos
   */
  async listarDepartamentos(): Promise<DepartamentoResponse[]> {
    const response = await fetch(`${API_BASE}/eventos/departamentos`);
    if (!response.ok) throw new Error('Error al cargar departamentos');
    return response.json();
  },

  /**
   * Listar municipios por departamento
   */
  async listarMunicipios(departamentoId: number): Promise<MunicipioResponse[]> {
    const response = await fetch(`${API_BASE}/eventos/municipios/departamento/${departamentoId}`);
    if (!response.ok) throw new Error('Error al cargar municipios');
    return response.json();
  },

  /**
   * Listar TODAS las aldeas (con sus relaciones a municipio y departamento)
   */
  async listarTodasLasAldeas(): Promise<AldeaResponse[]> {
    const response = await fetch(`${API_BASE}/eventos/aldeas`);
    if (!response.ok) throw new Error('Error al cargar aldeas');
    return response.json();
  },

  /**
   * Listar aldeas por municipio
   */
  async listarAldeas(municipioId: number): Promise<AldeaResponse[]> {
    const response = await fetch(`${API_BASE}/eventos/aldeas/municipio/${municipioId}`);
    if (!response.ok) throw new Error('Error al cargar aldeas');
    return response.json();
  },

  /**
   * Listar grupos étnicos
   */
  async listarGruposEtnicos(): Promise<GrupoEtnicoResponse[]> {
    const response = await fetch(`${API_BASE}/eventos/grupos-etnicos`);
    if (!response.ok) throw new Error('Error al cargar grupos étnicos');
    return response.json();
  },

  /**
   * Listar discapacidades
   */
  async listarDiscapacidades(): Promise<DiscapacidadResponse[]> {
    const response = await fetch(`${API_BASE}/eventos/discapacidades`);
    if (!response.ok) throw new Error('Error al cargar discapacidades');
    return response.json();
  },

  /**
   * Obtener discapacidades del docente
   */
  async obtenerDiscapacidadesDocente(idDocente: number): Promise<{ id: number; idDiscapacidad: number }[]> {
    const response = await fetch(`${API_BASE}/eventos/docente/${idDocente}/discapacidades`);
    if (!response.ok) throw new Error('Error al cargar discapacidades del docente');
    return response.json();
  },

  /**
   * Inscripción completa a evento (Paso 2)
   */
  async inscribirDocenteEvento(datos: InscripcionEventoRequest): Promise<InscripcionEventoResponse> {
    const response = await fetch(`${API_BASE}/eventos/inscripcion`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(datos),
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.message || 'Error al inscribir a evento');
    }
    return response.json();
  },

  /**
   * 🔍 Verificar estado de inscripción del docente en un evento
   */
  async verificarEstadoInscripcion(idEvento: number, idDocente: number): Promise<{
    estaInscrito: boolean;
    idRegistro?: number;
    estado?: string;
    idEstado?: number;
    fechaRegistro?: string;
    invitadosRegistrados?: number;
    maxInvitados?: number;
    invitadosFaltantes?: number;
    puedeAgregarInvitados?: boolean;
    mensaje: string;
  }> {
    const response = await fetch(`${API_BASE}/eventos/evento/${idEvento}/docente/${idDocente}/estado`);
    if (!response.ok) {
      throw new Error('Error al verificar estado de inscripción');
    }
    return response.json();
  },

  /**
   * ➕ Agregar invitados a una inscripción existente
   */
  async agregarInvitadosAInscripcion(datos: {
    idEvento: number;
    idDocente: number;
    invitados: InvitadoData[];
  }): Promise<{
    mensaje: string;
    invitadosActuales: number;
    maxInvitados: number;
    espacioRestante: number;
  }> {
    const response = await fetch(`${API_BASE}/eventos/inscripcion/agregar-invitados`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(datos),
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.message || 'Error al agregar invitados');
    }
    return response.json();
  },

  /**
   * Confirmar registro a evento (método antiguo - mantener por compatibilidad)
   */
  async confirmarRegistroEvento(
    docenteId: number,
    eventoId: number
  ): Promise<{ success: boolean; message: string }> {
    const response = await fetch(`${API_BASE}/eventos/registro`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ docenteId, eventoId }),
    });
    if (!response.ok) {
      throw new Error('Error al registrar a evento');
    }
    return response.json();
  },

  /**
   * Listar mis inscripciones usando el token del docente
   */
  async listarMisInscripciones(token?: string): Promise<MiInscripcionItem[]> {
    const tkn = token || (typeof window !== 'undefined' ? localStorage.getItem('docente_token') || undefined : undefined);
    if (!tkn) return [];
    const response = await fetch(`${API_BASE}/eventos/mis-inscripciones`, {
      headers: { 'Authorization': `Bearer ${tkn}` },
    });
    if (!response.ok) return [];
    return response.json();
  },

  /**
   * Listar mis cancelaciones usando el token del docente
   */
  async listarMisCancelaciones(token?: string): Promise<MiInscripcionItem[]> {
    const tkn = token || (typeof window !== 'undefined' ? localStorage.getItem('docente_token') || undefined : undefined);
    if (!tkn) return [];
    const response = await fetch(`${API_BASE}/eventos/mis-cancelaciones`, {
      headers: { 'Authorization': `Bearer ${tkn}` },
    });
    if (!response.ok) return [];
    return response.json();
  },

  /**
   * Cancelar inscripción usando el token del docente
   */
  async cancelarInscripcion(datos: { idRegistro?: number; idEvento?: number }, token?: string): Promise<{ mensaje: string; idRegistro: number }> {
    const tkn = token || (typeof window !== 'undefined' ? localStorage.getItem('docente_token') || undefined : undefined);
    if (!tkn) throw new Error('No hay sesión de docente activa');
    const response = await fetch(`${API_BASE}/eventos/inscripcion/cancelar`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${tkn}`,
      },
      body: JSON.stringify(datos),
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.message || 'Error al cancelar inscripción');
    }
    return response.json();
  },
};
