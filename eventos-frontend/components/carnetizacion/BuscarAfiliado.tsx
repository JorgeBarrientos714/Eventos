// Módulo: carnetizacion
// Función: Paso de búsqueda de afiliado por DNI y fecha de nacimiento
// Relacionados: CarnetSteps, DatosGenerales
// Rutas/Endpoints usados: ninguno (simulación local)
// Notas: No se renombra para mantener imports actuales.
import { useState } from "react";
import DatePicker from "../DatePicker";

export default function BuscarAfiliado({
  onResult,
}: {
  onResult: (af: any) => void;
}) {
  const [tipo, setTipo] = useState("DNI");
  const [numero, setNumero] = useState("");
  const [fecha, setFecha] = useState(""); 
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleBuscar = () => {
    if (!numero || !fecha) {
      setError("Completa número de identificación y fecha de nacimiento.");
      return;
    }
    setError("");
    setLoading(true);

    setTimeout(() => {
      const fake = {
        nombre: "JUAN CARLOS PÉREZ",
        tipoIdentificacion: tipo,
        numeroIdentificacion: numero,
        fechaNacimiento: fecha, 
      };
      onResult(fake);
      setLoading(false);
    }, 500);
  };

  return (
    <div className="space-y-3">
      <h2 className="text-sm font-semibold text-gray-700">Búsqueda del afiliado</h2>
      <div className="grid gap-4 md:grid-cols-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Tipo de identificación
          </label>
          <select
            value={tipo}
            onChange={(e) => setTipo(e.target.value)}
            className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-teal-300"
          >
            <option value="DNI">DNI / Identidad</option>
            <option value="PASAPORTE">Pasaporte</option>
            <option value="RTN">RTN</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Número de identificación
          </label>
          <input
            value={numero}
            onChange={(e) => setNumero(e.target.value)}
            className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-teal-300"
            placeholder="0801-1990-00000"
          />
        </div>

        <DatePicker
          label="Fecha de nacimiento"
          value={fecha}
          onChange={(val) => setFecha(val)}
        />
      </div>

      {error && <p className="text-xs text-red-500">{error}</p>}

      <button
        onClick={handleBuscar}
        disabled={loading}
        className="bg-teal-800 text-white px-4 py-2 rounded-lg text-sm disabled:opacity-60"
      >
        {loading ? "Buscando..." : "Buscar afiliado"}
      </button>
    </div>
  );
}
