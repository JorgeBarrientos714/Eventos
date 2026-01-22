// Módulo: frontend-admin (login/admin)
// Función: Cliente HTTP para autenticación admin y gestión de eventos/áreas
// Relacionados: context/AdminAuthContext.tsx, pages/admin/login.tsx, lib/admin/types.ts
// Rutas/Endpoints usados: /eventos/auth/login, /eventos/auth/register, /eventos/auth/recuperar, /eventos/auth/restablecer, /eventos/areas, /eventos/evento/area/:id
// Notas: No se renombra para preservar imports existentes en todo el frontend.
import { ADMIN_DEPARTAMENTOS, ADMIN_DOCENTES, ADMIN_EVENTOS, ADMIN_GRUPOS_ETNICOS, ADMIN_REGISTROS } from './mockData';
import {
  AdminDocente,
  AdminEvent,
  AdminRegistro,
  AdminLoginPayload,
  AdminRecoveryPayload,
  AdminRegisterPayload,
  AdminResetPasswordPayload,
  AdminUserSession,
  AdminArea,
  AdminUsuarioSummary,
  AdminEmpleadoSummary,
} from './types';

const STORAGE_KEY = 'portal-inprema-admin-session';
const API_BASE_URL = typeof window !== 'undefined' 
  ? process.env.NEXT_PUBLIC_API_URL ?? `http://${window.location.hostname}:3000`
  : process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000';

const toISODate = (value?: string | Date | null): string => {
  if (!value) return '';
  const date = typeof value === 'string' ? new Date(value) : value;
  if (Number.isNaN(date.getTime())) return '';
  return date.toISOString().slice(0, 10);
};

const splitDiasSemana = (value?: string | null): string[] => {
  if (!value) return [];
  return value
    .split(',')
    .map((dia) => dia.trim())
    .filter(Boolean);
};

const mapEvento = (evento: any): AdminEvent => {
  const area = evento?.clase?.area;
  const municipio = evento?.municipio;
  const departamento = municipio?.departamento;
  const tipoRaw = (evento?.tipoEvento ?? evento?.TIPO_EVENTO ?? '').toString().toLowerCase();
  const tipoEvento = tipoRaw === 'clase' || tipoRaw === 'evento' ? (tipoRaw as 'clase' | 'evento') : undefined;
  return {
    id: String(evento?.id ?? evento?.ID_EVENTO ?? Date.now()),
    nombre: evento?.nombreEvento ?? evento?.NOMBRE_EVENTO ?? 'Evento',
    descripcion: evento?.descripcion ?? '',
    regional: evento?.regional?.nombres ?? evento?.REGIONAL ?? 'N/D',
    areaId: area ? String(area.id ?? area.ID_AREA) : '',
    areaNombre: area?.nombres ?? area?.NOMBRE_AREA ?? 'Sin área',
    tipoEvento,
    terapiaOClase: tipoEvento === 'evento' ? 'terapia' : 'clase',
    diasSemana: splitDiasSemana(evento?.diasSemana ?? evento?.DIAS_SEMANA),
    departamento: departamento?.nombres ?? departamento?.NOMBRES ?? '',
    municipio: municipio?.nombres ?? municipio?.NOMBRES_MUNICIPIO ?? '',
    direccion: evento?.direccion ?? '',
    fechaInicio: toISODate(evento?.fechaInicio),
    fechaFin: toISODate(evento?.fechaFin),
    horaInicio: evento?.horaInicio ?? '',
    horaFin: evento?.horaFin ?? '',
    cuposDisponibles: Number(evento?.cuposDisponibles ?? evento?.CUPOS_DISPONIBLES ?? 0),
    cuposTotales: Number(evento?.cuposTotales ?? evento?.CUPOS_TOTALES ?? 0),
    imagen: evento?.imagenUrl ?? undefined,
    estado: 'activo',
    claseId: evento?.idClase ? String(evento.idClase) : (evento?.ID_CLASE ? String(evento.ID_CLASE) : undefined),
    departamentoId: departamento?.id ? String(departamento.id) : (departamento?.ID_DEPARTAMENTO ? String(departamento.ID_DEPARTAMENTO) : undefined),
    municipioId: municipio?.id ? String(municipio.id) : (municipio?.ID_MUNICIPIO ? String(municipio.ID_MUNICIPIO) : undefined),
    idRegional: evento?.idRegional ? String(evento.idRegional) : (evento?.ID_REGIONAL ? String(evento.ID_REGIONAL) : undefined),
    ...(evento?.cantidadInvPermitidos && { cantidadInvitados: Number(evento.cantidadInvPermitidos) }),
  };
};

const mapUsuario = (usuario: any): AdminUsuarioSummary => {
  const empleado = usuario?.empleado;
  let empleadoSummary: AdminEmpleadoSummary | undefined;
  if (empleado) {
    empleadoSummary = {
      id: Number(empleado.id ?? empleado.ID_EMPLEADO ?? 0),
      nombre: empleado.nombre ?? empleado.NOMBRE ?? '',
      numeroEmpleado: empleado.numeroEmpleado ?? empleado.NUMERO_EMPLEADO ?? '',
      dni: empleado.dni ?? empleado.DNI ?? '',
      idArea: Number(empleado.idArea ?? empleado.ID_AREA ?? 0),
      areaNombre: empleado.area?.nombres ?? empleado.area?.NOMBRE_AREA ?? undefined,
    };
  }

  return {
    id: Number(usuario?.id ?? usuario?.ID_USUARIO ?? 0),
    correoElectronico: usuario?.correoElectronico ?? usuario?.CORREO_ELECTRONICO ?? '',
    empleado: empleadoSummary,
  };
};

const persistSession = (session: AdminUserSession | null) => {
  if (typeof window === 'undefined') return;
  if (!session) {
    window.localStorage.removeItem(STORAGE_KEY);
    return;
  }
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
};

const readStoredSession = (): AdminUserSession | null => {
  if (typeof window === 'undefined') {
    return null;
  }
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    return null;
  }
  try {
    const parsed = JSON.parse(raw) as AdminUserSession;
    if (parsed?.eventos) {
      parsed.eventos = parsed.eventos.map((evento) => ({ ...evento }));
    }
    return parsed;
  } catch (error) {
    window.localStorage.removeItem(STORAGE_KEY);
    return null;
  }
};

const fetchJSON = async <T>(input: RequestInfo, init?: RequestInit): Promise<T> => {
  const response = await fetch(input, {
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers ?? {}),
    },
    ...init,
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || 'Error al comunicarse con el servidor');
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
};

const buildSessionFromResponse = (payload: any): AdminUserSession => {
  const eventos = Array.isArray(payload?.eventos) ? payload.eventos.map(mapEvento) : [];
  const usuario = mapUsuario(payload?.usuario ?? payload);
  return { usuario, eventos };
};

export const adminServices = {
  async getSession(): Promise<AdminUserSession | null> {
    return readStoredSession();
  },

  async login(payload: AdminLoginPayload): Promise<AdminUserSession> {
    const data = await fetchJSON<any>(`${API_BASE_URL}/eventos/auth/login`, {
      method: 'POST',
      body: JSON.stringify(payload),
    });

    const session = buildSessionFromResponse(data);
    persistSession(session);
    return session;
  },

  async register(payload: AdminRegisterPayload): Promise<void> {
    await fetchJSON(`${API_BASE_URL}/eventos/auth/register`, {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  async requestPasswordReset(payload: AdminRecoveryPayload): Promise<{ token: string; expira: string }> {
    const data = await fetchJSON<{ mensaje: string; token: string; expira: string }>(
      `${API_BASE_URL}/eventos/auth/recuperar`,
      {
        method: 'POST',
        body: JSON.stringify(payload),
      },
    );
    return { token: data.token, expira: data.expira };
  },

  async resetPassword(payload: AdminResetPasswordPayload): Promise<void> {
    await fetchJSON(`${API_BASE_URL}/eventos/auth/restablecer`, {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  async logout(): Promise<void> {
    persistSession(null);
  },

  async listAreas(): Promise<AdminArea[]> {
    const data = await fetchJSON<any[]>(`${API_BASE_URL}/eventos/areas`, {
      method: 'GET',
    });

    return data.map((area) => ({
      id: String(area.id ?? area.ID_AREA),
      nombre: area.nombres ?? area.NOMBRE_AREA ?? 'Área',
      imagen: undefined,
    }));
  },

  async listRegionales(): Promise<Array<{ id: string; nombre: string }>> {
    const data = await fetchJSON<any[]>(`${API_BASE_URL}/eventos/regionales`, { method: 'GET' });
    return data.map((r) => ({ id: String(r.id ?? r.ID_REGIONAL), nombre: r.nombres ?? r.NOMBRE_REGIONAL ?? 'Regional' }));
  },

  async listEstadosEvento(): Promise<Array<{ id: string; nombre: string; descripcion?: string }>> {
    const data = await fetchJSON<any[]>(`${API_BASE_URL}/eventos/estados/EVENTO`, { method: 'GET' });
    return data.map((e) => ({ id: String(e.id ?? e.ID_ESTADO), nombre: e.nombreEstado ?? e.NOMBRE_ESTADO ?? 'Estado', descripcion: e.descripcion ?? e.DESCRIPCION ?? undefined }));
  },

  // Clases por área (para seleccionar el nombre del evento)
  async listClasesByArea(areaId: string | number): Promise<any[]> {
    const id = typeof areaId === 'string' ? Number(areaId) : areaId;
    return fetchJSON<any[]>(`${API_BASE_URL}/eventos/clases/area/${id}`, { method: 'GET' });
  },

  async listEventos(): Promise<AdminEvent[]> {
    const session = readStoredSession();
    const areaId = session?.usuario.empleado?.idArea;
    if (areaId) {
      const data = await fetchJSON<any[]>(`${API_BASE_URL}/eventos/evento/area/${areaId}`, {
        method: 'GET',
      });
      const eventos = data.map(mapEvento);
      const nextSession: AdminUserSession = {
        usuario: session.usuario,
        eventos,
      };
      persistSession(nextSession);
      return eventos;
    }

    if (session?.eventos?.length) {
      return session.eventos.map((evento) => ({ ...evento }));
    }

    return ADMIN_EVENTOS.map((evento) => ({ ...evento }));
  },

  async createEvento(values: any): Promise<AdminEvent> {
    const session = readStoredSession();
    const idUsuario = session?.usuario?.id ?? undefined;
    const diasSemanaStr = Array.isArray(values?.diasSemana) ? values.diasSemana.join(',') : values?.diasSemana ?? '';
    const direccionFinal = [values?.aldeaNombre, values?.direccion].filter(Boolean).join(', ');
    
    // Subir imagen si existe archivo
    let imagenUrl = values?.imagen ?? undefined;
    if (values?.imagenFile) {
      try {
        const formData = new FormData();
        formData.append('imagen', values.imagenFile);
        
        const uploadResponse = await fetch(`${API_BASE_URL}/eventos/upload/imagen`, {
          method: 'POST',
          body: formData,
        });
        
        if (uploadResponse.ok) {
          const uploadData = await uploadResponse.json();
          // Guardar solo la ruta relativa (sin API_BASE_URL)
          imagenUrl = uploadData.url;
        }
      } catch (error) {
        console.error('Error al subir imagen:', error);
      }
    }
    
    const payload = {
      nombreEvento: values?.nombre ?? '',
      descripcion: values?.descripcion ?? '',
      tipoEvento: values?.tipoEvento ?? (values?.terapiaOClase === 'clase' ? 'CLASE' : 'EVENTO'),
      idClase: values?.claseId ? Number(values.claseId) : undefined,
      diasSemana: diasSemanaStr,
      idMunicipio: values?.municipioId ? Number(values.municipioId) : undefined,
      direccion: direccionFinal,
      fechaInicio: values?.fechaInicio ?? '',
      fechaFin: values?.fechaFin ?? '',
      horaInicio: values?.horaInicio ?? '',
      horaFin: values?.horaFin ?? '',
      cuposDisponibles: values?.cuposDisponibles ?? values?.cuposTotales ?? 0,
      cuposTotales: values?.cuposTotales ?? 0,
      imagenUrl,
      idUsuario,
      idRegional: values?.idRegional ? Number(values.idRegional) : undefined,
      cantidadInvPermitidos: values?.cantidadInvitados ? Number(values.cantidadInvitados) : undefined,
    };

    const data = await fetchJSON<any>(`${API_BASE_URL}/eventos/evento`, {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    return mapEvento(data);
  },

  async updateEvento(id: string, values: any): Promise<AdminEvent> {
    const session = readStoredSession();
    const idUsuario = session?.usuario?.id ?? undefined;
    const diasSemanaStr = Array.isArray(values?.diasSemana) ? values.diasSemana.join(',') : values?.diasSemana ?? '';
    const direccionFinal = [values?.aldeaNombre, values?.direccion].filter(Boolean).join(', ');
    
    // Subir imagen si existe archivo nuevo
    let imagenUrl = values?.imagen ?? undefined;
    if (values?.imagenFile) {
      try {
        const formData = new FormData();
        formData.append('imagen', values.imagenFile);
        
        const uploadResponse = await fetch(`${API_BASE_URL}/eventos/upload/imagen`, {
          method: 'POST',
          body: formData,
        });
        
        if (uploadResponse.ok) {
          const uploadData = await uploadResponse.json();
          // Guardar solo la ruta relativa (sin API_BASE_URL)
          imagenUrl = uploadData.url;
        }
      } catch (error) {
        console.error('Error al subir imagen:', error);
      }
    }
    
    const payload: any = {
      nombreEvento: values?.nombre ?? '',
      descripcion: values?.descripcion ?? '',
      tipoEvento: values?.tipoEvento ?? (values?.terapiaOClase === 'clase' ? 'CLASE' : 'EVENTO'),
      diasSemana: diasSemanaStr,
      direccion: direccionFinal,
      fechaInicio: values?.fechaInicio ?? '',
      fechaFin: values?.fechaFin ?? '',
      horaInicio: values?.horaInicio ?? '',
      horaFin: values?.horaFin ?? '',
      cuposDisponibles: values?.cuposDisponibles ?? 0,
      cuposTotales: values?.cuposTotales ?? 0,
      idUsuario,
    };

    // Agregar imagen solo si se proporciona en base64 (nueva imagen)
    if (imagenUrl && imagenUrl.startsWith('data:')) {
      payload.imagenBase64 = imagenUrl;
    }

    // Agregar campos opcionales solo si existen y tienen valores válidos
    if (values?.idMunicipio && Number(values.idMunicipio) > 0) {
      payload.idMunicipio = Number(values.idMunicipio);
    } else if (values?.municipioId && Number(values.municipioId) > 0) {
      payload.idMunicipio = Number(values.municipioId);
    }
    
    if (values?.claseId) {
      payload.idClase = Number(values.claseId);
    }
    if (values?.idRegional) {
      payload.idRegional = Number(values.idRegional);
    }
    if (values?.cantidadInvitados) {
      payload.cantidadInvPermitidos = Number(values.cantidadInvitados);
    }

    const data = await fetchJSON<any>(`${API_BASE_URL}/eventos/evento/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(payload),
    });
    return mapEvento(data);
  },

  async listDocentes(): Promise<AdminDocente[]> {
    return ADMIN_DOCENTES.map((docente) => ({ ...docente }));
  },

  async listRegistros(): Promise<AdminRegistro[]> {
    return ADMIN_REGISTROS.map((registro) => ({ ...registro }));
  },

  // Departamentos (mock actual) → preferir full desde BD
  async listDepartamentos(): Promise<string[]> {
    return [...ADMIN_DEPARTAMENTOS];
  },

  async listDepartamentosFull(): Promise<any[]> {
    return fetchJSON<any[]>(`${API_BASE_URL}/eventos/departamentos`, { method: 'GET' });
  },

  async listMunicipiosByDepartamento(departamentoId: string): Promise<any[]> {
    return fetchJSON<any[]>(`${API_BASE_URL}/eventos/municipios/departamento/${departamentoId}`, { method: 'GET' });
  },

  async listAldeasByMunicipio(municipioId: string): Promise<any[]> {
    return fetchJSON<any[]>(`${API_BASE_URL}/eventos/aldeas/municipio/${municipioId}`, { method: 'GET' });
  },

  async listGruposEtnicos(): Promise<string[]> {
    return [...ADMIN_GRUPOS_ETNICOS];
  },
};
