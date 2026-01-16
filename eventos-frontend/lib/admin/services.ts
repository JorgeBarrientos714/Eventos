import { ADMIN_DEPARTAMENTOS, ADMIN_DOCENTES, ADMIN_EVENTOS, ADMIN_GRUPOS_ETNICOS, ADMIN_REGISTROS } from './mockData';
import {
  AdminDocente,
  AdminEvent,
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
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000';

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
  return {
    id: String(evento?.id ?? evento?.ID_EVENTO ?? Date.now()),
    nombre: evento?.nombreEvento ?? evento?.NOMBRE_EVENTO ?? 'Evento',
    descripcion: evento?.descripcion ?? '',
    regional: evento?.regional?.nombres ?? evento?.REGIONAL ?? 'N/D',
    areaId: area ? String(area.id ?? area.ID_AREA) : '',
    areaNombre: area?.nombres ?? area?.NOMBRE_AREA ?? 'Sin área',
    terapiaOClase: 'clase',
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

  async listDocentes(): Promise<AdminDocente[]> {
    return ADMIN_DOCENTES.map((docente) => ({ ...docente }));
  },

  async listRegistros(): Promise<AdminRegistro[]> {
    return ADMIN_REGISTROS.map((registro) => ({ ...registro }));
  },

  async listDepartamentos(): Promise<string[]> {
    return [...ADMIN_DEPARTAMENTOS];
  },

  async listGruposEtnicos(): Promise<string[]> {
    return [...ADMIN_GRUPOS_ETNICOS];
  },
};
