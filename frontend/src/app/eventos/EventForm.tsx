import { useState, useEffect } from 'react';
import { Evento, areas, eventos, departamentosHonduras } from '../../lib/mockData';
import { ArrowLeft, Upload } from 'lucide-react';

interface EventFormProps {
  evento?: Evento;
  onBack: () => void;
  onSave: (evento: Evento) => void;
}

export default function EventForm({ evento, onBack, onSave }: EventFormProps) {
  const isEdit = !!evento;
  
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    regional: '',
    areaId: '',
    areaNombre: '',
    terapiaOClase: 'terapia' as 'terapia' | 'clase',
    diasSemana: [] as string[],
    departamento: '',
    municipio: '',
    direccion: '',
    fechaInicio: '',
    fechaFin: '',
    horaInicio: '',
    horaFin: '',
    cuposDisponibles: 0,
    cuposTotales: 0,
    imagen: '',
    estado: 'activo' as 'activo' | 'pospuesto' | 'cancelado'
  });

  const [imageFile, setImageFile] = useState<string>('');

  useEffect(() => {
    if (evento) {
      setFormData({
        nombre: evento.nombre,
        descripcion: evento.descripcion,
        regional: evento.regional,
        areaId: evento.areaId,
        areaNombre: evento.areaNombre,
        terapiaOClase: evento.terapiaOClase,
        diasSemana: evento.diasSemana,
        departamento: evento.departamento,
        municipio: evento.municipio,
        direccion: evento.direccion,
        fechaInicio: evento.fechaInicio,
        fechaFin: evento.fechaFin,
        horaInicio: evento.horaInicio,
        horaFin: evento.horaFin,
        cuposDisponibles: evento.cuposDisponibles,
        cuposTotales: evento.cuposTotales,
        imagen: evento.imagen || '',
        estado: evento.estado
      });
      setImageFile(evento.imagen || '');
    }
  }, [evento]);

  const diasSemanaOptions = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

  const handleDiaToggle = (dia: string) => {
    setFormData(prev => ({
      ...prev,
      diasSemana: prev.diasSemana.includes(dia)
        ? prev.diasSemana.filter(d => d !== dia)
        : [...prev.diasSemana, dia]
    }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageFile(reader.result as string);
        setFormData(prev => ({ ...prev, imagen: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    if (isEdit && evento) {
      // Actualizar evento existente
      const index = eventos.findIndex(e => e.id === evento.id);
      if (index !== -1) {
        eventos[index] = {
          ...evento,
          ...formData
        };
        onSave(eventos[index]);
      }
    } else {
      // Crear nuevo evento
      const newEvento: Evento = {
        id: `${eventos.length + 1}`,
        ...formData,
        cuposDisponibles: formData.cuposTotales,
        estado: 'activo'
      };
      eventos.push(newEvento);
      onSave(newEvento);
    }
  };

  return (
    <div className="page-shell">
      <div className="mb-6">
        <button onClick={onBack} className="btn-secondary mb-4 gap-2">
          <ArrowLeft className="w-4 h-4" />
          Volver
        </button>
        <div className="text-center">
        <h1 className="text-3xl sm:text-4xl">{isEdit ? 'Editar Evento' : 'Crear Evento'}</h1>
        <p className="section-subtitle mt-2">
          {isEdit ? 'Modifica la información del evento' : 'Completa la información del nuevo evento'}
        </p>
        </div>
      </div>

      <div className="panel p-4 sm:p-6 max-w-4xl mx-auto">
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="label-base">Nombre del Evento</label>
              <input
                type="text"
                value={formData.nombre}
                onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                className="input-base"
                placeholder="Ej: Motivación"
              />
            </div>

            <div>
              <label className="label-base">Regional</label>
              <input
                type="text"
                value={formData.regional}
                onChange={(e) => setFormData({ ...formData, regional: e.target.value })}
                className="input-base"
                placeholder="Ej: Central"
              />
            </div>
          </div>

          <div>
            <label className="label-base">Descripción</label>
            <textarea
              value={formData.descripcion}
              onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
              className="input-base"
              rows={3}
              placeholder="Describe el evento"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="label-base">Área</label>
              <select
                value={formData.areaId}
                onChange={(e) => {
                  const area = areas.find(a => a.id === e.target.value);
                  setFormData({ 
                    ...formData, 
                    areaId: e.target.value,
                    areaNombre: area?.nombre || ''
                  });
                }}
                className="input-base"
              >
                <option value="">Selecciona un área</option>
                {areas.map(area => (
                  <option key={area.id} value={area.id}>{area.nombre}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="label-base">Tipo</label>
              <select
                value={formData.terapiaOClase}
                onChange={(e) => setFormData({ ...formData, terapiaOClase: e.target.value as any })}
                className="input-base"
              >
                <option value="terapia">Terapia</option>
                <option value="clase">Clase</option>
              </select>
            </div>
          </div>

          <div>
            <label className="label-base">Días de la Semana</label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-2">
              {diasSemanaOptions.map(dia => (
                <label key={dia} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.diasSemana.includes(dia)}
                    onChange={() => handleDiaToggle(dia)}
                    className="rounded border-gray-300"
                  />
                  <span className="text-sm">{dia}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="label-base">Departamento</label>
              <select
                value={formData.departamento}
                onChange={(e) => setFormData({ ...formData, departamento: e.target.value })}
                className="input-base"
              >
                <option value="">Selecciona un departamento</option>
                {departamentosHonduras.map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="label-base">Municipio</label>
              <input
                type="text"
                value={formData.municipio}
                onChange={(e) => setFormData({ ...formData, municipio: e.target.value })}
                className="input-base"
                placeholder="Ej: Tegucigalpa"
              />
            </div>
          </div>

          <div>
            <label className="label-base">Ubicación/Dirección</label>
            <input
              type="text"
              value={formData.direccion}
              onChange={(e) => setFormData({ ...formData, direccion: e.target.value })}
              className="input-base"
              placeholder="Ej: Instalaciones INPREMA"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="label-base">Fecha de Inicio</label>
              <input
                type="date"
                value={formData.fechaInicio}
                onChange={(e) => setFormData({ ...formData, fechaInicio: e.target.value })}
                className="input-base"
              />
            </div>

            <div>
              <label className="label-base">Fecha de Finalización</label>
              <input
                type="date"
                value={formData.fechaFin}
                onChange={(e) => setFormData({ ...formData, fechaFin: e.target.value })}
                className="input-base"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="label-base">Hora de Inicio</label>
              <input
                type="time"
                value={formData.horaInicio}
                onChange={(e) => setFormData({ ...formData, horaInicio: e.target.value })}
                className="input-base"
              />
            </div>

            <div>
              <label className="label-base">Hora de Finalización</label>
              <input
                type="time"
                value={formData.horaFin}
                onChange={(e) => setFormData({ ...formData, horaFin: e.target.value })}
                className="input-base"
              />
            </div>
          </div>

          <div>
            <label className="label-base">Cupos Disponibles</label>
            <input
              type="number"
              value={formData.cuposTotales}
              onChange={(e) => {
                const total = parseInt(e.target.value) || 0;
                setFormData({ 
                  ...formData, 
                  cuposTotales: total,
                  cuposDisponibles: isEdit ? formData.cuposDisponibles : total
                });
              }}
              className="input-base"
              min="0"
              placeholder="Ej: 25"
            />
          </div>

          {isEdit && (
            <div>
              <label className="label-base">Estado del Evento</label>
              <select
                value={formData.estado}
                onChange={(e) => setFormData({ ...formData, estado: e.target.value as any })}
                className="input-base"
              >
                <option value="activo">Activo</option>
                <option value="pospuesto">Pospuesto</option>
                <option value="cancelado">Cancelado</option>
              </select>
              <p className="text-xs mt-1" style={{ color: 'var(--color-ink-500)' }}>
                {formData.estado === 'pospuesto' && 'Los usuarios no podrán registrarse en este evento'}
                {formData.estado === 'cancelado' && 'El evento no se mostrará en la lista'}
              </p>
            </div>
          )}

          <div>
            <label className="label-base">Imagen del Evento</label>
            <div className="mt-2">
              <label className="btn-secondary cursor-pointer gap-2">
                <Upload className="w-4 h-4" />
                Subir imagen
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>
              {imageFile && (
                <div className="mt-4">
                  <img
                    src={imageFile}
                    alt="Preview"
                    className="max-w-xs rounded-lg border"
                  />
                </div>
              )}
            </div>
          </div>

          <div className="divider" />

          <div className="flex gap-3 justify-end">
            <button onClick={onBack} className="btn-secondary px-6">
              Cancelar
            </button>
            <button onClick={handleSave} className="btn-primary px-6">
              {isEdit ? 'Guardar Cambios' : 'Crear Evento'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
