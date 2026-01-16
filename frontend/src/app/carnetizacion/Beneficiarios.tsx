"use client";

import React from "react";

type Benef = {
  nombre: string;
  identidad: string;
  fechaNacimiento: string;
};

type Props = {
  value: Benef[];
  onChange: (v: Benef[]) => void;
  onNext: () => void;
  onBack: () => void;
};

export default function Beneficiarios({ value, onNext, onBack }: Props) {
  const [confirmado, setConfirmado] = React.useState(false);

  return (
    <div className="space-y-4">
      <h2 className="text-sm font-semibold text-ink-700">Beneficiarios</h2>
      <p className="text-xs text-ink-500">
        Verifica que los datos de los beneficiarios sean correctos.
      </p>

      <div className="space-y-3">
        {value.map((b, idx) => (
          <div
            key={idx}
            className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 border border-brand-50 rounded-lg p-3 bg-base-50"
          >
            <div>
              <p className="text-sm font-medium text-brand-800">
                {b.nombre || `Beneficiario ${idx + 1}`}
              </p>
              <p className="text-xs text-ink-500">
                Identidad: {b.identidad || "—"}
              </p>
              <p className="text-xs text-ink-500">
                Fecha de nacimiento: {b.fechaNacimiento || "—"}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* check general */}
      <label className="flex items-center gap-2 text-sm text-ink-700">
        <input
          type="checkbox"
          checked={confirmado}
          onChange={(e) => setConfirmado(e.target.checked)}
        />
        Los datos de los beneficiarios están correctos
      </label>

      <div className="flex gap-3 pt-2">
        <button onClick={onBack} className="px-4 py-2 rounded-lg border text-sm">
          Volver
        </button>
        <button
          onClick={onNext}
          disabled={!confirmado}
          className="bg-brand-800 text-white px-4 py-2 rounded-lg text-sm disabled:opacity-50"
        >
          Siguiente
        </button>
      </div>
    </div>
  );
}
