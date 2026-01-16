"use client";

import { useState, useEffect } from 'react';
import { Evento, Docente, docentes as docentesMock, registros, eventos, gruposEtnicos } from '../../lib/mockData';
import { buscarDocentePorDNI, DocenteAPI, formatearNombreCompleto } from '../../lib/api';
import { X, Search, Loader2 } from 'lucide-react';

interface RegisterModalProps {
  evento: Evento;
  onClose: () => void;
  onRegisterComplete: (dni: string) => void;
}

export default function RegisterModal({ evento, onClose, onRegisterComplete }: RegisterModalProps) {
  const [dni, setDni] = useState('');
  const [docente, setDocente] = useState<DocenteAPI | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [formData, setFormData] = useState({
    nombre: '',
    telefono: '',
    genero: '' as '' | 'Masculino' | 'Femenino' | 'Otro',
    fechaNacimiento: '',
    discapacidad: '' as '' | 'si' | 'no',
    detalleDiscapacidad: '',
    municipio: '',
    grupoEtnico: ''
  });

  // Mensajes flotantes
  const [statusMessage, setStatusMessage] = useState('');
  const [statusType, setStatusType] = useState<'success' | 'error' | ''>('');

  const cuposRegistrados = evento.cuposTotales - evento.cuposDisponibles;

  // 🔹 Resetear formulario cada vez que se abra el modal
  useEffect(() => {
    resetForm();
  }, [evento]);

  const resetForm = () => {
    setDni('');
    setDocente(null);
    setNotFound(false);
    setFormData({
      nombre: '',
      telefono: '',
      genero: '',
      fechaNacimiento: '',
      discapacidad: '',
      detalleDiscapacidad: '',
      municipio: '',
      grupoEtnico: ''
    });
  };

  // 🔹 Buscar docente por DNI usando la API real
  const handleSearch = async () => {
    if (!dni.trim()) {
      setStatusMessage('Por favor ingrese un número de identificación');
      setStatusType('error');
      setTimeout(() => setStatusMessage(''), 3000);
      return;
    }

    setNotFound(false);
    setIsSearching(true);

    try {
      const docenteEncontrado = await buscarDocentePorDNI(dni);

      if (docenteEncontrado) {
        setDocente(docenteEncontrado);

        // Autocompletar formulario con los datos del docente
        setFormData({
          nombre: formatearNombreCompleto(docenteEncontrado),
          telefono: docenteEncontrado.telefono1 || '',
          genero: mapearGenero(docenteEncontrado.genero),
          fechaNacimiento: docenteEncontrado.fechaNacimiento
            ? new Date(docenteEncontrado.fechaNacimiento).toISOString().split('T')[0]
            : '',
          discapacidad: '', // Este campo no está en la BD, dejar vacío
          detalleDiscapacidad: '',
          municipio: docenteEncontrado.municipioResidencia?.nombres || '',
          grupoEtnico: docenteEncontrado.grupoEtnicoTexto || ''
        });
      } else {
        setNotFound(true);
        setDocente(null);
      }
    } catch (error) {
      console.error('Error al buscar docente:', error);
      setStatusMessage('Error al buscar en la base de datos. Intente nuevamente.');
      setStatusType('error');
      setTimeout(() => setStatusMessage(''), 3000);
    } finally {
      setIsSearching(false);
    }
  };

  // Helper para mapear el género de la BD al formato del formulario
  const mapearGenero = (genero?: string): '' | 'Masculino' | 'Femenino' | 'Otro' => {
    if (!genero) return '';
    const generoLower = genero.toLowerCase();
    if (generoLower === 'm' || generoLower === 'masculino') return 'Masculino';
    if (generoLower === 'f' || generoLower === 'femenino') return 'Femenino';
    return 'Otro';
  };

  const handleChangeDni = () => {
    resetForm();
  };

  // Validar formulario
  const isFormValid = () => {
    if (
      formData.nombre === '' ||
      formData.telefono === '' ||
      formData.genero === '' ||
      formData.fechaNacimiento === '' ||
      formData.municipio === '' ||
      formData.grupoEtnico === '' ||
      formData.discapacidad === ''
    ) return false;

    if (new Date(formData.fechaNacimiento) > new Date()) return false;

    if (formData.discapacidad === 'si' && formData.detalleDiscapacidad === '') return false;

    if (formData.telefono.length < 8) return false;

    return true;
  };

  // Confirmar registro
  const handleConfirmRegister = () => {
    if (!isFormValid()) {
      setStatusMessage('Por favor complete todos los campos correctamente ⚠️');
      setStatusType('error');
      setTimeout(() => setStatusMessage(''), 3000);
      return;
    }

    try {
      registros.push({
        id: `r${registros.length + 1}`,
        eventoId: evento.id,
        dni: dni,
        fechaRegistro: new Date().toISOString()
      });

      const eventoIndex = eventos.findIndex(e => e.id === evento.id);
      if (eventoIndex !== -1) {
        eventos[eventoIndex].cuposDisponibles -= 1;
      }

      if (!docentesMock.find(d => d.dni === dni)) {
        docentesMock.push({
          dni,
          ...formData,
          genero: formData.genero || "Masculino",
          discapacidad: formData.discapacidad || "no"
        });
      }

      setStatusMessage('Registro completado con éxito 🎉');
      setStatusType('success');

      setTimeout(() => {
        setStatusMessage('');
        setStatusType('');
        onRegisterComplete(dni);
        resetForm(); // Limpiar formulario para próximos registros
        onClose();
      }, 4000);

    } catch (error) {
      console.error(error);
      setStatusMessage('Ocurrió un error al registrar 😢');
      setStatusType('error');
      setTimeout(() => setStatusMessage(''), 3000);
    }
  };
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b p-6 flex items-center justify-between">
          <div>
            <h2>Registrarse en Evento</h2>
            <p className="section-subtitle mt-1">Completa tu registro para participar</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          <div className="panel p-4 mb-6">
            <div className="section-title mb-2">{evento.nombre}</div>
            <div className="text-sm space-y-1">
              <div>{evento.fechaInicio}</div>
              <div>{evento.horaInicio}</div>
              <div>{evento.direccion}</div>
            </div>
          </div>

          <div className="mb-6">
            <label className="label-base">Número de Identidad</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={dni}
                onChange={(e) => setDni(e.target.value)}
                placeholder="Ingresa el número de identidad"
                className="input-base"
                disabled={docente !== null}
              />
              {!docente && (
                <button
                  onClick={handleSearch}
                  className="btn-primary gap-2"
                  disabled={isSearching || !dni.trim()}
                >
                  {isSearching ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Buscando...
                    </>
                  ) : (
                    <>
                      <Search className="w-4 h-4" />
                      Buscar
                    </>
                  )}
                </button>
              )}
            </div>
            {notFound && (
              <p className="text-sm mt-2" style={{ color: '#d4183d' }}>
                No se encontró el docente en la base de datos. Complete el formulario a continuación.
              </p>
            )}
          </div>

          {(docente || notFound) && (
            <div className="space-y-4 mb-6">
              <div className="divider" />

              <div>
                <label className="label-base">Nombre</label>
                <input
                  type="text"
                  value={formData.nombre}
                  placeholder="EJEMPLO: JUAN GARCÍA"
                  onChange={(e) => {
                    // Solo permitir letras y espacios
                    const soloLetras = e.target.value
                      .replace(/[^A-Za-zÁÉÍÓÚáéíóúÑñ\s]/g, '') // elimina todo lo que no sea letra o espacio
                      .toUpperCase(); // convierte a mayúsculas
                    setFormData({ ...formData, nombre: soloLetras });
                  }}
                  className="input-base"
                  disabled={docente !== null}
                />
                {formData.nombre === "" && (<p className="text-red-500 text-sm mt-1">⚠️ Campo obligatorio</p>)}
              </div>

              <div>
                <label className="label-base">Teléfono</label>
                <input
                  type="text"
                  inputMode="numeric"                // 👈 ayuda en móviles para mostrar teclado numérico
                  value={formData.telefono}
                  onChange={(e) => {
                    const soloNumeros = e.target.value.replace(/[^0-9]/g, ""); // 👈 elimina todo lo que no sea número
                    setFormData({ ...formData, telefono: soloNumeros });
                  }}
                  className={`input-base ${formData.telefono === "" || new Date(formData.telefono) > new Date() ? "border-red-500" : "border-gray-300"}`}
                  disabled={docente !== null}
                  maxLength={8}                      // 👈 opcional, limita a 8 dígitos
                  placeholder="Ingrese el número de teléfono"
                />
                {formData.telefono === "" && (<p className="text-red-500 text-sm mt-1">⚠️ Campo obligatorio</p>)}
              </div>

              <div>
                <label className="label-base">Género</label>
                <select
                  value={formData.genero}
                  onChange={(e) => setFormData({ ...formData, genero: e.target.value as any })}
                  disabled={docente !== null}

                >
                  <option value="">Seleccione un género</option>
                  <option value="Masculino">Masculino</option>
                  <option value="Femenino">Femenino</option>
                  <option value="Otro">Otro</option>
                </select>
                {formData.genero === "" && (<p className="text-red-500 text-sm mt-1">⚠️ Campo obligatorio</p>)}

              </div>

              <div>
                <label className="label-base">Fecha de Nacimiento</label>
                <input
                  type="date"
                  value={formData.fechaNacimiento}
                  onChange={(e) => setFormData({ ...formData, fechaNacimiento: e.target.value })}
                  max={new Date().toISOString().split("T")[0]}
                  className={`input-base ${formData.fechaNacimiento === "" || new Date(formData.fechaNacimiento) > new Date()
                    ? "border-red-500" : "border-gray-300"}`}
                  disabled={docente !== null}
                />
                {(formData.fechaNacimiento === "" ||
                  new Date(formData.fechaNacimiento) > new Date()) && (
                    <p className="text-red-500 text-sm mt-1">
                      ⚠️ Debe ingresar una fecha válida
                    </p>
                  )}
              </div>

              <div>
                <label className="label-base">¿Tiene discapacidad?</label>
                <select
                  value={formData.discapacidad}
                  onChange={(e) =>
                    setFormData({ ...formData, discapacidad: e.target.value as any })
                  }
                  className={`input-base ${formData.discapacidad === "" ? "border-red-500" : "border-gray-300"
                    }`}
                  disabled={docente !== null}
                >

                  <option value="">Seleccione una opcion</option>
                  <option value="no">No</option>
                  <option value="si">Sí</option>
                </select>

                {formData.discapacidad === "" && (
                  <p className="text-red-500 text-sm mt-1">
                    ⚠️ Debe seleccionar una opción
                  </p>
                )}
              </div>

              {formData.discapacidad === 'si' && (
                <div>
                  <label className="label-base">Detalle de Discapacidad</label>
                  <input
                    type="text"
                    value={formData.detalleDiscapacidad}
                    onChange={(e) => setFormData({ ...formData, detalleDiscapacidad: e.target.value })}
                    className={`input-base ${formData.detalleDiscapacidad === "" ? "border-red-500" : "border-gray-300"
                      }`}
                    disabled={docente !== null}

                  />
                  {formData.detalleDiscapacidad === "" && (<p className="text-red-500 text-sm mt-1">⚠️ Campo obligatorio</p>)}
                </div>
              )}

              <div>
                <label className="label-base">Municipio de Recidencia</label>
                <input
                  type="text"
                  value={formData.municipio}
                  onChange={(e) => setFormData({ ...formData, municipio: e.target.value })}
                  className={`input-base ${formData.municipio === "" ? "border-red-500" : "border-gray-300"
                    }`}
                  disabled={docente !== null}
                />
                {formData.municipio === "" && (<p className="text-red-500 text-sm mt-1">⚠️ Campo obligatorio</p>)}
              </div>

              <div>
                <label className="label-base">Grupo Étnico</label>
                <select
                  value={formData.grupoEtnico}
                  onChange={(e) => setFormData({ ...formData, grupoEtnico: e.target.value })}
                  className={`input-base ${formData.grupoEtnico === "" ? "border-red-500" : "border-gray-300"
                    }`}
                  disabled={docente !== null}
                >
                  <option value="">Selecciona un grupo étnico</option>
                  {gruposEtnicos.map(grupo => (
                    <option key={grupo} value={grupo}>{grupo}</option>
                  ))}
                </select>
                {formData.grupoEtnico === "" && (
                  <p className="text-red-500 text-sm mt-1">
                    ⚠️ Debe seleccionar una opción
                  </p>
                )}
              </div>
            </div>
          )}

          {(docente || notFound) && (
            <>
              <div className="divider mb-4" />

              <div className="panel p-4 mb-6">
                <div className="section-title mb-2">Cupos disponibles:</div>
                <div className="text-2xl" style={{ color: 'var(--color-brand-800)' }}>
                  {evento.cuposDisponibles}
                </div>
                <div className="section-subtitle">de {evento.cuposTotales}</div>
              </div>

              <div className="flex gap-3">
                <button onClick={handleChangeDni} className="btn-secondary flex-1">
                  Cambiar DNI
                </button>


                <button
                  onClick={handleConfirmRegister}
                  className="btn-primary flex-1"
                  disabled={evento.cuposDisponibles === 0 || !isFormValid()}
                >
                  Confirmar Registro
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Modal flotante con mensaje de éxito/error */}
      {statusMessage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/30"></div>
          <div className={`bg-white p-6 rounded-lg shadow-2xl z-50 max-w-sm text-center transition-all duration-300 transform
            ${statusType === 'success' ? 'border-l-4 border-green-500' : 'border-l-4 border-red-500'}`}>
            <p className="text-lg font-semibold">
              {statusMessage}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
