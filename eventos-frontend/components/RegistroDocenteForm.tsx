/**
 * Componente: RegistroDocenteForm
 * Módulo: eventos/registro
 * Función: Búsqueda de docente por DNI, precarga de datos y edición antes de registrarse
 * Flujo: 
 *   1. Ingresa DNI
 *   2. Backend busca en NET_DOCENTE
 *   3. Si existe, precarga datos en formulario
 *   4. Permite editar todos los campos excepto DNI
 *   5. Al guardar, actualiza datos en DB y registra a evento
 */

import { useEffect, useState } from 'react';
import { ArrowLeft, CheckCircle, AlertCircle, MapPin, Phone, User } from 'lucide-react';
import { registroServices } from '../lib/registro/services';
import { docenteAuth } from '../lib/authDocente';
import type { Event } from '../types/event';

interface Docente {
  id: number;
  nIdentificacion: string;
  primerNombre: string;
  segundoNombre?: string;
  tercerNombre?: string;
  primerApellido: string;
  segundoApellido?: string;
  nombreCompleto: string;
  genero: 'M' | 'F' | 'O';
  fechaNacimiento: string;
  telefono1: string;
  direccionResidencia?: string;
  idDepartamento?: number;
  idMunicipioResidencia?: number;
  idAldea?: number;
  idGrupoEtnico?: number;
  departamento?: { id: number; nombres: string };
  municipio?: { id: number; nombres: string };
  aldea?: { id: number; nombreAldea: string };
  grupoEtnico?: { id: number; nombreGrupoEtnico: string };
}

interface Catalogo {
  departamentos: { id: number; nombres: string }[];
  municipios: { id: number; nombres: string }[];
  aldeas: { id: number; nombreAldea: string }[];
  gruposEtnicos: { id: number; nombreGrupoEtnico: string }[];
  discapacidades: { id: number; nombre: string; descripcion?: string }[];
}

interface Invitado {
  dniInvitado: string;
  nombreInvitado: string;
}

interface RegistroDocenteFormProps {
  event: Event;
  onBack: () => void;
  onSuccess: () => void;
}

type Step = 'buscar' | 'editar' | 'exito';

export function RegistroDocenteForm({ event, onBack, onSuccess }: RegistroDocenteFormProps) {
  // Estados principales
  const [step, setStep] = useState<Step>('buscar');
  const [dniInput, setDniInput] = useState('');
  const [docente, setDocente] = useState<Docente | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Estados de formulario
  const [formData, setFormData] = useState<Partial<Docente>>({});

  // Estados PASO 2: Discapacidades e Invitados
  const [tieneDiscapacidad, setTieneDiscapacidad] = useState(false);
  const [idsDiscapacidadesSeleccionadas, setIdsDiscapacidadesSeleccionadas] = useState<number[]>([]);
  const [llevaInvitados, setLlevaInvitados] = useState(false);
  const [invitados, setInvitados] = useState<Invitado[]>([]);

  // Catálogos
  const [catalogo, setCatalogo] = useState<Catalogo>({
    departamentos: [],
    municipios: [],
    aldeas: [],
    gruposEtnicos: [],
    discapacidades: [],
  });

  // Mensajes
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');

  // Cargar catálogos al montar
  useEffect(() => {
    loadCatalogos();
    setInfo('Ingresa tu número de identidad para buscar tu información');
  }, []);

  // Cuando cambia departamento, cargar municipios
  useEffect(() => {
    if (!formData.idDepartamento) {
      setCatalogo((prev) => ({ ...prev, municipios: [], aldeas: [] }));
      return;
    }
    loadMunicipios(formData.idDepartamento);
  }, [formData.idDepartamento]);

  // Cuando cambia municipio, cargar aldeas
  useEffect(() => {
    if (!formData.idMunicipioResidencia) {
      setCatalogo((prev) => ({ ...prev, aldeas: [] }));
      return;
    }
    loadAldeas(formData.idMunicipioResidencia);
  }, [formData.idMunicipioResidencia]);

  async function loadCatalogos() {
    try {
      const [deps, grupos, discaps] = await Promise.all([
        registroServices.listarDepartamentos(),
        registroServices.listarGruposEtnicos(),
        registroServices.listarDiscapacidades(),
      ]);

      setCatalogo((prev) => ({
        ...prev,
        departamentos: deps,
        gruposEtnicos: grupos,
        discapacidades: discaps,
      }));
    } catch (err) {
      console.error('Error cargando catálogos:', err);
    }
  }

  async function loadMunicipios(depId: number) {
    try {
      const muns = await registroServices.listarMunicipios(depId);
      setCatalogo((prev) => ({ ...prev, municipios: muns }));
    } catch (err) {
      console.error('Error cargando municipios:', err);
    }
  }

  async function loadAldeas(munId: number) {
    try {
      const als = await registroServices.listarAldeas(munId);
      setCatalogo((prev) => ({ ...prev, aldeas: als }));
    } catch (err) {
      console.error('Error cargando aldeas:', err);
    }
  }

  async function handleBuscar() {
    if (!dniInput.trim()) {
      setError('Por favor ingresa tu número de identidad');
      return;
    }

    setIsSearching(true);
    setError('');

    try {
      const resultado = await registroServices.buscarDocentePorDni(dniInput.trim());
      setDocente(resultado as Docente);
      setFormData(resultado as Docente);
      // Iniciar sesión ligera del docente con su DNI para identificarlo en la plataforma
      try {
        await docenteAuth.iniciarSesion(dniInput.trim());
      } catch (e) {
        console.warn('No se pudo iniciar sesión de docente:', e);
      }
      
      // Si el docente tiene departamento, cargar municipios
      if (resultado.idDepartamento) {
        await loadMunicipios(resultado.idDepartamento);
      }
      
      // Si el docente tiene municipio, cargar aldeas
      if (resultado.idMunicipioResidencia) {
        await loadAldeas(resultado.idMunicipioResidencia);
      }

      // Precargar discapacidades del docente
      try {
        const discapacidadesDocente = await registroServices.obtenerDiscapacidadesDocente(resultado.id);
        if (discapacidadesDocente && discapacidadesDocente.length > 0) {
          setTieneDiscapacidad(true);
          setIdsDiscapacidadesSeleccionadas(discapacidadesDocente.map((d: any) => d.idDiscapacidad));
        }
      } catch (err) {
        console.error('Error cargando discapacidades del docente:', err);
      }
      
      setStep('editar');
      setInfo('Revisa y actualiza tu información si es necesario');
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'No se encontró tu información en el sistema'
      );
      setDocente(null);
    } finally {
      setIsSearching(false);
    }
  }

  function handleNombreCompletoChange(nombre: string) {
    // Separar nombre completo en componentes
    const partes = nombre.split(/\s+/).filter(Boolean);

    // Lógica simple: primeras 2 como primeros nombres, últimas 2 como apellidos
    const primerNombre = partes[0] || '';
    const segundoNombre = partes[1] || '';
    const primerApellido = partes[2] || '';
    const segundoApellido = partes[3] || '';
    const tercerNombre = partes[4] || '';

    setFormData((prev) => ({
      ...prev,
      nombreCompleto: nombre,
      primerNombre,
      segundoNombre,
      tercerNombre,
      primerApellido,
      segundoApellido,
    }));
  }

  function getNombreCompleto(): string {
    return [
      formData.primerNombre,
      formData.segundoNombre,
      formData.tercerNombre,
      formData.primerApellido,
      formData.segundoApellido,
    ]
      .filter(Boolean)
      .join(' ');
  }

  async function handleGuardar() {
    if (!docente?.id) return;

    // Validar aldea (obligatoria)
    if (!formData.idAldea) {
      setError('La aldea es obligatoria. Por favor selecciona tu aldea.');
      return;
    }

    // Validar invitados si lleva
    if (llevaInvitados && invitados.length > 0) {
      const maxInvitados = event.cantidadInvPermitidos || 0;
      if (maxInvitados === 0) {
        setError('Este evento no permite invitados');
        return;
      }
      if (invitados.length > maxInvitados) {
        setError(`Solo puedes llevar hasta ${maxInvitados} invitado(s)`);
        return;
      }
      // Validar que todos los invitados tengan datos completos
      for (let i = 0; i < invitados.length; i++) {
        if (!invitados[i].dniInvitado.trim() || !invitados[i].nombreInvitado.trim()) {
          setError(`Por favor completa los datos del invitado ${i + 1}`);
          return;
        }
      }
    }

    setIsSaving(true);
    setError('');

    try {
      // 1. Actualizar datos del docente
      await registroServices.actualizarDocenteRegistro(docente.id, {
        primerNombre: formData.primerNombre,
        segundoNombre: formData.segundoNombre,
        tercerNombre: formData.tercerNombre,
        primerApellido: formData.primerApellido,
        segundoApellido: formData.segundoApellido,
        genero: formData.genero,
        fechaNacimiento: formData.fechaNacimiento,
        telefono1: formData.telefono1,
        direccionResidencia: formData.direccionResidencia,
        idDepartamento: formData.idDepartamento,
        idMunicipioResidencia: formData.idMunicipioResidencia,
        idAldea: formData.idAldea,
        idGrupoEtnico: formData.idGrupoEtnico,
      });

      // 2. Inscribir a evento con discapacidades e invitados (PASO 2)
      const resultadoInscripcion = await registroServices.inscribirDocenteEvento({
        idEvento: parseInt(event.id),
        idDocente: docente.id,
        tieneDiscapacidad: tieneDiscapacidad,
        idsDiscapacidades: tieneDiscapacidad ? idsDiscapacidadesSeleccionadas : [],
        llevaInvitados: llevaInvitados,
        invitados: llevaInvitados ? invitados : [],
      });

      console.log('Inscripción exitosa:', resultadoInscripcion);

      setStep('exito');
      setTimeout(onSuccess, 2000);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Error al guardar los datos'
      );
    } finally {
      setIsSaving(false);
    }
  }

  // PASO 1: Búsqueda por DNI
  if (step === 'buscar') {
    return (
      <div className="min-h-screen py-6 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-gray-600 hover:text-[#0d7d6e] mb-6 transition-colors"
          >
            <div className="w-7 h-7 rounded-full border-2 border-gray-600 flex items-center justify-center">
              <ArrowLeft className="w-4 h-4" />
            </div>
            <span className="text-lg font-medium">Regresar</span>
          </button>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Columna izquierda: Detalles del evento */}
            <div>
              <h2 className="text-3xl md:text-4xl text-[#0d7d6e] mb-6 font-bold">
                Eventos
              </h2>

              <div className="bg-white rounded-2xl overflow-hidden shadow-md">
                <img
                  src={event.image}
                  alt={event.title}
                  className="w-full h-64 md:h-80 object-cover"
                />

                <div className="p-6">
                  <div className="flex justify-center gap-2 mb-4">
                    <div className="w-2 h-2 bg-gray-800 border-2 border-gray-400 rounded-full" />
                    <div className="w-2 h-2 bg-gray-400 border-2 border-gray-400 rounded-full" />
                    <div className="w-2 h-2 bg-gray-400 border-2 border-gray-400 rounded-full" />
                  </div>

                  <h3 className="text-2xl md:text-3xl text-gray-800 mb-4 text-center font-bold">
                    {event.title}
                  </h3>

                  <p className="text-gray-600 mb-6 leading-relaxed">
                    {event.description}
                  </p>

                  <div className="space-y-3 text-gray-700 mb-6">
                    <p className="font-semibold">{event.date}</p>
                    <p className="font-semibold">{event.time}</p>
                    <p className="font-semibold">{event.location}</p>
                  </div>

                  <div className="flex gap-4 text-gray-600 justify-center">
                    <MapPin className="w-5 h-5" />
                    <Phone className="w-5 h-5" />
                    <User className="w-5 h-5" />
                  </div>
                </div>
              </div>
            </div>

            {/* Columna derecha: Formulario de búsqueda */}
            <div>
              <h2 className="text-3xl md:text-4xl text-[#0d7d6e] mb-6 font-bold">
                Registrarse
              </h2>

              <div className="bg-white rounded-2xl shadow-md p-8 space-y-6">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-blue-800 text-sm">{info}</p>
                </div>

                <div className="space-y-4">
                  <label className="block">
                    <span className="text-sm font-semibold text-gray-700 mb-2 block">
                      Número de Identidad
                    </span>
                    <div className="flex gap-3">
                      <input
                        id="dni-search"
                        name="dni"
                        type="text"
                        value={dniInput}
                        onChange={(e) => {
                          setDniInput(e.target.value.replace(/[^0-9]/g, ''));
                          setError('');
                        }}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') handleBuscar();
                        }}
                        placeholder="0801195400121"
                        maxLength={15}
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0d7d6e] focus:border-transparent"
                      />
                      <button
                        onClick={handleBuscar}
                        disabled={!dniInput || isSearching}
                        className="px-6 py-2 bg-[#0d7d6e] text-white rounded-lg hover:bg-[#0b6a60] disabled:bg-gray-300 transition font-semibold"
                      >
                        {isSearching ? 'Buscando...' : 'Buscar'}
                      </button>
                    </div>
                  </label>

                  {error && (
                    <div className="flex gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
                      <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                      <p className="text-red-800 text-sm">{error}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // PASO 2: Editar datos
  if (step === 'editar' && docente) {
    return (
      <div className="min-h-screen py-6 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <button
            onClick={() => {
              setStep('buscar');
              setDocente(null);
              setFormData({});
              setDniInput('');
            }}
            className="flex items-center gap-2 text-gray-600 hover:text-[#0d7d6e] mb-6 transition-colors"
          >
            <div className="w-7 h-7 rounded-full border-2 border-gray-600 flex items-center justify-center">
              <ArrowLeft className="w-4 h-4" />
            </div>
            <span className="text-lg font-medium">Volver a Buscar</span>
          </button>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Columna izquierda: Detalles del evento */}
            <div>
              <h2 className="text-3xl md:text-4xl text-[#0d7d6e] mb-6 font-bold">
                Eventos
              </h2>

              <div className="bg-white rounded-2xl overflow-hidden shadow-md sticky top-6">
                <img
                  src={event.image}
                  alt={event.title}
                  className="w-full h-64 md:h-80 object-cover"
                />

                <div className="p-6">
                  <div className="flex justify-center gap-2 mb-4">
                    <div className="w-2 h-2 bg-gray-800 border-2 border-gray-400 rounded-full" />
                    <div className="w-2 h-2 bg-gray-400 border-2 border-gray-400 rounded-full" />
                    <div className="w-2 h-2 bg-gray-400 border-2 border-gray-400 rounded-full" />
                  </div>

                  <h3 className="text-2xl md:text-3xl text-gray-800 mb-4 text-center font-bold">
                    {event.title}
                  </h3>

                  <p className="text-gray-600 mb-6 leading-relaxed">
                    {event.description}
                  </p>

                  <div className="space-y-3 text-gray-700 mb-6">
                    <p className="font-semibold">{event.date}</p>
                    <p className="font-semibold">{event.time}</p>
                    <p className="font-semibold">{event.location}</p>
                  </div>

                  <div className="flex gap-4 text-gray-600 justify-center">
                    <MapPin className="w-5 h-5" />
                    <Phone className="w-5 h-5" />
                    <User className="w-5 h-5" />
                  </div>
                </div>
              </div>
            </div>

            {/* Columna derecha: Formulario */}
            <div>
              <h2 className="text-3xl md:text-4xl text-[#0d7d6e] mb-6 font-bold">
                Completa tu Información
              </h2>

              <div className="bg-white rounded-2xl shadow-md p-8 space-y-8">
                {error && (
                  <div className="flex gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
                    <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                    <p className="text-red-800 text-sm">{error}</p>
                  </div>
                )}

                {/* Sección 1: Identidad (DNI solo lectura) */}
                <section className="space-y-4 pb-6 border-b">
                  <h2 className="text-xl font-bold text-gray-800">Identidad</h2>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-semibold text-gray-700 block mb-2">DNI (Solo Lectura)</label>
                      <input
                        type="text"
                        value={formData.nIdentificacion || ''}
                        disabled
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-700 cursor-not-allowed"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-semibold text-gray-700 block mb-2">Nombre Completo</label>
                      <input
                        type="text"
                        value={getNombreCompleto()}
                        onChange={(e) => handleNombreCompletoChange(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0d7d6e]"
                      />
                    </div>
                  </div>
                </section>

                {/* Sección 2: Datos Personales */}
                <section className="space-y-4 pb-6 border-b">
                  <h2 className="text-xl font-bold text-gray-800">Datos Personales</h2>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-semibold text-gray-700 block mb-2">Género</label>
                      <select
                        id="genero-select"
                        name="genero"
                        value={formData.genero || ''}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            genero: e.target.value as 'M' | 'F' | 'O',
                          }))
                        }
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0d7d6e]"
                      >
                        <option value="">Selecciona</option>
                        <option value="M">Masculino</option>
                        <option value="F">Femenino</option>
                        <option value="O">Otro</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-sm font-semibold text-gray-700 block mb-2">
                        Fecha de Nacimiento
                      </label>
                      <input
                        id="fecha-nacimiento-input"
                        name="bday"
                        type="date"
                        value={
                          formData.fechaNacimiento
                            ? new Date(formData.fechaNacimiento).toISOString().split('T')[0]
                            : ''
                        }
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            fechaNacimiento: e.target.value,
                          }))
                        }
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0d7d6e]"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-semibold text-gray-700 block mb-2">Teléfono</label>
                      <input
                        id="telefono-input"
                        name="tel"
                        type="tel"
                        value={formData.telefono1 || ''}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            telefono1: e.target.value.replace(/[^0-9+]/g, ''),
                          }))
                        }
                        placeholder="+504 9999-9999"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0d7d6e]"
                      />
                    </div>
                  </div>
                </section>

                {/* Sección 3: Ubicación (Cascada: Departamento → Municipio → Aldea) */}
                <section className="space-y-4 pb-6 border-b">
                  <h2 className="text-xl font-bold text-gray-800">Ubicación</h2>
                  <p className="text-sm text-gray-600">
                    La aldea es obligatoria. Selecciona departamento y municipio para llegar a tu aldea.
                  </p>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div>
                      <label className="text-sm font-semibold text-gray-700 block mb-2">
                        Departamento <span className="text-red-500">*</span>
                      </label>
                      <select
                        id="departamento-select"
                        name="departamento"
                        value={formData.idDepartamento || ''}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            idDepartamento: e.target.value ? parseInt(e.target.value) : undefined,
                            idMunicipioResidencia: undefined,
                            idAldea: undefined,
                          }))
                        }
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0d7d6e]"
                      >
                        <option value="">Selecciona</option>
                        {catalogo.departamentos.map((dep) => (
                          <option key={dep.id} value={dep.id}>
                            {dep.nombres}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="text-sm font-semibold text-gray-700 block mb-2">
                        Municipio <span className="text-red-500">*</span>
                      </label>
                      <select
                        id="municipio-select"
                        name="municipio"
                        value={formData.idMunicipioResidencia || ''}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            idMunicipioResidencia: e.target.value ? parseInt(e.target.value) : undefined,
                            idAldea: undefined,
                          }))
                        }
                        disabled={!formData.idDepartamento}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0d7d6e] disabled:bg-gray-100 disabled:cursor-not-allowed"
                      >
                        <option value="">
                          {formData.idDepartamento ? 'Selecciona' : 'Primero selecciona departamento'}
                        </option>
                        {catalogo.municipios.map((mun) => (
                          <option key={mun.id} value={mun.id}>
                            {mun.nombres}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="text-sm font-semibold text-gray-700 block mb-2">
                        Aldea <span className="text-red-500">*</span>
                      </label>
                      <select
                        id="aldea-select"
                        name="aldea"
                        value={formData.idAldea || ''}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            idAldea: e.target.value ? parseInt(e.target.value) : undefined,
                          }))
                        }
                        disabled={!formData.idMunicipioResidencia}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0d7d6e] disabled:bg-gray-100 disabled:cursor-not-allowed"
                      >
                        <option value="">
                          {formData.idMunicipioResidencia ? 'Selecciona' : 'Primero selecciona municipio'}
                        </option>
                        {catalogo.aldeas.map((aldea) => (
                          <option key={aldea.id} value={aldea.id}>
                            {aldea.nombreAldea}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-gray-700 block mb-2">
                      Dirección de Residencia
                    </label>
                    <textarea
                      id="direccion-input"
                      name="address"
                      value={formData.direccionResidencia || ''}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          direccionResidencia: e.target.value,
                        }))
                      }
                      placeholder="Ej: Calle Principal #123, Apto 4B"
                      rows={3}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0d7d6e]"
                    />
                  </div>
                </section>

                {/* Sección 4: Grupo Étnico */}
                <section className="space-y-4 pb-6">
                  <h2 className="text-xl font-bold text-gray-800">Información Demográfica</h2>
                  <div>
                    <label className="text-sm font-semibold text-gray-700 block mb-2">Grupo Étnico</label>
                    <select
                      id="grupo-etnico-select"
                      name="grupoEtnico"
                      value={formData.idGrupoEtnico || ''}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          idGrupoEtnico: e.target.value ? parseInt(e.target.value) : undefined,
                        }))
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0d7d6e]"
                    >
                      <option value="">Selecciona</option>
                      {catalogo.gruposEtnicos.map((ge) => (
                        <option key={ge.id} value={ge.id}>
                          {ge.nombreGrupoEtnico}
                        </option>
                      ))}
                    </select>
                  </div>
                </section>

                {/* Sección 5: Discapacidades (PASO 2) */}
                <section className="space-y-4 pb-6 border-t pt-6">
                  <h2 className="text-xl font-bold text-gray-800">Discapacidades</h2>
                  
                  <div>
                    <label className="text-sm font-semibold text-gray-700 block mb-3">
                      ¿Tiene alguna discapacidad?
                    </label>
                    <div className="flex gap-6">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="tieneDiscapacidad"
                          checked={tieneDiscapacidad === true}
                          onChange={() => {
                            setTieneDiscapacidad(true);
                          }}
                          className="w-4 h-4 text-[#0d7d6e]"
                        />
                        <span className="text-gray-700">Sí</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="tieneDiscapacidad"
                          checked={tieneDiscapacidad === false}
                          onChange={() => {
                            setTieneDiscapacidad(false);
                            setIdsDiscapacidadesSeleccionadas([]);
                          }}
                          className="w-4 h-4 text-[#0d7d6e]"
                        />
                        <span className="text-gray-700">No</span>
                      </label>
                    </div>
                  </div>

                  {tieneDiscapacidad && (
                    <div className="mt-4 space-y-3">
                      <label className="text-sm font-semibold text-gray-700 block">
                        Selecciona las discapacidades que apliquen:
                      </label>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {catalogo.discapacidades.map((discap) => (
                          <label
                            key={discap.id}
                            className="flex items-start gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
                          >
                            <input
                              type="checkbox"
                              checked={idsDiscapacidadesSeleccionadas.includes(discap.id)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setIdsDiscapacidadesSeleccionadas((prev) => [...prev, discap.id]);
                                } else {
                                  setIdsDiscapacidadesSeleccionadas((prev) =>
                                    prev.filter((id) => id !== discap.id)
                                  );
                                }
                              }}
                              className="mt-1 w-4 h-4 text-[#0d7d6e]"
                            />
                            <div className="flex-1">
                              <span className="text-gray-800 font-medium">{discap.nombre}</span>
                              {discap.descripcion && (
                                <p className="text-xs text-gray-500 mt-1">{discap.descripcion}</p>
                              )}
                            </div>
                          </label>
                        ))}
                      </div>
                    </div>
                  )}
                </section>

                {/* Sección 6: Invitados (PASO 2) */}
                {event.cantidadInvPermitidos && event.cantidadInvPermitidos > 0 && (
                  <section className="space-y-4 pb-6 border-t pt-6">
                    <h2 className="text-xl font-bold text-gray-800">Invitados</h2>
                    
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <p className="text-sm text-blue-800">
                        Este evento permite hasta <strong>{event.cantidadInvPermitidos} invitado(s)</strong> por docente.
                      </p>
                    </div>

                    <div>
                      <label className="text-sm font-semibold text-gray-700 block mb-3">
                        ¿Desea llevar invitados?
                      </label>
                      <div className="flex gap-6">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="radio"
                            name="llevaInvitados"
                            checked={llevaInvitados === true}
                            onChange={() => {
                              setLlevaInvitados(true);
                              if (invitados.length === 0) {
                                setInvitados([{ dniInvitado: '', nombreInvitado: '' }]);
                              }
                            }}
                            className="w-4 h-4 text-[#0d7d6e]"
                          />
                          <span className="text-gray-700">Sí</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="radio"
                            name="llevaInvitados"
                            checked={llevaInvitados === false}
                            onChange={() => {
                              setLlevaInvitados(false);
                              setInvitados([]);
                            }}
                            className="w-4 h-4 text-[#0d7d6e]"
                          />
                          <span className="text-gray-700">No</span>
                        </label>
                      </div>
                    </div>

                    {llevaInvitados && (
                      <div className="mt-4 space-y-4">
                        {invitados.map((invitado, index) => (
                          <div
                            key={index}
                            className="border border-gray-300 rounded-lg p-4 space-y-3 bg-gray-50"
                          >
                            <div className="flex items-center justify-between">
                              <h3 className="text-sm font-bold text-gray-700">
                                Invitado {index + 1}
                              </h3>
                              {invitados.length > 1 && (
                                <button
                                  onClick={() => {
                                    setInvitados((prev) => prev.filter((_, i) => i !== index));
                                  }}
                                  className="text-red-600 hover:text-red-800 text-sm font-semibold"
                                >
                                  Eliminar
                                </button>
                              )}
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              <div>
                                <label className="text-xs font-semibold text-gray-600 block mb-1">
                                  DNI del Invitado <span className="text-red-500">*</span>
                                </label>
                                <input
                                  type="text"
                                  placeholder="0801199000123"
                                  value={invitado.dniInvitado}
                                  onChange={(e) => {
                                    const newInvitados = [...invitados];
                                    newInvitados[index].dniInvitado = e.target.value;
                                    setInvitados(newInvitados);
                                  }}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0d7d6e]"
                                />
                              </div>
                              <div>
                                <label className="text-xs font-semibold text-gray-600 block mb-1">
                                  Nombre Completo <span className="text-red-500">*</span>
                                </label>
                                <input
                                  type="text"
                                  placeholder="Juan Pérez"
                                  value={invitado.nombreInvitado}
                                  onChange={(e) => {
                                    const newInvitados = [...invitados];
                                    newInvitados[index].nombreInvitado = e.target.value;
                                    setInvitados(newInvitados);
                                  }}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0d7d6e]"
                                />
                              </div>
                            </div>
                          </div>
                        ))}

                        {invitados.length < (event.cantidadInvPermitidos || 0) && (
                          <button
                            onClick={() => {
                              setInvitados((prev) => [...prev, { dniInvitado: '', nombreInvitado: '' }]);
                            }}
                            className="w-full py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-[#0d7d6e] hover:text-[#0d7d6e] transition font-semibold"
                          >
                            + Agregar Otro Invitado
                          </button>
                        )}
                      </div>
                    )}
                  </section>
                )}

                {/* Botones */}
                <div className="flex gap-4 pt-6 border-t">
                  <button
                    onClick={() => {
                      setStep('buscar');
                      setDocente(null);
                      setFormData({});
                      setDniInput('');
                    }}
                    className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-semibold"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleGuardar}
                    disabled={isSaving}
                    className="flex-1 px-6 py-3 bg-[#0d7d6e] text-white rounded-lg hover:bg-[#0b6a60] disabled:bg-gray-300 transition font-semibold"
                  >
                    {isSaving ? 'Guardando...' : 'Registrarse al Evento'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // PASO 3: Éxito
  if (step === 'exito') {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 py-8 bg-gradient-to-b from-green-50 to-white">
        <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 max-w-md w-full text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full mx-auto mb-6 flex items-center justify-center">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>

          <h2 className="text-2xl md:text-3xl text-[#0d7d6e] mb-4 font-bold">
            ¡Registración Exitosa!
          </h2>

          <p className="text-gray-600 mb-2">Te has registrado a</p>
          <p className="text-xl text-gray-800 mb-6 font-semibold">{event.title}</p>

          <p className="text-gray-600 mb-8">Revisa tu correo para más información sobre el evento.</p>

          <button
            onClick={onSuccess}
            className="w-full bg-[#0d7d6e] text-white py-3 rounded-full hover:bg-[#0a6356] transition font-semibold"
          >
            Volver a Eventos
          </button>
        </div>
      </div>
    );
  }

  return null;
}
