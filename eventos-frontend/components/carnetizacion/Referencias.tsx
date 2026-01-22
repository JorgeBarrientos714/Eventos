// Módulo: carnetizacion
// Función: Paso de referencias familiar y personal
// Relacionados: pages/carnetizacion.tsx, CarnetSteps
// Rutas/Endpoints usados: ninguno (manejo local)
// Notas: No se renombra para conservar imports.
type ReferenciasValue = {
  familiar: {
    nombre: string;
    parentesco: string;
    telefono: string;
  };
  personal: {
    nombre: string;
    parentesco: string;
    telefono: string;
  };
};

type Props = {
  value: ReferenciasValue;
  onChange: (v: ReferenciasValue) => void;
  onNext: () => void;
  onBack: () => void;
};

export default function Referencias({ value, onChange, onNext, onBack }: Props) {
  return (
    <div className="space-y-4">
      <h2 className="text-sm font-semibold text-gray-700">Referencias</h2>

      <div className="space-y-3 rounded-lg border border-gray-100 bg-gray-50 p-4">
        <h3 className="text-xs font-semibold text-gray-700 uppercase">Familiar</h3>
        <div className="grid gap-3 md:grid-cols-3">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nombre completo
            </label>
            <input
              value={value.familiar.nombre}
              onChange={(e) =>
                onChange({
                  ...value,
                  familiar: { ...value.familiar, nombre: e.target.value },
                })
              }
              className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-teal-300"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Parentesco
            </label>
            <input
              value={value.familiar.parentesco}
              onChange={(e) =>
                onChange({
                  ...value,
                  familiar: { ...value.familiar, parentesco: e.target.value },
                })
              }
              className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-teal-300"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Teléfono
            </label>
            <input
              value={value.familiar.telefono}
              onChange={(e) =>
                onChange({
                  ...value,
                  familiar: { ...value.familiar, telefono: e.target.value },
                })
              }
              className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-teal-300"
            />
          </div>
        </div>
      </div>

      <div className="space-y-3 rounded-lg border border-gray-100 bg-gray-50 p-4">
        <h3 className="text-xs font-semibold text-gray-700 uppercase">Personal</h3>
        <div className="grid gap-3 md:grid-cols-3">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nombre completo
            </label>
            <input
              value={value.personal.nombre}
              onChange={(e) =>
                onChange({
                  ...value,
                  personal: { ...value.personal, nombre: e.target.value },
                })
              }
              className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-teal-300"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Parentesco
            </label>
            <input
              value={value.personal.parentesco}
              onChange={(e) =>
                onChange({
                  ...value,
                  personal: { ...value.personal, parentesco: e.target.value },
                })
              }
              className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-teal-300"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Teléfono
            </label>
            <input
              value={value.personal.telefono}
              onChange={(e) =>
                onChange({
                  ...value,
                  personal: { ...value.personal, telefono: e.target.value },
                })
              }
              className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-teal-300"
            />
          </div>
        </div>
      </div>

      <div className="flex gap-3 pt-2">
        <button onClick={onBack} className="px-4 py-2 rounded-lg border text-sm">
          Volver
        </button>
        <button
          onClick={onNext}
          className="bg-teal-800 text-white px-4 py-2 rounded-lg text-sm"
        >
          Siguiente
        </button>
      </div>
    </div>
  );
}
