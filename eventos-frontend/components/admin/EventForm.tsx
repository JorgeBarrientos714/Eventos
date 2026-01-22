// Módulo: frontend-admin
// Función: Formulario UI para crear/editar eventos.
// Responsabilidades: UI + preparación de payload. Carga dinámica de listas
// (clases, ubicación jerárquica) desde servicios; filtra por usuario logueado (área).
// Flujo: Backend (API) → services → Form → onSubmit.
// Relacionados: AdminEventsDashboard, AdminLayout, lib/admin/types.ts, lib/admin/services.ts, context/AdminAuthContext.tsx
// Notas: No se renombra para preservar imports actuales.
import { FormEvent, useEffect, useMemo, useState } from 'react';
import { AdminArea, AdminEvent } from '../../lib/admin/types';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { adminServices } from '../../lib/admin/services';

export interface AdminEventFormValues extends Omit<AdminEvent, 'id'> {
  id?: string;
  // FKs para flujo 100% dinámico por relaciones
  claseId?: string;
  departamentoId?: string;
  municipioId?: string;
  aldeaId?: string;
  idRegional?: string;
  aldeaNombre?: string;
}

interface EventFormProps {
  evento?: AdminEvent;
  areas: AdminArea[];
  // Departamentos (mock) — deprecado. El componente ahora los carga del backend
  // con fallback al prop si la API aún no existe.
  departamentos?: string[];
  onCancel: () => void;
  onSubmit: (values: AdminEventFormValues) => void;
}

const diasSemanaOptions = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

const emptyForm: AdminEventFormValues = {
  nombre: '',
  descripcion: '',
  regional: '',
  areaId: '',
  areaNombre: '',
  terapiaOClase: 'terapia',
  diasSemana: [],
  departamento: '',
  municipio: '',
  direccion: '',
  fechaInicio: '',
  fechaFin: '',
  horaInicio: '',
  horaFin: '',
  cuposDisponibles: 0,
  cuposTotales: 0,
  imagen: '',
  estado: 'activo',
  claseId: '',
  departamentoId: '',
  municipioId: '',
  aldeaId: '',
  idRegional: '',
};

// Tipos locales para listas dinámicas
interface OptionItem { id: string; nombre: string }

export function EventForm({ evento, areas, departamentos, onCancel, onSubmit }: EventFormProps) {
  const { session } = useAdminAuth();
  const [formData, setFormData] = useState<AdminEventFormValues>(emptyForm);
  const isEdit = Boolean(evento);

  // Listas dinámicas
  const [clases, setClases] = useState<OptionItem[]>([]);
  const [departamentosOpts, setDepartamentosOpts] = useState<OptionItem[]>([]);
  const [municipiosOpts, setMunicipiosOpts] = useState<OptionItem[]>([]);
  const [aldeasOpts, setAldeasOpts] = useState<OptionItem[]>([]);
  const [regionalesOpts, setRegionalesOpts] = useState<OptionItem[]>([]);
  const [estadosOpts, setEstadosOpts] = useState<OptionItem[]>([]);
  
  // Control de invitados
  const [permitirInvitados, setPermitirInvitados] = useState(false);
  const [cantidadInvitados, setCantidadInvitados] = useState(0);
  
  // Control de imagen
  const [imagenPreview, setImagenPreview] = useState<string>('');
  const [imagenBase64, setImagenBase64] = useState<string>('');

  useEffect(() => {
    if (evento) {
      // Castear a AdminEventFormValues para acceder a propiedades extras
      const eventoForm = evento as AdminEventFormValues;
      
      // Extraer aldeaNombre de dirección si existe (formato: "Aldea, dirección extra")
      let aldeaNombreExtraido = '';
      let direccionExtra = eventoForm.direccion;
      if (eventoForm.direccion && eventoForm.direccion.includes(',')) {
        const partes = eventoForm.direccion.split(',');
        aldeaNombreExtraido = partes[0].trim();
        direccionExtra = partes.slice(1).join(',').trim();
      }
      
      // Asegurar valores definidos para evitar controlled/uncontrolled warnings
      const eventoData = {
        ...eventoForm,
        claseId: eventoForm.claseId ?? '',
        departamentoId: eventoForm.departamentoId ?? '',
        municipioId: eventoForm.municipioId ?? '',
        aldeaId: eventoForm.aldeaId ?? '',
        idRegional: eventoForm.idRegional ?? '',
        aldeaNombre: aldeaNombreExtraido,
        direccion: direccionExtra,
      };
      setFormData((prev) => ({ ...prev, ...eventoData }));
      
      // Cargar aldeas si hay municipio seleccionado
      if (eventoData.municipioId) {
        (async () => {
          try {
            const data = await adminServices.listAldeasByMunicipio(eventoData.municipioId);
            setAldeasOpts(data.map((a: any) => ({ id: String(a.id ?? a.ID_ALDEA), nombre: a.nombreAldea ?? a.NOMBRE_ALDEA ?? 'Aldea' })));
            
            // Si hay aldeaNombre extraído, intentar encontrar su ID
            if (aldeaNombreExtraido) {
              const aldea = data.find((a: any) => 
                (a.nombreAldea ?? a.NOMBRE_ALDEA ?? '').toLowerCase() === aldeaNombreExtraido.toLowerCase()
              );
              if (aldea) {
                setFormData((prev) => ({ ...prev, aldeaId: String(aldea.id ?? aldea.ID_ALDEA) }));
              }
            }
          } catch (error) {
            console.error('Error cargando aldeas:', error);
          }
        })();
      }
      
      // Cargar estado de invitados si existe
      const invitadosPermitidos = (evento as any).cantidadInvitados ?? (evento as any).cantidadInvPermitidos ?? 0;
      if (invitadosPermitidos > 0) {
        setPermitirInvitados(true);
        setCantidadInvitados(invitadosPermitidos);
      } else {
        setPermitirInvitados(false);
        setCantidadInvitados(0);
      }
      
      // Cargar preview de imagen si existe
      if (evento.imagen) {
        // Construir URL completa si es ruta relativa
        const API_BASE_URL = typeof window !== 'undefined' 
          ? process.env.NEXT_PUBLIC_API_URL ?? `http://${window.location.hostname}:3000`
          : 'http://localhost:3000';
        const imageUrl = evento.imagen.startsWith('http') 
          ? evento.imagen 
          : `${API_BASE_URL}${evento.imagen}`;
        setImagenPreview(imageUrl);
        setImagenBase64('');
      }
    } else {
      setFormData(emptyForm);
      setPermitirInvitados(false);
      setCantidadInvitados(0);
      setImagenPreview('');
      setImagenBase64('');
    }
  }, [evento]);

  // Bloqueo de área por usuario logueado (control de acceso)
  useEffect(() => {
    const areaIdFromUser = session?.usuario?.empleado?.idArea ? String(session.usuario.empleado.idArea) : '';
    const areaNombreFromUser = session?.usuario?.empleado?.areaNombre ?? '';
    if (areaIdFromUser) {
      setFormData((prev) => ({ ...prev, areaId: areaIdFromUser, areaNombre: areaNombreFromUser }));
    }
  }, [session]);

  const selectedArea = useMemo(
    () => areas.find((area) => area.id === formData.areaId),
    [areas, formData.areaId],
  );

  useEffect(() => {
    if (selectedArea) {
      setFormData((prev) => ({ ...prev, areaNombre: selectedArea.nombre }));
    }
  }, [selectedArea]);

  // Carga de clases según área
  useEffect(() => {
    let active = true;
    async function loadClases() {
      if (!formData.areaId) { setClases([]); return; }
      try {
        const data = await adminServices.listClasesByArea(formData.areaId);
        if (!active) return;
        setClases(data.map((c: any) => ({ id: String(c.id ?? c.ID_CLASE), nombre: c.nombre ?? c.NOMBRE_CLASE ?? 'Clase' })));
      } catch {
        if (active) setClases([]);
      }
    }
    loadClases();
    return () => { active = false; };
  }, [formData.areaId]);

  // Carga de regionales
  useEffect(() => {
    let active = true;
    async function loadRegionales() {
      try {
        const data = await adminServices.listRegionales();
        if (!active) return;
        setRegionalesOpts(data.map((r) => ({ id: r.id, nombre: r.nombre })));
      } catch {
        if (active) setRegionalesOpts([]);
      }
    }
    loadRegionales();
    return () => { active = false; };
  }, []);

  // Carga de estados de evento desde BD
  useEffect(() => {
    let active = true;
    async function loadEstados() {
      try {
        const data = await adminServices.listEstadosEvento();
        if (!active) return;
        setEstadosOpts(data.map((e) => ({ id: e.id, nombre: e.nombre })));
      } catch {
        if (active) setEstadosOpts([]);
      }
    }
    loadEstados();
    return () => { active = false; };
  }, []);

  // Departamentos (API → fallback a prop)
  useEffect(() => {
    let active = true;
    async function loadDepartamentos() {
      try {
        const data = await adminServices.listDepartamentosFull();
        if (!active) return;
        setDepartamentosOpts(data.map((d: any) => ({ id: String(d.id ?? d.ID_DEPARTAMENTO), nombre: d.nombres ?? d.NOMBRES ?? 'Departamento' })));
      } catch {
        if (active) setDepartamentosOpts((departamentos ?? []).map((nombre, idx) => ({ id: String(idx + 1), nombre })));
      }
    }
    loadDepartamentos();
    return () => { active = false; };
  }, [departamentos]);

  // Municipios por departamento
  useEffect(() => {
    let active = true;
    async function loadMunicipios() {
      const depId = formData.departamentoId;
      if (!depId) { 
        setMunicipiosOpts([]);
        setAldeasOpts([]);
        return;
      }
      try {
        const data = await adminServices.listMunicipiosByDepartamento(depId);
        if (!active) return;
        setMunicipiosOpts(data.map((m: any) => ({ id: String(m.id ?? m.ID_MUNICIPIO), nombre: m.nombres ?? m.NOMBRES_MUNICIPIO ?? 'Municipio' })));
      } catch {
        if (active) setMunicipiosOpts([]);
      }
    }
    loadMunicipios();
    return () => { active = false; };
  }, [formData.departamentoId]);

  // Aldeas por municipio
  useEffect(() => {
    let active = true;
    async function loadAldeas() {
      const munId = formData.municipioId;
      if (!munId) { 
        setAldeasOpts([]);
        return;
      }
      try {
        const data = await adminServices.listAldeasByMunicipio(munId);
        if (!active) return;
        setAldeasOpts(data.map((a: any) => ({ id: String(a.id ?? a.ID_ALDEA), nombre: a.nombreAldea ?? a.NOMBRE_ALDEA ?? 'Aldea' })));
      } catch {
        if (active) setAldeasOpts([]);
      }
    }
    loadAldeas();
    return () => { active = false; };
  }, [formData.municipioId]);

  const handleToggleDia = (dia: string) => {
    setFormData((prev) => ({
      ...prev,
      diasSemana: prev.diasSemana.includes(dia)
        ? prev.diasSemana.filter((d) => d !== dia)
        : [...prev.diasSemana, dia],
    }));
  };

  const handleImagenChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagenPreview(reader.result as string);
        setImagenBase64(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();

    if (!formData.claseId || !formData.departamentoId || !formData.municipioId) {
      return;
    }

    const payload: AdminEventFormValues = {
      ...formData,
      cuposDisponibles: isEdit ? formData.cuposDisponibles : formData.cuposTotales,
    };

    // Agregar cantidad de invitados permitidos si se habilitó
    if (permitirInvitados) {
      (payload as any).cantidadInvitados = cantidadInvitados;
    }

    if (imagenBase64) {
      (payload as any).imagenBase64 = imagenBase64;
    }

    onSubmit(payload);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-600">Clase (nombre del evento)</label>
          <select
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-[#0d7d6e] focus:outline-none focus:ring-2 focus:ring-[#0d7d6e]/20"
            value={formData.claseId ?? ''}
            onChange={(e) => {
              const claseId = e.target.value || undefined;
              const clase = clases.find((c) => c.id === claseId);
              setFormData((prev) => ({
                ...prev,
                claseId,
                nombre: clase?.nombre ?? '',
              }));
            }}
            required
          >
            <option value="">Selecciona una clase</option>
            {clases.map((c) => (
              <option key={c.id} value={c.id}>{c.nombre}</option>
            ))}
          </select>
          <p className="text-xs text-gray-500">Se lista según el área del usuario.</p>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-600">Regional</label>
          <select
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-[#0d7d6e] focus:outline-none focus:ring-2 focus:ring-[#0d7d6e]/20"
            value={formData.idRegional ?? ''}
            onChange={(e) => {
              const idRegional = e.target.value || undefined;
              const reg = regionalesOpts.find((r) => r.id === idRegional);
              setFormData((prev) => ({ ...prev, regional: reg?.nombre ?? '', idRegional }));
            }}
          >
            <option value="">Selecciona una regional</option>
            {regionalesOpts.map((r) => (
              <option key={r.id} value={r.id}>{r.nombre}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-semibold text-gray-600">Descripción</label>
        <textarea
          className="min-h-[96px] w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-[#0d7d6e] focus:outline-none focus:ring-2 focus:ring-[#0d7d6e]/20"
          value={formData.descripcion}
          onChange={(e) => setFormData((prev) => ({ ...prev, descripcion: e.target.value }))}
          placeholder="Describe los objetivos del evento"
        />
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-600">Área</label>
          {formData.areaId ? (
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center rounded-full bg-gray-100 px-3 py-1 text-sm font-semibold text-gray-700">
                {formData.areaNombre || selectedArea?.nombre || 'Área asignada'}
              </span>
              <span className="text-xs text-gray-500">Asignada por sesión (no editable).</span>
            </div>
          ) : (
            <select
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-[#0d7d6e] focus:outline-none focus:ring-2 focus:ring-[#0d7d6e]/20"
              value={formData.areaId}
              onChange={(e) => setFormData((prev) => ({ ...prev, areaId: e.target.value }))}
              required
            >
              <option value="">Selecciona un área</option>
              {areas.map((area) => (
                <option key={area.id} value={area.id}>
                  {area.nombre}
                </option>
              ))}
            </select>
          )}
        </div>
        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-600">Tipo de actividad</label>
          <select
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-[#0d7d6e] focus:outline-none focus:ring-2 focus:ring-[#0d7d6e]/20"
            value={formData.terapiaOClase}
            onChange={(e) => setFormData((prev) => ({ ...prev, terapiaOClase: e.target.value as 'terapia' | 'clase' }))}
          >
            <option value="terapia">Terapia</option>
            <option value="clase">Clase</option>
          </select>
          <p className="text-xs text-gray-500">Se filtra en el frontend del docente.</p>
        </div>
      </div>

      <div>
        <p className="text-sm font-semibold text-gray-600">Días de la semana</p>
        <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-4">
          {diasSemanaOptions.map((dia) => {
            const checked = formData.diasSemana.includes(dia);
            return (
              <label
                key={dia}
                className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-sm transition ${
                  checked ? 'border-[#0d7d6e] bg-[#0d7d6e]/10 text-[#0d7d6e]' : 'border-gray-200 text-gray-600'
                }`}
              >
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => handleToggleDia(dia)}
                  className="rounded border-gray-300 text-[#0d7d6e] shadow-sm focus:ring-[#0d7d6e]"
                />
                {dia}
              </label>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-600">Departamento</label>
          <select
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-[#0d7d6e] focus:outline-none focus:ring-2 focus:ring-[#0d7d6e]/20"
            value={formData.departamentoId ?? ''}
            onChange={(e) => {
              const departamentoId = e.target.value || undefined;
              const dep = departamentosOpts.find((d) => d.id === departamentoId);
              setFormData((prev) => ({
                ...prev,
                departamentoId,
                departamento: dep?.nombre ?? '',
                municipioId: undefined,
                municipio: '',
                aldeaId: undefined,
              }));
            }}
            required
          >
            <option value="">Selecciona un departamento</option>
            {departamentosOpts.map((d) => (
              <option key={d.id} value={d.id}>{d.nombre}</option>
            ))}
          </select>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-600">Municipio</label>
          <select
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-[#0d7d6e] focus:outline-none focus:ring-2 focus:ring-[#0d7d6e]/20"
            value={formData.municipioId ?? ''}
            onChange={(e) => {
              const municipioId = e.target.value || undefined;
              const mun = municipiosOpts.find((m) => m.id === municipioId);
              setFormData((prev) => ({
                ...prev,
                municipioId,
                municipio: mun?.nombre ?? '',
                aldeaId: undefined,
              }));
            }}
            required
          >
            <option value="">Selecciona un municipio</option>
            {municipiosOpts.map((m) => (
              <option key={m.id} value={m.id}>{m.nombre}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-600">Aldea</label>
          <select
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-[#0d7d6e] focus:outline-none focus:ring-2 focus:ring-[#0d7d6e]/20"
            value={formData.aldeaId ?? ''}
            onChange={(e) => {
              const aldeaId = e.target.value || undefined;
              const ald = aldeasOpts.find((a) => a.id === aldeaId);
              setFormData((prev) => ({
                ...prev,
                aldeaId,
                aldeaNombre: ald?.nombre ?? '',
                direccion: prev.direccion,
              }));
            }}
          >
            <option value="">Selecciona una aldea</option>
            {aldeasOpts.map((a) => (
              <option key={a.id} value={a.id}>{a.nombre}</option>
            ))}
          </select>
          <p className="text-xs text-gray-500">Especifica la referencia fina en dirección.</p>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-600">Dirección</label>
          <input
            type="text"
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-[#0d7d6e] focus:outline-none focus:ring-2 focus:ring-[#0d7d6e]/20"
            value={formData.direccion}
            onChange={(e) => setFormData((prev) => ({ ...prev, direccion: e.target.value }))}
            placeholder="Referencia específica (ej. Instalaciones INPREMA)"
          />
        </div>
      </div>

      

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-600">Fecha de inicio</label>
          <input
            type="date"
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-[#0d7d6e] focus:outline-none focus:ring-2 focus:ring-[#0d7d6e]/20"
            value={formData.fechaInicio}
            onChange={(e) => setFormData((prev) => ({ ...prev, fechaInicio: e.target.value }))}
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-600">Fecha de finalización</label>
          <input
            type="date"
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-[#0d7d6e] focus:outline-none focus:ring-2 focus:ring-[#0d7d6e]/20"
            value={formData.fechaFin}
            onChange={(e) => setFormData((prev) => ({ ...prev, fechaFin: e.target.value }))}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-600">Hora de inicio</label>
          <input
            type="time"
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-[#0d7d6e] focus:outline-none focus:ring-2 focus:ring-[#0d7d6e]/20"
            value={formData.horaInicio}
            onChange={(e) => setFormData((prev) => ({ ...prev, horaInicio: e.target.value }))}
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-600">Hora de finalización</label>
          <input
            type="time"
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-[#0d7d6e] focus:outline-none focus:ring-2 focus:ring-[#0d7d6e]/20"
            value={formData.horaFin}
            onChange={(e) => setFormData((prev) => ({ ...prev, horaFin: e.target.value }))}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-600">Cupos totales</label>
          <input
            type="number"
            min={1}
            max={300}
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-[#0d7d6e] focus:outline-none focus:ring-2 focus:ring-[#0d7d6e]/20"
            value={formData.cuposTotales}
            onChange={(e) => {
              const total = Math.min(Number(e.target.value) || 0, 300);
              setFormData((prev) => ({
                ...prev,
                cuposTotales: total,
                cuposDisponibles: isEdit ? prev.cuposDisponibles : total,
              }));
            }}
            placeholder="Máximo 300"
          />
          <p className="text-xs text-gray-500">Límite máximo: 300 cupos</p>
        </div>
        {isEdit && (
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-600">Cupos disponibles</label>
            <input
              type="number"
              min={0}
              disabled
              className="w-full rounded-lg border border-gray-200 bg-gray-100 px-3 py-2 text-sm text-gray-600 cursor-not-allowed"
              value={formData.cuposDisponibles}
            />
            <p className="text-xs text-gray-500">Se actualiza automáticamente al registrar docentes</p>
          </div>
        )}
      </div>

      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="permitirInvitados"
            checked={permitirInvitados}
            onChange={(e) => {
              setPermitirInvitados(e.target.checked);
              if (!e.target.checked) {
                setCantidadInvitados(0);
              }
            }}
            className="rounded border-gray-300 text-[#0d7d6e] shadow-sm focus:ring-[#0d7d6e]"
          />
          <label htmlFor="permitirInvitados" className="text-sm font-semibold text-gray-600">
            ¿Permitir invitados?
          </label>
        </div>
        {permitirInvitados && (
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-600">Cantidad de invitados permitidos por docente</label>
            <select
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-[#0d7d6e] focus:outline-none focus:ring-2 focus:ring-[#0d7d6e]/20"
              value={cantidadInvitados}
              onChange={(e) => setCantidadInvitados(Number(e.target.value) || 0)}
            >
              <option value="0">Selecciona cantidad</option>
              {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
                <option key={n} value={n}>{n}</option>
              ))}
            </select>
            <p className="text-xs text-gray-500">Máximo de invitados que puede traer cada docente registrado.</p>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-600">Estado del evento</label>
          <select
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-[#0d7d6e] focus:outline-none focus:ring-2 focus:ring-[#0d7d6e]/20"
            value={formData.estado}
            onChange={(e) => setFormData((prev) => ({ ...prev, estado: e.target.value as AdminEvent['estado'] }))}
          >
            <option value="">Selecciona estado</option>
            {estadosOpts.map((estado) => (
              <option key={estado.id} value={estado.nombre.toLowerCase()}>{estado.nombre}</option>
            ))}
          </select>
          <p className="text-xs text-gray-500">Listado desde BD (clasificación EVENTO).</p>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-600">Imagen del evento</label>
          <input
            type="file"
            accept="image/*"
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-[#0d7d6e] focus:outline-none focus:ring-2 focus:ring-[#0d7d6e]/20"
            onChange={handleImagenChange}
          />
          {imagenPreview && (
            <div className="mt-2 rounded-lg border border-gray-200 p-2">
              <img src={imagenPreview} alt="Preview" className="h-32 w-full object-cover rounded" />
            </div>
          )}
          <p className="text-xs text-gray-500">Formatos: JPG, PNG, GIF, WEBP. Máximo 5MB.</p>
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-full border border-gray-200 px-5 py-2 text-sm font-medium text-gray-600 transition hover:bg-gray-50"
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="rounded-full bg-[#0d7d6e] px-6 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-[#0b6a60]"
        >
          {isEdit ? 'Guardar cambios' : 'Crear evento'}
        </button>
      </div>
    </form>
  );
}
