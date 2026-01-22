// Módulo: frontend-admin
// Función: Vista de reportes y ocupación de eventos
// Relacionados: AdminEventsDashboard, lib/admin/types.ts
// Rutas/Endpoints usados: ninguno directo (usa datos cargados en memoria)
// Notas: No se renombra para preservar imports.
import { useMemo, useState } from 'react';
import { ArrowLeft, Download } from 'lucide-react';
import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';
import { AdminDocente, AdminEvent, AdminRegistro } from '../../lib/admin/types';

interface ReportsViewProps {
  eventos: AdminEvent[];
  registros: AdminRegistro[];
  docentes: AdminDocente[];
  onBack: () => void;
}
 
const COLORS = ['#0d7d6e', '#dcc594'];

const calculateAge = (birthDate: string) => {
  const today = new Date();
  const birth = new Date(birthDate);
  let age = today.getFullYear() - birth.getFullYear();
  const monthDifference = today.getMonth() - birth.getMonth();
  if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birth.getDate())) {
    age -= 1;
  }
  return age;
};

export function ReportsView({ eventos, registros, docentes, onBack }: ReportsViewProps) {
  const [selectedRegional, setSelectedRegional] = useState('');
  const [selectedEventoId, setSelectedEventoId] = useState('');

  const regionalesDisponibles = useMemo(
    () => Array.from(new Set(eventos.map((evento) => evento.regional))).sort(),
    [eventos],
  );

  const eventosFiltrados = useMemo(() => {
    if (!selectedRegional) return [];
    return eventos.filter((evento) => evento.regional === selectedRegional && evento.estado !== 'cancelado');
  }, [eventos, selectedRegional]);

  const eventoSeleccionado = useMemo(
    () => eventos.find((evento) => evento.id === selectedEventoId) ?? null,
    [eventos, selectedEventoId],
  );

  const registrosEvento = useMemo(
    () => registros.filter((registro) => registro.eventoId === selectedEventoId),
    [registros, selectedEventoId],
  );

  const docentesRegistrados = useMemo(() => {
    return registrosEvento
      .map((registro) => ({
        registro,
        docente: docentes.find((docente) => docente.dni === registro.dni) ?? null,
      }))
      .filter((item) => item.docente !== null) as { registro: AdminRegistro; docente: AdminDocente }[];
  }, [docentes, registrosEvento]);

  const chartData = useMemo(() => {
    if (!eventoSeleccionado) return [];
    const registrados = eventoSeleccionado.cuposTotales - eventoSeleccionado.cuposDisponibles;
    return [
      { name: 'Registrados', value: registrados },
      { name: 'Disponibles', value: eventoSeleccionado.cuposDisponibles },
    ];
  }, [eventoSeleccionado]);

  const escapeCsv = (value: string | number) => {
    const stringValue = String(value);
    if (/[";\n,]/.test(stringValue)) {
      return `"${stringValue.replace(/"/g, '""')}"`;
    }
    return stringValue;
  };

  const handleDownload = () => {
    if (!eventoSeleccionado) return;

    const headers = [
      'DNI',
      'Nombre',
      'Teléfono',
      'Género',
      'Edad',
      'Fecha nacimiento',
      'Discapacidad',
      'Detalle discapacidad',
      'Municipio',
      'Grupo étnico',
      'Evento',
      'Regional',
      'Área',
      'Fecha registro',
    ];

    const rows = docentesRegistrados.map(({ docente, registro }) => [
      escapeCsv(`="${docente.dni}"`),
      escapeCsv(docente.nombre),
      escapeCsv(docente.telefono),
      escapeCsv(docente.genero),
      escapeCsv(calculateAge(docente.fechaNacimiento)),
      escapeCsv(docente.fechaNacimiento),
      escapeCsv(docente.discapacidad === 'si' ? 'Sí' : 'No'),
      escapeCsv(docente.detalleDiscapacidad ?? ''),
      escapeCsv(docente.municipio),
      escapeCsv(docente.grupoEtnico),
      escapeCsv(eventoSeleccionado.nombre),
      escapeCsv(eventoSeleccionado.regional),
      escapeCsv(eventoSeleccionado.areaNombre),
      escapeCsv(new Date(registro.fechaRegistro).toLocaleString('es-HN')),
    ]);

    const csv = ['\uFEFF' + headers.join(';'), ...rows.map((row) => row.join(';'))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.setAttribute(
      'download',
      `reporte_${eventoSeleccionado.nombre.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.csv`,
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-2 rounded-full border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 transition hover:bg-gray-50"
        >
          <ArrowLeft className="h-4 w-4" />
          Volver
        </button>
        <div>
          <h3 className="text-xl font-semibold text-gray-800">Reportes</h3>
          <p className="text-sm text-gray-500">Descarga información consolidada de inscripciones por evento</p>
        </div>
      </div>

      <section className="grid gap-4 rounded-2xl bg-white shadow-sm ring-1 ring-gray-100/60 md:grid-cols-2">
        <div className="space-y-2 border-b border-gray-100 p-6 md:border-b-0 md:border-r">
          <label className="text-sm font-semibold text-gray-600">Regional</label>
          <select
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-[#0d7d6e] focus:outline-none focus:ring-2 focus:ring-[#0d7d6e]/20"
            value={selectedRegional}
            onChange={(e) => {
              setSelectedRegional(e.target.value);
              setSelectedEventoId('');
            }}
          >
            <option value="">Selecciona una regional</option>
            {regionalesDisponibles.map((regional) => (
              <option key={regional} value={regional}>
                {regional}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-2 p-6">
          <label className="text-sm font-semibold text-gray-600">Evento</label>
          <select
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-[#0d7d6e] focus:outline-none focus:ring-2 focus:ring-[#0d7d6e]/20"
            value={selectedEventoId}
            disabled={!selectedRegional}
            onChange={(e) => setSelectedEventoId(e.target.value)}
          >
            <option value="">Selecciona un evento</option>
            {eventosFiltrados.map((evento) => (
              <option key={evento.id} value={evento.id}>
                {evento.nombre}
              </option>
            ))}
          </select>
        </div>
      </section>

      {eventoSeleccionado && (
        <div className="space-y-6">
          <section className="grid gap-4 md:grid-cols-2">
            <article className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
              <h4 className="text-sm font-semibold text-gray-500">Información del evento</h4>
              <div className="mt-4 space-y-2 text-sm text-gray-600">
                <div><span className="font-semibold text-gray-700">Nombre:</span> {eventoSeleccionado.nombre}</div>
                <div><span className="font-semibold text-gray-700">Área:</span> {eventoSeleccionado.areaNombre}</div>
                <div><span className="font-semibold text-gray-700">Regional:</span> {eventoSeleccionado.regional}</div>
                <div><span className="font-semibold text-gray-700">Fechas:</span> {eventoSeleccionado.fechaInicio} · {eventoSeleccionado.fechaFin}</div>
                <div><span className="font-semibold text-gray-700">Municipio:</span> {eventoSeleccionado.municipio}</div>
              </div>
            </article>
            <article className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
              <h4 className="text-sm font-semibold text-gray-500">Cupos</h4>
              <div className="mt-4 h-56 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={chartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={80}
                      paddingAngle={4}
                      dataKey="value"
                      label={(entry) => `${entry.name}: ${entry.value}`}
                    >
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${entry.name}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <p className="mt-4 text-center text-sm text-gray-500">
                Total de cupos: <span className="font-semibold text-gray-700">{eventoSeleccionado.cuposTotales}</span>
              </p>
            </article>
          </section>

          <section className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <h4 className="text-lg font-semibold text-gray-800">
                Docentes registrados ({docentesRegistrados.length})
              </h4>
              <button
                type="button"
                onClick={handleDownload}
                disabled={docentesRegistrados.length === 0}
                className="inline-flex items-center gap-2 rounded-full bg-[#0d7d6e] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#0b6a60] disabled:cursor-not-allowed disabled:bg-gray-300"
              >
                <Download className="h-4 w-4" />
                Descargar CSV
              </button>
            </div>

            {docentesRegistrados.length === 0 ? (
              <div className="mt-8 rounded-xl border border-dashed border-gray-200 py-10 text-center text-sm text-gray-500">
                No hay registros para este evento.
              </div>
            ) : (
              <div className="mt-6 overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 text-sm">
                  <thead className="bg-gray-50 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                    <tr>
                      <th className="px-4 py-3">DNI</th>
                      <th className="px-4 py-3">Nombre</th>
                      <th className="px-4 py-3">Teléfono</th>
                      <th className="px-4 py-3">Género</th>
                      <th className="px-4 py-3">Edad</th>
                      <th className="px-4 py-3">Municipio</th>
                      <th className="px-4 py-3">Fecha registro</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 text-gray-700">
                    {docentesRegistrados.map(({ docente, registro }) => (
                      <tr key={registro.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 font-mono text-xs">{docente.dni}</td>
                        <td className="px-4 py-3 font-medium">{docente.nombre}</td>
                        <td className="px-4 py-3">{docente.telefono}</td>
                        <td className="px-4 py-3">{docente.genero}</td>
                        <td className="px-4 py-3">{calculateAge(docente.fechaNacimiento)}</td>
                        <td className="px-4 py-3">{docente.municipio}</td>
                        <td className="px-4 py-3 text-xs text-gray-500">
                          {new Date(registro.fechaRegistro).toLocaleString('es-HN')}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </div>
      )}
    </div>
  );
}
