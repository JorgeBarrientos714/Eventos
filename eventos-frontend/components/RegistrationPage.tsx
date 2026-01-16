import { useEffect, useState } from 'react';
import { ArrowLeft, MapPin, Phone, User, CheckCircle } from 'lucide-react';
import { findTeacherByDNI } from '../data/mockData';
import TeacherDetailsCard from './TeacherDetailsCard';
import type { Event } from '../types/event';
import type { Teacher, TeacherDetails } from '../types/teacher';

interface RegistrationProps {
  event: Event;
  onBack: () => void;
  onConfirm: (teacherDni: string) => void;
}

type RegistrationStep = 'input' | 'confirmed' | 'success';

export function Registration({ event, onBack, onConfirm }: RegistrationProps) {
  const [step, setStep] = useState<RegistrationStep>('input');
  const [dni, setDni] = useState('');
  const [teacher, setTeacher] = useState<TeacherDetails | null>(null);
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');

  useEffect(() => {
    // Mensaje inicial al ingresar a la página de registros
    setInfo('Por favor, ingrese su número de identidad (solo números, máximo 15).');
  }, []);

  const handleSearch = () => {
    if (!dni.trim()) {
      setError('Por favor ingrese un número de identidad');
      return;
    }
    if (dni.length > 15) {
      setError('El número de identidad debe tener máximo 15 dígitos');
      return;
    }

    const foundTeacher = findTeacherByDNI(dni);
    if (foundTeacher) {
      setTeacher(foundTeacher);
      setStep('confirmed');
      setError('');
      setInfo(''); // Limpiar info al encontrar docente
    } else {
      setError('No se encontró ningún docente con el número de identidad ingresado');
      setTeacher(null);
    }
  };

  const handleConfirm = () => {
    if (teacher) {
      onConfirm(teacher.dni);
      setStep('success');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  if (step === 'success') {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 py-8">
        <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 max-w-md w-full text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full mx-auto mb-6 flex items-center justify-center">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>
          
          <h2 className="text-2xl md:text-3xl text-[#0d7d6e] mb-4" style={{ fontWeight: 700 }}>
            ¡Inscripción Exitosa!
          </h2>
          
          <p className="text-gray-600 mb-2">
            Tu inscripción al evento
          </p>
          <p className="text-xl text-gray-800 mb-6" style={{ fontWeight: 600 }}>
            {event.title}
          </p>
          
          <p className="text-gray-600 mb-8">
            ha sido confirmada exitosamente
          </p>
          
          <button
            onClick={onBack}
            className="w-full bg-[#0d7d6e] text-white py-3 rounded-full hover:bg-[#0a6356] transition-colors"
            style={{ fontWeight: 600 }}
          >
            Volver a Eventos
          </button>
        </div>
      </div>
    );
  }

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
          <span className="text-lg" style={{ fontWeight: 500 }}>Regresar</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Event Details */}
          <div>
            <h2 className="text-3xl md:text-4xl text-[#0d7d6e] mb-6" style={{ fontWeight: 700 }}>
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
                  <div className="w-2 h-2 bg-white border-2 border-gray-400 rounded-full" />
                  <div className="w-2 h-2 bg-white border-2 border-gray-400 rounded-full" />
                  <div className="w-2 h-2 bg-white border-2 border-gray-400 rounded-full" />
                </div>
                
                <h3 className="text-2xl md:text-3xl text-gray-800 mb-4 text-center" style={{ fontWeight: 700 }}>
                  {event.title}
                </h3>
                
                <p className="text-gray-600 mb-6 leading-relaxed">
                  {event.description}
                </p>
                
                <div className="space-y-2 text-gray-700">
                  <p>{event.date}</p>
                  <p>{event.time}</p>
                  <p>{event.location}</p>
                </div>
                
                <div className="flex gap-3 mt-6 text-gray-600">
                  <MapPin className="w-5 h-5" />
                  <Phone className="w-5 h-5" />
                  <User className="w-5 h-5" />
                </div>
              </div>
            </div>
          </div>

          {/* Registration Form */}
          <div>
            <h2 className="text-3xl md:text-4xl text-[#0d7d6e] mb-6 lg:opacity-0" style={{ fontWeight: 700 }}>
              Inscripción
            </h2>
            
            <div className="bg-white rounded-2xl p-6 md:p-8 shadow-md">
              <h3 className="text-xl text-gray-800 mb-6" style={{ fontWeight: 600 }}>
                Ingrese su número de identidad
              </h3>
              
              <div className="mb-6">
                <input
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  value={dni}
                  onChange={(e) => {
                    const digitsOnly = e.target.value.replace(/\D/g, '');
                    setDni(digitsOnly.slice(0, 15));
                  }}
                  onKeyPress={handleKeyPress}
                  placeholder="0801196601254"
                  className="w-full px-4 py-3 bg-[#f3f3f3] rounded-full focus:outline-none focus:ring-2 focus:ring-[#0d7d6e] text-center"
                  style={{ fontWeight: 600 }}
                  disabled={step === 'confirmed'}
                />
              </div>

              {info && (
                <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-blue-700 text-sm text-center">{info}</p>
                </div>
              )}

              {error && (
                <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-600 text-sm text-center">{error}</p>
                </div>
              )}

              {step === 'input' && (
                <button
                  onClick={handleSearch}
                  className="w-full md:w-auto px-8 py-2.5 bg-[#0d7d6e] text-white rounded-full hover:bg-[#0a6356] transition-colors mx-auto block"
                  style={{ fontWeight: 600 }}
                >
                  Buscar
                </button>
              )}

              {step === 'confirmed' && teacher && (
                <div className="space-y-6">
                  <TeacherDetailsCard 
                    teacher={teacher}
                    onDataChange={(updated) => setTeacher(updated)}
                  />

                  <div className="flex gap-3">
                    <button
                      onClick={() => {
                        setStep('input');
                        setTeacher(null);
                        setDni('');
                        setInfo('Por favor, ingrese su número de identidad (solo números, máximo 15).');
                      }}
                      className="flex-1 px-6 py-2.5 bg-gray-200 text-gray-700 rounded-full hover:bg-gray-300 transition-colors"
                      style={{ fontWeight: 600 }}
                    >
                      Cancelar
                    </button>
                    <button
                      onClick={handleConfirm}
                      className="flex-1 px-6 py-2.5 bg-[#0d7d6e] text-white rounded-full hover:bg-[#0a6356] transition-colors"
                      style={{ fontWeight: 600 }}
                    >
                      Confirmar Inscripción
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
