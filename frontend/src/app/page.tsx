export default function Home() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-6 sm:py-8 space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-brand-50 p-5 sm:p-6">
        <h2 className="text-lg sm:text-xl font-semibold text-brand-800 mb-2">
          Bienvenido al Portal INPREMA
        </h2>
        <p className="text-ink-500 mb-4 text-sm sm:text-base max-w-2xl">
          Plataforma interna para la gestión de procesos institucionales. Desde aquí podrás
          acceder a los módulos que se vayan habilitando.
        </p>
        <div className="flex flex-wrap gap-3">
          <button className="bg-brand-800 text-white px-4 py-2 rounded-lg text-sm hover:bg-brand-700">
            Ir al portal
          </button>
          <button className="bg-accent-300 text-brand-800 px-4 py-2 rounded-lg text-sm hover:bg-accent-200">
            Ver avisos
          </button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-[2fr,1fr]">
        {/* bloque principal */}
        <div className="bg-white rounded-xl shadow-sm border border-brand-50 p-5">
          <h3 className="text-sm font-semibold text-ink-700 mb-3">
            Módulos disponibles
          </h3>
          <p className="text-sm text-ink-500 mb-2">
            Actualmente no hay módulos específicos publicados.
          </p>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <div className="border rounded-lg p-3 bg-base-50">
              <p className="text-xs uppercase text-ink-500">Estado</p>
              <p className="text-sm font-medium">Sin módulos activos</p>
            </div>
            <div className="border rounded-lg p-3 bg-base-50">
              <p className="text-xs uppercase text-ink-500">Próximo</p>
              <p className="text-sm font-medium">Carnetización</p>
            </div>
          </div>
        </div>

        {/* avisos */}
        <div className="bg-white rounded-xl shadow-sm border border-brand-50 p-5">
          <h3 className="text-sm font-semibold text-ink-700 mb-3">Avisos</h3>
          <ul className="space-y-2 text-sm text-ink-500">
            <li className="border-l-2 border-brand-400 pl-2">
              Actualización del portal en desarrollo
            </li>
            <li className="border-l-2 border-brand-400 pl-2">
              Próxima habilitación de módulo de carnetización
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
