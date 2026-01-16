"use client";

type Step = {
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
          <span className="text-xs font-medium text-ink-700">
            Paso {current + 1} de {total}
          </span>
          <span className="text-xs text-ink-500">{steps[current].label}</span>
        </div>
        
        <div className="h-2 bg-brand-50 rounded-full overflow-hidden">
          <div
            className="h-2 bg-brand-600 transition-all duration-300 ease-out"
            style={{ width: `${percent}%` }}
          />
        </div>
        
        {steps[current].description && (
          <p className="text-xs text-ink-500">
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
                          ? "bg-brand-600 text-white shadow-sm"
                          : isActive
                          ? "bg-brand-800 text-white shadow-md"
                          : "bg-brand-100 text-brand-700"
                      } ${
                      isEnabled && !isActive
                        ? "group-hover:bg-brand-200 group-hover:text-brand-800"
                        : ""
                    }`}
                  >
                    {idx + 1}
                    {isDone && (
                      <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                  
                  <div className="text-left min-w-0 flex-1">
                    <p
                      className={`text-sm font-semibold truncate ${
                        isActive 
                          ? "text-brand-800" 
                          : isDone 
                            ? "text-brand-700"
                            : "text-ink-600"
                      }`}
                    >
                      {step.label}
                    </p>
                    {step.description && (
                      <p className="text-xs text-ink-500 truncate">
                        {step.description}
                      </p>
                    )}
                  </div>
                </button>

                {/* Línea conectora */}
                {!isLast && (
                  <div 
                    className={`flex-1 h-0.5 mx-4 ${
                      isDone ? "bg-brand-600" : "bg-brand-100"
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