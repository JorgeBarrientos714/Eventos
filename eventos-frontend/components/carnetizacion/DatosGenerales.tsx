type DatosGeneralesValue = {
  nombreCompleto: string;
  dni: string;
  lugarFechaNacimiento: string;
  rtn: string;
  estadoCivil: string;
  sexo: string;
  telefono: string;
  departamento?: string;
  municipio?: string;
  aldea?: string;
  direccionCompleta?: string;
  correo?: string;
};

export default function DatosGenerales({
  value,
  onChange,
}: {
  value: DatosGeneralesValue;
  onChange: (v: DatosGeneralesValue) => void;
}) {
  return (
    <div className="space-y-6">
      {/* Bloque Datos Generales */}
      <div className="space-y-4">
        <div className="border-b border-gray-100 pb-3">
          <h2 className="text-sm font-semibold text-gray-800">Datos generales del docente</h2>
          <p className="text-xs text-gray-500 mt-1">
            Información personal básica del docente
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {/* Nombre completo */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nombre completo del docente
            </label>
            <input
              value={value.nombreCompleto}
              onChange={(e) =>
                onChange({ ...value, nombreCompleto: e.target.value })
              }
              className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-teal-300"
              placeholder="Ingrese el nombre completo"
            />
          </div>

          {/* DNI */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              N. DNI
            </label>
            <input
              value={value.dni}
              onChange={(e) => onChange({ ...value, dni: e.target.value })}
              className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-teal-300"
              placeholder="0000-0000-00000"
            />
          </div>

          {/* Lugar y fecha de nacimiento */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Lugar y fecha de nacimiento
            </label>
            <input
              value={value.lugarFechaNacimiento}
              onChange={(e) =>
                onChange({ ...value, lugarFechaNacimiento: e.target.value })
              }
              className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-teal-300"
              placeholder="Ej. Tegucigalpa, 01/01/1990"
            />
          </div>

          {/* RTN */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Número de RTN
            </label>
            <input
              value={value.rtn}
              onChange={(e) => onChange({ ...value, rtn: e.target.value })}
              className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-teal-300"
              placeholder="0000-0000-000"
            />
          </div>

          {/* Estado civil */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Estado civil
            </label>
            <select
              value={value.estadoCivil}
              onChange={(e) =>
                onChange({ ...value, estadoCivil: e.target.value })
              }
              className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-teal-300"
            >
              <option value="">Seleccione...</option>
              <option value="SOLTERO(A)">Soltero(a)</option>
              <option value="CASADO(A)">Casado(a)</option>
              <option value="DIVORCIADO(A)">Divorciado(a)</option>
              <option value="VIUDO(A)">Viudo(a)</option>
              <option value="UNIÓN LIBRE">Unión libre</option>
            </select>
          </div>

          {/* Sexo */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Sexo
            </label>
            <select
              value={value.sexo}
              onChange={(e) => onChange({ ...value, sexo: e.target.value })}
              className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-teal-300"
            >
              <option value="">Seleccione...</option>
              <option value="M">Masculino</option>
              <option value="F">Femenino</option>
            </select>
          </div>

          {/* Teléfono */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Teléfono
            </label>
            <input
              value={value.telefono}
              onChange={(e) => onChange({ ...value, telefono: e.target.value })}
              className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-teal-300"
              placeholder="9999-9999"
            />
          </div>
        </div>
      </div>

      {/* Bloque Lugar de Domicilio */}
      <div className="space-y-4">
        <div className="border-b border-gray-100 pb-3">
          <h3 className="text-sm font-semibold text-gray-800">Lugar de domicilio</h3>
          <p className="text-xs text-gray-500 mt-1">
            Dirección de residencia actual
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {/* Departamento */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Departamento
            </label>
            <select
              value={value.departamento || ""}
              onChange={(e) =>
                onChange({ ...value, departamento: e.target.value })
              }
              className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-teal-300"
            >
              <option value="">Seleccione departamento...</option>
              <option value="Francisco Morazán">Francisco Morazán</option>
              <option value="Cortés">Cortés</option>
              <option value="Atlántida">Atlántida</option>
              <option value="Colón">Colón</option>
              <option value="Comayagua">Comayagua</option>
              <option value="Copán">Copán</option>
              <option value="Choluteca">Choluteca</option>
              <option value="El Paraíso">El Paraíso</option>
              <option value="Intibucá">Intibucá</option>
              <option value="Islas de la Bahía">Islas de la Bahía</option>
              <option value="La Paz">La Paz</option>
              <option value="Lempira">Lempira</option>
              <option value="Ocotepeque">Ocotepeque</option>
              <option value="Olancho">Olancho</option>
              <option value="Santa Bárbara">Santa Bárbara</option>
              <option value="Valle">Valle</option>
              <option value="Yoro">Yoro</option>
            </select>
          </div>

          {/* Municipio */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Municipio
            </label>
            <select
              value={value.municipio || ""}
              onChange={(e) =>
                onChange({ ...value, municipio: e.target.value })
              }
              className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-teal-300"
              disabled={!value.departamento}
            >
              <option value="">Seleccione municipio...</option>
              {value.departamento === "Francisco Morazán" && (
                <>
                  <option value="Tegucigalpa">Tegucigalpa</option>
                  <option value="Comayagüela">Comayagüela</option>
                  <option value="Valle de Ángeles">Valle de Ángeles</option>
                  <option value="Santa Lucía">Santa Lucía</option>
                </>
              )}
              {value.departamento === "Cortés" && (
                <>
                  <option value="San Pedro Sula">San Pedro Sula</option>
                  <option value="Puerto Cortés">Puerto Cortés</option>
                  <option value="Villanueva">Villanueva</option>
                </>
              )}
            </select>
          </div>

          {/* Aldea */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Aldea
            </label>
            <input
              value={value.aldea || ""}
              onChange={(e) => onChange({ ...value, aldea: e.target.value })}
              className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-teal-300"
              placeholder="Nombre de la aldea"
            />
          </div>

          {/* Dirección completa */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Dirección completa
            </label>
            <textarea
              value={value.direccionCompleta || ""}
              onChange={(e) =>
                onChange({ ...value, direccionCompleta: e.target.value })
              }
              className="w-full border rounded-lg px-3 py-2 text-sm min-h-[80px] resize-y focus:ring-2 focus:ring-teal-300"
              placeholder="Colonia, bloque, casa, referencia, etc."
              rows={3}
            />
          </div>

          {/* Correo electrónico */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Correo electrónico
            </label>
            <input
              type="email"
              value={value.correo || ""}
              onChange={(e) => onChange({ ...value, correo: e.target.value })}
              className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-teal-300"
              placeholder="correo@ejemplo.com"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
