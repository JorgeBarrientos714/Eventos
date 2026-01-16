import { useState, useMemo } from 'react';
import { eventos, registros, docentes, Evento, Docente, Registro } from '../../lib/mockData';
import { ArrowLeft, Download } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

interface ReportsViewProps {
  onBack: () => void;
}

export default function ReportsView({ onBack }: ReportsViewProps) {
  const [selectedRegional, setSelectedRegional] = useState('');
  const [selectedEventoId, setSelectedEventoId] = useState('');

  // Obtener regionales únicas
  const regionales = useMemo(() => {
    return Array.from(new Set(eventos.map(e => e.regional)));
  }, []);

  // Filtrar eventos por regional
  const eventosFiltrados = useMemo(() => {
    if (!selectedRegional) return [];
    return eventos.filter(e => e.regional === selectedRegional && e.estado !== 'cancelado');
  }, [selectedRegional]);

  // Obtener evento seleccionado
  const eventoSeleccionado = useMemo(() => {
    return eventos.find(e => e.id === selectedEventoId);
  }, [selectedEventoId]);

  // Obtener registros del evento
  const registrosEvento = useMemo(() => {
    if (!selectedEventoId) return [];
    return registros.filter(r => r.eventoId === selectedEventoId);
  }, [selectedEventoId]);

  // Obtener docentes registrados
  const docentesRegistrados = useMemo(() => {
    return registrosEvento.map(registro => {
      const docente = docentes.find(d => d.dni === registro.dni);
      return {
        docente,
        registro
      };
    }).filter(item => item.docente);
  }, [registrosEvento]);

  // Calcular edad
  const calcularEdad = (fechaNacimiento: string) => {
    const hoy = new Date();
    const nacimiento = new Date(fechaNacimiento);
    let edad = hoy.getFullYear() - nacimiento.getFullYear();
    const mes = hoy.getMonth() - nacimiento.getMonth();
    if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) {
      edad--;
    }
    return edad;
  };

  // Datos para el gráfico
  const chartData = useMemo(() => {
    if (!eventoSeleccionado) return [];
    
    const registrados = eventoSeleccionado.cuposTotales - eventoSeleccionado.cuposDisponibles;
    
    return [
      { name: 'Registrados', value: registrados },
      { name: 'Disponibles', value: eventoSeleccionado.cuposDisponibles }
    ];
  }, [eventoSeleccionado]);

  const COLORS = ['#084b41', '#dcc594'];

  // Función para escapar valores CSV y asegurar que el DNI se trate como texto
  const escapeCsvValue = (value: string | number, isIdentifier: boolean = false) => {
    const stringValue = String(value);
    // Para DNI y otros identificadores, siempre envolver en comillas para que Excel lo trate como texto
    if (isIdentifier) {
      return `"="${'"'}${stringValue}${'"'}""`;
    }
    // Si el valor contiene comas, comillas o saltos de línea, lo envolvemos en comillas
    if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n') || stringValue.includes(';')) {
      return  `"="${'"'}${stringValue}${'"'}""`;
    }
    return stringValue;
  };

  // Función para descargar Excel (CSV)
  const handleDownloadExcel = () => {
    if (!eventoSeleccionado) return;

    // Headers del reporte
    const headers = [
      'DNI',
      'Nombre',
      'Teléfono',
      'Género',
      'Edad',
      'Fecha Nacimiento',
      'Discapacidad',
      'Detalle Discapacidad',
      'Municipio',
      'Grupo Étnico',
      'Nombre del Evento',
      'Regional',
      'Área Laboral',
      'Fecha y Hora de Registro'
    ];

    // Filas de datos
    const rows = docentesRegistrados.map(({ docente, registro }) => {
      if (!docente) return '';
      return [
        escapeCsvValue(docente.dni, true), // true = es un identificador, forzar texto
        escapeCsvValue(docente.nombre),
        escapeCsvValue(docente.telefono),
        escapeCsvValue(docente.genero),
        escapeCsvValue(calcularEdad(docente.fechaNacimiento)),
        escapeCsvValue(docente.fechaNacimiento),
        escapeCsvValue(docente.discapacidad === 'si' ? 'Sí' : 'No'),
        escapeCsvValue(docente.detalleDiscapacidad || ''),
        escapeCsvValue(docente.municipio),
        escapeCsvValue(docente.grupoEtnico),
        escapeCsvValue(eventoSeleccionado.nombre),
        escapeCsvValue(eventoSeleccionado.regional),
        escapeCsvValue(eventoSeleccionado.areaNombre),
        escapeCsvValue(new Date(registro.fechaRegistro).toLocaleString('es-HN'))
      ];
    });

    // Crear CSV con separador de punto y coma para mejor compatibilidad con Excel en español
    const headerLine = headers.join(';');
    const dataLines = rows.map(row => (Array.isArray(row) ? row.join(';') : row));
    
    // UTF-8 BOM para mejor compatibilidad con Excel
    const BOM = '\uFEFF';
    const csv = BOM + [headerLine, ...dataLines].join('\n');
    
    // Crear blob y descargar
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `reporte_${eventoSeleccionado.nombre.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="page-shell">
      <div className="mb-6">
        <button onClick={onBack} className="btn-secondary mb-4 gap-2">
          <ArrowLeft className="w-4 h-4" />
          Volver
        </button>
        
        <h1 className="text-3xl sm:text-4xl">Reportes de Eventos</h1>
        <p className="section-subtitle mt-2">
          Visualiza y descarga reportes de registros por evento
        </p>
      </div>

      <div className="panel p-4 sm:p-6 mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="label-base">Regional</label>
            <select
              value={selectedRegional}
              onChange={(e) => {
                setSelectedRegional(e.target.value);
                setSelectedEventoId('');
              }}
              className="input-base"
            >
              <option value="">Selecciona una regional</option>
              {regionales.map(regional => (
                <option key={regional} value={regional}>{regional}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="label-base">Evento</label>
            <select
              value={selectedEventoId}
              onChange={(e) => setSelectedEventoId(e.target.value)}
              className="input-base"
              disabled={!selectedRegional}
            >
              <option value="">Selecciona un evento</option>
              {eventosFiltrados.map(evento => (
                <option key={evento.id} value={evento.id}>{evento.nombre}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {eventoSeleccionado && (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-6">
            <div className="panel p-4 sm:p-6">
              <h2 className="mb-4 text-lg">Información del Evento</h2>
              <div className="space-y-2 text-sm">
                <div>
                  <span className="section-title">Nombre: </span>
                  <span>{eventoSeleccionado.nombre}</span>
                </div>
                <div>
                  <span className="section-title">Área: </span>
                  <span>{eventoSeleccionado.areaNombre}</span>
                </div>
                <div>
                  <span className="section-title">Regional: </span>
                  <span>{eventoSeleccionado.regional}</span>
                </div>
                <div>
                  <span className="section-title">Fechas: </span>
                  <span>{eventoSeleccionado.fechaInicio} - {eventoSeleccionado.fechaFin}</span>
                </div>
                <div>
                  <span className="section-title">Municipio: </span>
                  <span>{eventoSeleccionado.municipio}</span>
                </div>
              </div>
            </div>

            <div className="panel p-4 sm:p-6">
              <h2 className="mb-4 text-lg">Cupos</h2>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
              <div className="mt-4 text-center">
                <div className="section-title">Total de cupos: {eventoSeleccionado.cuposTotales}</div>
              </div>
            </div>
          </div>

          <div className="panel p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
              <h2 className="text-lg">Docentes Registrados ({docentesRegistrados.length})</h2>
              <button
                onClick={handleDownloadExcel}
                className="btn-primary gap-2 w-full sm:w-auto"
                disabled={docentesRegistrados.length === 0}
              >
                <Download className="w-4 h-4" />
                Descargar Excel
              </button>
            </div>

            {docentesRegistrados.length === 0 ? (
              <div className="text-center py-8">
                <p className="section-subtitle">No hay registros para este evento</p>
              </div>
            ) : (
              <div className="overflow-x-auto -mx-4 sm:mx-0">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b bg-gray-50">
                      <th className="text-left p-3 section-title">DNI</th>
                      <th className="text-left p-3 section-title">Nombre</th>
                      <th className="text-left p-3 section-title hidden sm:table-cell">Teléfono</th>
                      <th className="text-left p-3 section-title hidden md:table-cell">Género</th>
                      <th className="text-left p-3 section-title">Edad</th>
                      <th className="text-left p-3 section-title hidden lg:table-cell">F. Nacimiento</th>
                      <th className="text-left p-3 section-title hidden lg:table-cell">Municipio</th>
                    </tr>
                  </thead>
                  <tbody>
                    {docentesRegistrados.map(({ docente, registro }) => {
                      if (!docente) return null;
                      return (
                        <tr key={registro.id} className="border-b hover:bg-gray-50">
                          <td className="p-3">{docente.dni}</td>
                          <td className="p-3">{docente.nombre}</td>
                          <td className="p-3 hidden sm:table-cell">{docente.telefono}</td>
                          <td className="p-3 hidden md:table-cell">{docente.genero}</td>
                          <td className="p-3">{calcularEdad(docente.fechaNacimiento)}</td>
                          <td className="p-3 hidden lg:table-cell">{docente.fechaNacimiento}</td>
                          <td className="p-3 hidden lg:table-cell">{docente.municipio}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
