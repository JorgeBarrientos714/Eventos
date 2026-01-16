"use client";

import DatePicker from "@/components/DatePicker";

type DatosConyugeValue = {
  nombre: string;
  dni: string;
  fechaNacimiento: string; 
  telefono: string;
};

export default function DatosConyuge({
  value,
  onChange,
  onNext,
  onBack,
}: {
  value: DatosConyugeValue;
  onChange: (v: DatosConyugeValue) => void;
  onNext: () => void;
  onBack: () => void;
}) {
  return (
    <div className="space-y-4">
      <h2 className="text-sm font-semibold text-ink-700">Datos del cónyuge</h2>

      <div className="grid gap-4 md:grid-cols-2">
        {/* nombre */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-ink-700 mb-1">
            Nombre
          </label>
          <input
            value={value.nombre}
            onChange={(e) => onChange({ ...value, nombre: e.target.value })}
            className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-brand-300"
          />
        </div>

        {/* DNI */}
        <div>
          <label className="block text-sm font-medium text-ink-700 mb-1">
            N. DNI
          </label>
          <input
            value={value.dni}
            onChange={(e) => onChange({ ...value, dni: e.target.value })}
            className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-brand-300"
          />
        </div>

        {/* FECHA con el datepicker bonito */}
        <DatePicker
          label="Fecha nacimiento"
          value={value.fechaNacimiento}
          onChange={(val) => onChange({ ...value, fechaNacimiento: val })}
        />

        {/* Teléfono */}
        <div>
          <label className="block text-sm font-medium text-ink-700 mb-1">
            Teléfono
          </label>
          <input
            value={value.telefono}
            onChange={(e) => onChange({ ...value, telefono: e.target.value })}
            className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-brand-300"
            placeholder="9999-9999"
          />
        </div>
      </div>

      <div className="flex gap-3 pt-2">
        <button onClick={onBack} className="px-4 py-2 rounded-lg border text-sm">
          Volver
        </button>
        <button
          onClick={onNext}
          className="bg-brand-800 text-white px-4 py-2 rounded-lg text-sm"
        >
          Siguiente
        </button>
      </div>
    </div>
  );
}
