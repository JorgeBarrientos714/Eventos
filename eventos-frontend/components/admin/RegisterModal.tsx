import { useEffect, useMemo, useState } from 'react';
import { X } from 'lucide-react';
import { AdminDocente, AdminEvent } from '../../lib/admin/types';

interface AdminDocenteFormValues {
  nombre: string;
  telefono: string;
  genero: '' | 'Masculino' | 'Femenino' | 'Otro';
  fechaNacimiento: string;
  discapacidad: '' | 'si' | 'no';
  detalleDiscapacidad: string;
  municipio: string;
  grupoEtnico: string;
}

interface RegisterModalProps {
  evento: AdminEvent;
  docentes: AdminDocente[];
  gruposEtnicos: string[];
  onClose: () => void;
  onRegister: (payload: { dni: string; docente: AdminDocente; isExisting: boolean }) => Promise<void> | void;
}

const emptyForm: AdminDocenteFormValues = {
  nombre: '',
  telefono: '',
  genero: '',
  fechaNacimiento: '',
  discapacidad: '',
  detalleDiscapacidad: '',
  municipio: '',
  grupoEtnico: '',
};

const formatDateInput = (date: string | undefined) => {
  if (!date) return '';
  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return '';
  return parsed.toISOString().split('T')[0];
};

const calculateAge = (birthDate: string) => {
  if (!birthDate) return 0;
  const today = new Date();
  const birth = new Date(birthDate);
  let age = today.getFullYear() - birth.getFullYear();
  const monthDifference = today.getMonth() - birth.getMonth();
  if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birth.getDate())) {
    age -= 1;
  }
  return age;
};

export function RegisterModal({ evento, docentes, gruposEtnicos, onClose, onRegister }: RegisterModalProps) {
  const [dni, setDni] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [docenteEncontrado, setDocenteEncontrado] = useState<AdminDocente | null>(null);
  const [formData, setFormData] = useState<AdminDocenteFormValues>(emptyForm);
  const [status, setStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  useEffect(() => {
    if (docenteEncontrado) {
      setFormData({
        nombre: docenteEncontrado.nombre,
        telefono: docenteEncontrado.telefono,
        genero: docenteEncontrado.genero,
        fechaNacimiento: formatDateInput(docenteEncontrado.fechaNacimiento),
        discapacidad: docenteEncontrado.discapacidad,
        detalleDiscapacidad: docenteEncontrado.detalleDiscapacidad ?? '',
        municipio: docenteEncontrado.municipio,
        grupoEtnico: docenteEncontrado.grupoEtnico,
      });
    } else {
      setFormData(emptyForm);
    }
  }, [docenteEncontrado]);

  const handleSearch = async () => {
    if (!dni.trim()) {
      setStatus({ type: 'error', message: 'Ingresa un número de identidad para continuar.' });
      return;
    }

    setIsSearching(true);
    await new Promise((resolve) => setTimeout(resolve, 250));
    const match = docentes.find((docente) => docente.dni === dni.trim());
    setDocenteEncontrado(match ?? null);
    setIsSearching(false);

    if (!match) {
      setStatus({ type: 'error', message: 'No se encontró información. Completa el formulario manualmente.' });
    } else {
      setStatus(null);
    }
  };

  const isValid = useMemo(() => {
    if (!dni.trim()) return false;
    if (!formData.nombre || !formData.telefono || !formData.genero || !formData.fechaNacimiento) return false;
    if (!formData.municipio || !formData.grupoEtnico || !formData.discapacidad) return false;
    if (formData.discapacidad === 'si' && !formData.detalleDiscapacidad.trim()) return false;
    if (calculateAge(formData.fechaNacimiento) < 18) return false;
    return true;
  }, [dni, formData]);

  const handleSubmit = async () => {
    if (!isValid) {
      setStatus({ type: 'error', message: 'Verifica que todos los campos obligatorios estén completos.' });
      return;
    }

    const docente: AdminDocente = {
      dni: dni.trim(),
      nombre: formData.nombre,
      telefono: formData.telefono,
      genero: formData.genero || 'Masculino',
      fechaNacimiento: formData.fechaNacimiento,
      discapacidad: formData.discapacidad || 'no',
      detalleDiscapacidad: formData.discapacidad === 'si' ? formData.detalleDiscapacidad : undefined,
      municipio: formData.municipio,
      grupoEtnico: formData.grupoEtnico,
    };

    try {
      await onRegister({ dni: docente.dni, docente, isExisting: Boolean(docenteEncontrado) });
      setStatus({ type: 'success', message: 'Registro completado con éxito.' });
      setTimeout(() => {
        onClose();
      }, 1200);
    } catch (error) {
      setStatus({ type: 'error', message: error instanceof Error ? error.message : 'No se pudo registrar.' });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 py-6">
      <div className="relative w-full max-w-3xl overflow-hidden rounded-2xl bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-800">Registrar docente</h3>
            <p className="text-sm text-gray-500">{evento.nombre} · {evento.fechaInicio}</p>
          </div>
          <button onClick={onClose} className="rounded-full p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="grid gap-6 px-6 py-6 md:grid-cols-5">
          <section className="md:col-span-5 space-y-3 rounded-xl bg-[#f5fbfa] p-4">
              <p className="text-sm font-semibold text-gray-700">Cupos disponibles</p>
              <p className="text-2xl font-bold text-[#0d7d6e]">{evento.cuposDisponibles}</p>
              <p className="text-xs text-gray-500">De {evento.cuposTotales} cupos totales</p>
          </section>

          <section className="md:col-span-5">
            <label className="text-sm font-semibold text-gray-600">Número de identidad</label>
            <div className="mt-2 flex flex-col gap-3 sm:flex-row">
              <input
                type="text"
                value={dni}
                onChange={(e) => {
                  setDni(e.target.value.replace(/[^0-9]/g, ''));
                  setDocenteEncontrado(null);
                }}
                className="flex-1 rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-[#0d7d6e] focus:outline-none focus:ring-2 focus:ring-[#0d7d6e]/20"
                placeholder="0801..."
              />
              <button
                type="button"
                onClick={handleSearch}
                disabled={!dni || isSearching}
                className="inline-flex items-center justify-center rounded-full bg-[#0d7d6e] px-5 py-2 text-sm font-semibold text-white transition hover:bg-[#0b6a60] disabled:cursor-not-allowed disabled:bg-gray-300"
              >
                {isSearching ? 'Buscando…' : 'Buscar docente'}
              </button>
            </div>
          </section>

          {(docenteEncontrado || dni) && (
            <section className="md:col-span-5 space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-gray-600">Nombre completo</label>
                  <input
                    type="text"
                    value={formData.nombre}
                    onChange={(e) => setFormData((prev) => ({ ...prev, nombre: e.target.value.toUpperCase() }))}
                    className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm uppercase tracking-wide focus:border-[#0d7d6e] focus:outline-none focus:ring-2 focus:ring-[#0d7d6e]/20"
                    placeholder="JUAN PÉREZ"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-gray-600">Teléfono</label>
                  <input
                    type="tel"
                    value={formData.telefono}
                    onChange={(e) => setFormData((prev) => ({ ...prev, telefono: e.target.value.replace(/[^0-9+]/g, '') }))}
                    className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-[#0d7d6e] focus:outline-none focus:ring-2 focus:ring-[#0d7d6e]/20"
                    placeholder="+504 9999-9999"
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-gray-600">Género</label>
                  <select
                    value={formData.genero}
                    onChange={(e) => setFormData((prev) => ({ ...prev, genero: e.target.value as AdminDocente['genero'] | '' }))}
                    className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-[#0d7d6e] focus:outline-none focus:ring-2 focus:ring-[#0d7d6e]/20"
                  >
                    <option value="">Selecciona una opción</option>
                    <option value="Masculino">Masculino</option>
                    <option value="Femenino">Femenino</option>
                    <option value="Otro">Otro</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-gray-600">Fecha de nacimiento</label>
                  <input
                    type="date"
                    value={formData.fechaNacimiento}
                    max={new Date().toISOString().split('T')[0]}
                    onChange={(e) => setFormData((prev) => ({ ...prev, fechaNacimiento: e.target.value }))}
                    className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-[#0d7d6e] focus:outline-none focus:ring-2 focus:ring-[#0d7d6e]/20"
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-gray-600">¿Presenta discapacidad?</label>
                  <select
                    value={formData.discapacidad}
                    onChange={(e) => setFormData((prev) => ({ ...prev, discapacidad: e.target.value as 'si' | 'no' | '' }))}
                    className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-[#0d7d6e] focus:outline-none focus:ring-2 focus:ring-[#0d7d6e]/20"
                  >
                    <option value="">Selecciona una opción</option>
                    <option value="si">Sí</option>
                    <option value="no">No</option>
                  </select>
                </div>
                {formData.discapacidad === 'si' && (
                  <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-gray-600">Detalle de discapacidad</label>
                    <input
                      type="text"
                      value={formData.detalleDiscapacidad}
                      onChange={(e) => setFormData((prev) => ({ ...prev, detalleDiscapacidad: e.target.value }))}
                      className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-[#0d7d6e] focus:outline-none focus:ring-2 focus:ring-[#0d7d6e]/20"
                    />
                  </div>
                )}
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-gray-600">Municipio</label>
                  <input
                    type="text"
                    value={formData.municipio}
                    onChange={(e) => setFormData((prev) => ({ ...prev, municipio: e.target.value }))}
                    className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-[#0d7d6e] focus:outline-none focus:ring-2 focus:ring-[#0d7d6e]/20"
                    placeholder="Distrito Central"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-gray-600">Grupo étnico</label>
                  <select
                    value={formData.grupoEtnico}
                    onChange={(e) => setFormData((prev) => ({ ...prev, grupoEtnico: e.target.value }))}
                    className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-[#0d7d6e] focus:outline-none focus:ring-2 focus:ring-[#0d7d6e]/20"
                  >
                    <option value="">Selecciona una opción</option>
                    {gruposEtnicos.map((grupo) => (
                      <option key={grupo} value={grupo}>
                        {grupo}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </section>
          )}
        </div>

        <div className="flex items-center justify-between border-t border-gray-100 bg-gray-50 px-6 py-4">
          {status && (
            <p className={`text-sm ${status.type === 'success' ? 'text-[#0d7d6e]' : 'text-red-500'}`}>
              {status.message}
            </p>
          )}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-full border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 transition hover:bg-white"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={!isValid || evento.cuposDisponibles <= 0}
              className="rounded-full bg-[#0d7d6e] px-5 py-2 text-sm font-semibold text-white transition hover:bg-[#0b6a60] disabled:cursor-not-allowed disabled:bg-gray-300"
            >
              {evento.cuposDisponibles <= 0 ? 'Sin cupos' : 'Confirmar registro'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
