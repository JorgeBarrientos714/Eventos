import { FormEvent, useEffect, useMemo, useState } from 'react';
import { AdminArea, AdminEvent } from '../../lib/admin/types';

export interface AdminEventFormValues extends Omit<AdminEvent, 'id'> {
  id?: string;
}

interface EventFormProps {
  evento?: AdminEvent;
  areas: AdminArea[];
  departamentos: string[];
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
};

export function EventForm({ evento, areas, departamentos, onCancel, onSubmit }: EventFormProps) {
  const [formData, setFormData] = useState<AdminEventFormValues>(emptyForm);
  const isEdit = Boolean(evento);

  useEffect(() => {
    if (evento) {
      setFormData({ ...evento });
    } else {
      setFormData(emptyForm);
    }
  }, [evento]);

  const selectedArea = useMemo(
    () => areas.find((area) => area.id === formData.areaId),
    [areas, formData.areaId],
  );

  useEffect(() => {
    if (selectedArea) {
      setFormData((prev) => ({ ...prev, areaNombre: selectedArea.nombre }));
    }
  }, [selectedArea]);

  const handleToggleDia = (dia: string) => {
    setFormData((prev) => ({
      ...prev,
      diasSemana: prev.diasSemana.includes(dia)
        ? prev.diasSemana.filter((d) => d !== dia)
        : [...prev.diasSemana, dia],
    }));
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();

    if (!formData.nombre || !formData.regional || !formData.departamento || !formData.municipio) {
      return;
    }

    const payload: AdminEventFormValues = {
      ...formData,
      cuposDisponibles: isEdit ? formData.cuposDisponibles : formData.cuposTotales,
    };

    onSubmit(payload);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-600">Nombre del evento</label>
          <input
            type="text"
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-[#0d7d6e] focus:outline-none focus:ring-2 focus:ring-[#0d7d6e]/20"
            value={formData.nombre}
            onChange={(e) => setFormData((prev) => ({ ...prev, nombre: e.target.value }))}
            placeholder="Motivación"
            required
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-600">Regional</label>
          <input
            type="text"
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-[#0d7d6e] focus:outline-none focus:ring-2 focus:ring-[#0d7d6e]/20"
            value={formData.regional}
            onChange={(e) => setFormData((prev) => ({ ...prev, regional: e.target.value }))}
            placeholder="Central"
            required
          />
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
            value={formData.departamento}
            onChange={(e) => setFormData((prev) => ({ ...prev, departamento: e.target.value }))}
            required
          >
            <option value="">Selecciona un departamento</option>
            {departamentos.map((departamento) => (
              <option key={departamento} value={departamento}>
                {departamento}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-600">Municipio</label>
          <input
            type="text"
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-[#0d7d6e] focus:outline-none focus:ring-2 focus:ring-[#0d7d6e]/20"
            value={formData.municipio}
            onChange={(e) => setFormData((prev) => ({ ...prev, municipio: e.target.value }))}
            placeholder="Distrito Central"
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-semibold text-gray-600">Dirección</label>
        <input
          type="text"
          className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-[#0d7d6e] focus:outline-none focus:ring-2 focus:ring-[#0d7d6e]/20"
          value={formData.direccion}
          onChange={(e) => setFormData((prev) => ({ ...prev, direccion: e.target.value }))}
          placeholder="Instalaciones INPREMA"
        />
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
            min={0}
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-[#0d7d6e] focus:outline-none focus:ring-2 focus:ring-[#0d7d6e]/20"
            value={formData.cuposTotales}
            onChange={(e) => {
              const total = Number(e.target.value) || 0;
              setFormData((prev) => ({
                ...prev,
                cuposTotales: total,
                cuposDisponibles: isEdit ? prev.cuposDisponibles : total,
              }));
            }}
          />
        </div>
        {isEdit && (
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-600">Cupos disponibles</label>
            <input
              type="number"
              min={0}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-[#0d7d6e] focus:outline-none focus:ring-2 focus:ring-[#0d7d6e]/20"
              value={formData.cuposDisponibles}
              onChange={(e) => {
                const value = Number(e.target.value) || 0;
                setFormData((prev) => ({ ...prev, cuposDisponibles: Math.min(value, prev.cuposTotales) }));
              }}
            />
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
            <option value="activo">Activo</option>
            <option value="pospuesto">Pospuesto</option>
            <option value="cancelado">Cancelado</option>
          </select>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-600">Imagen (opcional)</label>
          <input
            type="url"
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-[#0d7d6e] focus:outline-none focus:ring-2 focus:ring-[#0d7d6e]/20"
            value={formData.imagen}
            onChange={(e) => setFormData((prev) => ({ ...prev, imagen: e.target.value }))}
            placeholder="https://..."
          />
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
