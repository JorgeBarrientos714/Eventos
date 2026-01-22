// Módulo: frontend-admin
// Función: Tablero de gestión de eventos (listar, registrar, reportes)
// Relacionados: AdminLayout, AdminGuard, EventForm, RegisterModal, ReportsView, lib/admin/services.ts
// Rutas/Endpoints usados: delega en adminServices (eventos/areas/evento/area)
// Notas: No se renombra para mantener imports existentes.
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Plus, Users, ClipboardList, Edit, FileBarChart2 } from 'lucide-react';
import { adminServices } from '../../lib/admin/services';
import { AdminArea, AdminDocente, AdminEvent, AdminRegistro } from '../../lib/admin/types';
import { AdminLayout } from './AdminLayout';
import { EventForm, AdminEventFormValues } from './EventForm';
import { RegisterModal } from './RegisterModal';
import { ReportsView } from './ReportsView';

interface ActiveViewState {
  type: 'list' | 'form' | 'reports';
}

interface FormViewState extends ActiveViewState {
  type: 'form';
  target: AdminEvent | null;
}

interface ReportsViewState extends ActiveViewState {
  type: 'reports';
}

interface RegisterState {
  isOpen: boolean;
  evento: AdminEvent | null;
}

export function AdminEventsDashboard() {
  const [loading, setLoading] = useState(true);
  const [areas, setAreas] = useState<AdminArea[]>([]);
  const [departamentos, setDepartamentos] = useState<string[]>([]);
  const [gruposEtnicos, setGruposEtnicos] = useState<string[]>([]);
  const [eventos, setEventos] = useState<AdminEvent[]>([]);
  const [docentes, setDocentes] = useState<AdminDocente[]>([]);
  const [registros, setRegistros] = useState<AdminRegistro[]>([]);
  type ViewState = ActiveViewState | FormViewState | ReportsViewState;
  const [view, setView] = useState<ViewState>({ type: 'list' });
  const [registerState, setRegisterState] = useState<RegisterState>({ isOpen: false, evento: null });

  useEffect(() => {
    let isMounted = true;
    async function loadInitialData() {
      try {
        const [areasResponse, departamentosResponse, gruposResponse, eventosResponse, docentesResponse, registrosResponse] =
          await Promise.all([
            adminServices.listAreas(),
            adminServices.listDepartamentos(),
            adminServices.listGruposEtnicos(),
            adminServices.listEventos(),
            adminServices.listDocentes(),
            adminServices.listRegistros(),
          ]);
        if (!isMounted) return;
        setAreas(areasResponse);
        setDepartamentos(departamentosResponse);
        setGruposEtnicos(gruposResponse);
        setEventos(eventosResponse);
        setDocentes(docentesResponse);
        setRegistros(registrosResponse);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }
    loadInitialData();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleCreateEvent = () => {
    const state: FormViewState = { type: 'form', target: null };
    setView(state);
  };

  const handleEditEvent = (evento: AdminEvent) => {
    const state: FormViewState = { type: 'form', target: evento };
    setView(state);
  };

  const handleShowReports = () => {
    const state: ReportsViewState = { type: 'reports' };
    setView(state);
  };

  const handleFormSubmit = async (values: AdminEventFormValues) => {
    // Detectar si es edición o creación
    const isEdit = view.type === 'form' && (view as FormViewState).target !== null;
    
    if (isEdit && view.type === 'form') {
      // Actualizar evento existente
      const formView = view as FormViewState;
      await adminServices.updateEvento(formView.target!.id, values);
    } else {
      // Crear nuevo evento
      await adminServices.createEvento(values);
    }
    
    // Refrescar lista de eventos
    const refreshed = await adminServices.listEventos();
    setEventos(refreshed);
    setView({ type: 'list' });
  };

  const handleCloseForm = () => {
    setView({ type: 'list' });
  };

  const handleOpenRegister = (evento: AdminEvent) => {
    setRegisterState({ isOpen: true, evento });
  };

  const handleCloseRegister = () => {
    setRegisterState({ isOpen: false, evento: null });
  };

  const handleRegisterDocente = useCallback(
    async (
      eventoId: string,
      { dni, docente, isExisting }: { dni: string; docente: AdminDocente; isExisting: boolean },
    ) => {
      setDocentes((prev) => {
        if (isExisting) {
          return prev.map((item) => (item.dni === docente.dni ? docente : item));
        }
        return [...prev, docente];
      });

      setEventos((prev) =>
        prev.map((evento) => {
          if (evento.id !== eventoId) return evento;
          if (evento.cuposDisponibles <= 0) {
            return evento;
          }
          return { ...evento, cuposDisponibles: Math.max(evento.cuposDisponibles - 1, 0) };
        }),
      );

      setRegistros((prev) => [
        ...prev,
        {
          id: `r${Date.now()}`,
          eventoId,
          dni,
          fechaRegistro: new Date().toISOString(),
        },
      ]);
    },
    [],
  );

  const eventosAgrupadosPorRegional = useMemo(() => {
    return eventos.reduce<Record<string, AdminEvent[]>>((acc, evento) => {
      acc[evento.regional] = acc[evento.regional] ? [...acc[evento.regional], evento] : [evento];
      return acc;
    }, {});
  }, [eventos]);

  if (loading) {
    return (
      <AdminLayout title="Cargando eventos">
        <div className="flex h-[320px] items-center justify-center">
          <div className="h-16 w-16 animate-spin rounded-full border-4 border-[#0d7d6e]/20 border-t-[#0d7d6e]" />
        </div>
      </AdminLayout>
    );
  }

  if (view.type === 'reports') {
    return (
      <AdminLayout
        title="Reportes de eventos"
        description="Analiza la ocupación y descarga reportes consolidados en CSV"
      >
        <ReportsView eventos={eventos} registros={registros} docentes={docentes} onBack={() => setView({ type: 'list' })} />
      </AdminLayout>
    );
  }

  if (view.type === 'form') {
    const formView = view as FormViewState;
    return (
      <AdminLayout
        title={formView.target ? 'Editar evento' : 'Nuevo evento'}
        description={formView.target ? 'Actualiza la información del evento seleccionado.' : 'Completa los datos para publicar un nuevo evento.'}
      >
        <EventForm
          evento={formView.target ?? undefined}
          areas={areas}
          departamentos={departamentos}
          onCancel={handleCloseForm}
          onSubmit={(values) => handleFormSubmit({ ...values, id: formView.target?.id })}
        />
      </AdminLayout>
    );
  }

  return (
    <AdminLayout
      title="Gestión de eventos"
      description="Administra la programación, realiza inscripciones manuales y descarga reportes de asistencia."
    >
      <div className="flex flex-col gap-6">
        <div className="grid gap-4 md:grid-cols-3">
          <article className="rounded-2xl border border-gray-100 bg-gradient-to-br from-[#0d7d6e] to-[#0ea68f] p-6 text-white shadow-sm">
            <p className="text-sm text-white/80">Eventos activos</p>
            <p className="mt-3 text-3xl font-semibold">{eventos.filter((evento) => evento.estado === 'activo').length}</p>
            <p className="mt-3 flex items-center gap-2 text-sm text-white/70">
              <ClipboardList className="h-4 w-4" />
              Monitorea cupos y estados
            </p>
          </article>
          <article className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
            <p className="text-sm font-semibold text-gray-500">Registros totales</p>
            <p className="mt-3 text-3xl font-semibold text-gray-800">{registros.length}</p>
            <p className="mt-3 flex items-center gap-2 text-sm text-gray-500">
              <Users className="h-4 w-4 text-[#0d7d6e]" />
              Último registro {registros.length ? new Date(registros[registros.length - 1].fechaRegistro).toLocaleDateString('es-HN') : 'N/D'}
            </p>
          </article>
          <article className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
            <p className="text-sm font-semibold text-gray-500">Zonas cubiertas</p>
            <p className="mt-3 text-3xl font-semibold text-gray-800">{Object.keys(eventosAgrupadosPorRegional).length}</p>
            <p className="mt-3 flex items-center gap-2 text-sm text-gray-500">
              <FileBarChart2 className="h-4 w-4 text-[#0d7d6e]" />
              Accede a reportes detallados
            </p>
          </article>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3">
          <h3 className="text-lg font-semibold text-gray-800">Listado de eventos</h3>
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={handleShowReports}
              className="inline-flex items-center gap-2 rounded-full border border-[#0d7d6e] px-4 py-2 text-sm font-semibold text-[#0d7d6e] transition hover:bg-[#0d7d6e] hover:text-white"
            >
              <FileBarChart2 className="h-4 w-4" />
              Ver reportes
            </button>
            <button
              type="button"
              onClick={handleCreateEvent}
              className="inline-flex items-center gap-2 rounded-full bg-[#0d7d6e] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#0b6a60]"
            >
              <Plus className="h-4 w-4" />
              Nuevo evento
            </button>
          </div>
        </div>

        <div className="overflow-hidden rounded-2xl border border-gray-100 shadow-sm">
          <div className="w-full overflow-x-auto">
          <table className="min-w-[900px] md:min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-gray-50 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
              <tr>
                <th className="px-4 py-3">Evento</th>
                <th className="px-4 py-3">Regional</th>
                <th className="px-4 py-3">Período</th>
                <th className="px-4 py-3">Cupos</th>
                <th className="px-4 py-3">Estado</th>
                <th className="px-4 py-3 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {eventos.map((evento) => {
                const cuposUsados = evento.cuposTotales - evento.cuposDisponibles;
                const capacidad = evento.cuposTotales === 0 ? 0 : Math.round((cuposUsados / evento.cuposTotales) * 100);
                const estadoColor =
                  evento.estado === 'activo'
                    ? 'bg-emerald-100 text-emerald-700'
                    : evento.estado === 'pospuesto'
                      ? 'bg-amber-100 text-amber-700'
                      : 'bg-rose-100 text-rose-700';
                return (
                  <tr key={evento.id} className="hover:bg-gray-50">
                    <td className="px-4 py-4">
                      <div className="font-semibold text-gray-800">{evento.nombre}</div>
                      <p className="text-xs text-gray-500">{evento.areaNombre}</p>
                    </td>
                    <td className="px-4 py-4 text-gray-600">{evento.regional}</td>
                    <td className="px-4 py-4 text-gray-600">
                      <div>{evento.fechaInicio}</div>
                      <div className="text-xs text-gray-400">{evento.fechaFin}</div>
                    </td>
                    <td className="px-4 py-4 text-gray-600">
                      <div className="flex items-center gap-2">
                        <div className="h-2 flex-1 rounded-full bg-gray-200">
                          <div
                            className={`h-2 rounded-full ${capacidad > 85 ? 'bg-red-500' : capacidad > 55 ? 'bg-amber-500' : 'bg-emerald-500'}`}
                            style={{ width: `${Math.min(capacidad, 100)}%` }}
                          />
                        </div>
                        <span className="text-xs font-semibold text-gray-500">{evento.cuposDisponibles}/{evento.cuposTotales}</span>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${estadoColor}`}>
                        {evento.estado}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex flex-wrap justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => handleOpenRegister(evento)}
                          className="inline-flex items-center gap-1 rounded-full border border-[#0d7d6e]/30 px-3 py-1.5 text-xs font-semibold text-[#0d7d6e] transition hover:border-[#0d7d6e] hover:bg-[#0d7d6e]/10"
                        >
                          <Users className="h-3.5 w-3.5" />
                          Registrar
                        </button>
                        <button
                          type="button"
                          onClick={() => handleEditEvent(evento)}
                          className="inline-flex items-center gap-1 rounded-full border border-gray-300 px-3 py-1.5 text-xs font-semibold text-gray-600 transition hover:border-gray-400 hover:bg-white"
                        >
                          <Edit className="h-3.5 w-3.5" />
                          Editar
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          </div>
        </div>
      </div>

      {registerState.isOpen && registerState.evento && (
        <RegisterModal
          evento={registerState.evento}
          docentes={docentes}
          gruposEtnicos={gruposEtnicos}
          onClose={handleCloseRegister}
          onRegister={async (payload) => {
            if (registerState.evento && registerState.evento.cuposDisponibles <= 0) {
              throw new Error('No hay cupos disponibles para este evento.');
            }
            if (!registerState.evento) {
              throw new Error('No se encontró el evento seleccionado.');
            }
            await handleRegisterDocente(registerState.evento.id, payload);
            return undefined;
          }}
        />
      )}
    </AdminLayout>
  );
}
