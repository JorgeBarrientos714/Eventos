// Módulo: carnetizacion
// Función: Navegador visual de pasos para el flujo de carnetización
// Relacionados: pages/carnetizacion.tsx, components/carnetizacion/*
// Rutas/Endpoints usados: ninguno
// Notas: No se renombra para conservar imports actuales.
export type Step = {
  label: string;
  description?: string;
};

export default function CarnetSteps({
  steps,
  current,
  onStepClick,
  maxReached = 0,
}: {
  steps: Step[];
  current: number;
  onStepClick?: (i: number) => void;
  maxReached?: number;
}) {
  const total = steps.length;
  const percent = ((current + 1) / total) * 100;

  return (
    <div className="space-y-4">
      {/* Versión móvil */}
      <div className="sm:hidden space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-xs font-medium text-gray-700">
            Paso {current + 1} de {total}
          </span>
          <span className="text-xs text-gray-500">{steps[current].label}</span>
        </div>
        
        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-2 bg-teal-600 transition-all duration-300 ease-out"
            style={{ width: `${percent}%` }}
          />
        </div>
        
        {steps[current].description && (
          <p className="text-xs text-gray-500">
            {steps[current].description}
          </p>
        )}
      </div>

      {/* Versión desktop */}
      <div className="hidden sm:flex justify-center">
        <div className="flex items-center justify-between w-full max-w-4xl">
          {steps.map((step, idx) => {
            const isActive = idx === current;
            const isDone = idx < current;
            const isEnabled = idx <= maxReached;
            const isLast = idx === steps.length - 1;

            return (
              <div key={step.label} className="flex items-center flex-1">
                <button
                  type="button"
                  onClick={() => isEnabled && onStepClick?.(idx)}
                  className={`flex items-center gap-3 group ${
                    !isEnabled ? "cursor-not-allowed" : "cursor-pointer"
                  }`}
                >
                  <div
                    className={`relative h-8 w-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-200
                      ${
                        isDone
                          ? "bg-teal-600 text-white shadow-sm"
                          : isActive
                          ? "bg-teal-800 text-white shadow-md"
                          : "bg-teal-100 text-teal-700"
                      } ${
                      isEnabled && !isActive
                        ? "group-hover:bg-teal-200 group-hover:text-teal-800"
                        : ""
                    }`}
                  >
                    {idx + 1}
                  </div>
                  
                  <div className="text-left min-w-0 flex-1">
                    <p
                      className={`text-sm font-semibold truncate ${
                        isActive 
                          ? "text-teal-800" 
                          : isDone 
                            ? "text-teal-700"
                            : "text-gray-600"
                      }`}
                    >
                      {step.label}
                    </p>
                    {step.description && (
                      <p className="text-xs text-gray-500 truncate">
                        {step.description}
                      </p>
                    )}
                  </div>
                </button>

                {/* Línea conectora */}
                {!isLast && (
                  <div 
                    className={`flex-1 h-0.5 mx-4 ${
                      isDone ? "bg-teal-600" : "bg-teal-100"
                    }`} 
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
