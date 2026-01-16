import { useState } from 'react';
import { ETHNIC_GROUPS } from '../data/mockData';
import type { TeacherDetails } from '../types/teacher';

interface TeacherDetailsCardProps {
  teacher: TeacherDetails;
  onDataChange?: (updatedTeacher: TeacherDetails) => void;
}

const DISABILITY_TYPES = [
  { value: 'Física (Motora)', label: 'Discapacidad Física (Motora)', desc: 'Limitaciones en movimiento y uso de extremidades.' },
  { value: 'Sensorial (Visual)', label: 'Discapacidad Sensorial (Visual)', desc: 'Disminución o pérdida de la visión.' },
  { value: 'Sensorial (Auditiva)', label: 'Discapacidad Sensorial (Auditiva)', desc: 'Disminución o pérdida de la audición.' },
  { value: 'Cognitiva', label: 'Discapacidad Cognitiva', desc: 'Dificultades en aprendizaje, memoria y razonamiento.' },
  { value: 'Múltiple', label: 'Discapacidad Múltiple', desc: 'Combinación de dos o más discapacidades.' },
];

export default function TeacherDetailsCard({ teacher, onDataChange }: TeacherDetailsCardProps) {
  const [editingTeacher, setEditingTeacher] = useState<TeacherDetails>(teacher);
  const [editMode, setEditMode] = useState(false);

  const handleChange = (field: keyof TeacherDetails, value: any) => {
    const updated = { ...editingTeacher, [field]: value };
    setEditingTeacher(updated);
    if (!editMode) onDataChange?.(updated);
  };

  const handleDisabilityTypeChange = (type: string, checked: boolean) => {
    const currentTypes = editingTeacher.disabilityTypes || [];
    const updatedTypes = checked
      ? [...currentTypes, type]
      : currentTypes.filter(t => t !== type);
    handleChange('disabilityTypes', updatedTypes);
  };

  const handleSave = () => {
    onDataChange?.(editingTeacher);
    setEditMode(false);
  };

  const ethnicDesc = ETHNIC_GROUPS[editingTeacher.ethnicGroup as keyof typeof ETHNIC_GROUPS];
  const selectedDisabilities = DISABILITY_TYPES.filter(d => editingTeacher.disabilityTypes?.includes(d.value));

  return (
    <div className="bg-white rounded-2xl p-6 md:p-8 shadow-md space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center border-b pb-4">
        <h3 className="text-2xl font-bold text-gray-800">Datos del Docente</h3>
        <button
          onClick={() => {
            if (editMode) {
              setEditingTeacher(teacher);
            }
            setEditMode(!editMode);
          }}
          className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
            editMode
              ? 'bg-red-100 text-red-700 hover:bg-red-200'
              : 'bg-teal-100 text-teal-700 hover:bg-teal-200'
          }`}
        >
          {editMode ? 'Cancelar' : 'Editar'}
        </button>
      </div>

      {/* Datos Personales */}
      <section className="space-y-4">
        <h4 className="text-lg font-semibold text-gray-800 border-b pb-2">Datos Personales</h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Nombre */}
          <div>
            <label className="text-sm text-gray-500 block mb-1">Nombre Completo</label>
            {editMode ? (
              <input
                type="text"
                value={editingTeacher.name}
                onChange={(e) => handleChange('name', e.target.value)}
                className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-teal-300"
              />
            ) : (
              <p className="text-gray-800 font-semibold">{editingTeacher.name}</p>
            )}
          </div>

          {/* DNI */}
          <div>
            <label className="text-sm text-gray-500 block mb-1">DNI</label>
            <p className="text-gray-800 font-semibold">{editingTeacher.dni}</p>
          </div>

          {/* Género */}
          <div>
            <label className="text-sm text-gray-500 block mb-1">Género</label>
            {editMode ? (
              <select
                value={editingTeacher.gender}
                onChange={(e) => handleChange('gender', e.target.value)}
                className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-teal-300"
              >
                <option value="M">Masculino</option>
                <option value="F">Femenino</option>
                <option value="Otro">Otro</option>
              </select>
            ) : (
              <p className="text-gray-800 font-semibold">
                {editingTeacher.gender === 'M' ? 'Masculino' : editingTeacher.gender === 'F' ? 'Femenino' : 'Otro'}
              </p>
            )}
          </div>

          {/* Fecha de Nacimiento */}
          <div>
            <label className="text-sm text-gray-500 block mb-1">Fecha de Nacimiento</label>
            {editMode ? (
              <input
                type="text"
                placeholder="dd/mm/yyyy"
                value={editingTeacher.birthDate}
                onChange={(e) => handleChange('birthDate', e.target.value)}
                className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-teal-300"
              />
            ) : (
              <p className="text-gray-800 font-semibold">{editingTeacher.birthDate}</p>
            )}
          </div>

          {/* Teléfono */}
          <div>
            <label className="text-sm text-gray-500 block mb-1">Teléfono</label>
            {editMode ? (
              <input
                type="text"
                value={editingTeacher.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
                className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-teal-300"
              />
            ) : (
              <p className="text-gray-800 font-semibold">{editingTeacher.phone}</p>
            )}
          </div>
        </div>
      </section>

      {/* Ubicación */}
      <section className="space-y-4">
        <h4 className="text-lg font-semibold text-gray-800 border-b pb-2">Ubicación</h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Departamento */}
          <div>
            <label className="text-sm text-gray-500 block mb-1">Departamento</label>
            {editMode ? (
              <input
                type="text"
                value={editingTeacher.department}
                onChange={(e) => handleChange('department', e.target.value)}
                className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-teal-300"
              />
            ) : (
              <p className="text-gray-800 font-semibold">{editingTeacher.department}</p>
            )}
          </div>

          {/* Municipio */}
          <div>
            <label className="text-sm text-gray-500 block mb-1">Municipio</label>
            {editMode ? (
              <input
                type="text"
                value={editingTeacher.municipality}
                onChange={(e) => handleChange('municipality', e.target.value)}
                className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-teal-300"
              />
            ) : (
              <p className="text-gray-800 font-semibold">{editingTeacher.municipality}</p>
            )}
          </div>

          {/* Ubicación General */}
          <div className="md:col-span-2">
            <label className="text-sm text-gray-500 block mb-1">Ubicación</label>
            {editMode ? (
              <input
                type="text"
                value={editingTeacher.location}
                onChange={(e) => handleChange('location', e.target.value)}
                className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-teal-300"
              />
            ) : (
              <p className="text-gray-800 font-semibold">{editingTeacher.location}</p>
            )}
          </div>
        </div>
      </section>

      {/* Información Étnica */}
      <section className="space-y-4">
        <h4 className="text-lg font-semibold text-gray-800 border-b pb-2">Información Étnica</h4>

        <div>
          <label className="text-sm text-gray-500 block mb-1">Grupo Étnico</label>
          {editMode ? (
            <select
              value={editingTeacher.ethnicGroup}
              onChange={(e) => handleChange('ethnicGroup', e.target.value)}
              className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-teal-300"
            >
              <option value="Mestizo">Mestizo</option>
              <option value="Lenca">Lenca</option>
              <option value="Maya-Chortí">Maya-Chortí</option>
              <option value="Garífuna">Garífuna</option>
              <option value="Tawahka">Tawahka</option>
              <option value="Tolupán">Tolupán</option>
              <option value="Pech">Pech</option>
              <option value="Miskito">Miskito</option>
              <option value="Nahualt">Nahualt</option>
              <option value="Creole">Negro de habla inglesa (Creole)</option>
            </select>
          ) : (
            <p className="text-gray-800 font-semibold">{editingTeacher.ethnicGroup}</p>
          )}
        </div>

        {/* Descripción del Grupo Étnico */}
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-800">{ethnicDesc}</p>
        </div>
      </section>

      {/* Discapacidad */}
      <section className="space-y-4">
        <h4 className="text-lg font-semibold text-gray-800 border-b pb-2">Información de Discapacidad</h4>

        <div>
          <label className="text-sm text-gray-500 block mb-2">¿Tiene alguna discapacidad?</label>
          {editMode ? (
            <div className="flex gap-4">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="disability"
                  checked={!editingTeacher.hasDisability}
                  onChange={() => {
                    handleChange('hasDisability', false);
                    handleChange('disabilityType', undefined);
                  }}
                  className="cursor-pointer"
                />
                <span className="text-sm text-gray-700">No</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="disability"
                  checked={editingTeacher.hasDisability}
                  onChange={() => handleChange('hasDisability', true)}
                  className="cursor-pointer"
                />
                <span className="text-sm text-gray-700">Sí</span>
              </label>
            </div>
          ) : (
            <p className="text-gray-800 font-semibold">{editingTeacher.hasDisability ? 'Sí' : 'No'}</p>
          )}
        </div>

        {/* Tipo de Discapacidad (solo si responde Sí) */}
        {editingTeacher.hasDisability && (
          <div>
            <label className="text-sm text-gray-500 block mb-3">Tipo de Discapacidad (seleccione uno o más)</label>
            {editMode ? (
              <div className="space-y-3">
                {DISABILITY_TYPES.map((dt) => (
                  <label key={dt.value} className="flex items-start gap-3 cursor-pointer p-3 border rounded-lg hover:bg-gray-50">
                    <input
                      type="checkbox"
                      checked={editingTeacher.disabilityTypes?.includes(dt.value) || false}
                      onChange={(e) => handleDisabilityTypeChange(dt.value, e.target.checked)}
                      className="mt-1 cursor-pointer accent-teal-700"
                    />
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-gray-700">{dt.label}</p>
                      <p className="text-xs text-gray-600 mt-1">{dt.desc}</p>
                    </div>
                  </label>
                ))}
              </div>
            ) : (
              <div className="space-y-2">
                {editingTeacher.disabilityTypes && editingTeacher.disabilityTypes.length > 0 ? (
                  editingTeacher.disabilityTypes.map((type) => (
                    <div key={type} className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
                      <p className="text-sm font-semibold text-amber-900">{type}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-600 text-sm italic">No especificada</p>
                )}
              </div>
            )}

            {/* Descripción de las Discapacidades */}
            {selectedDisabilities.length > 0 && !editMode && (
              <div className="mt-4 space-y-2">
                {selectedDisabilities.map((disability) => (
                  <div key={disability.value} className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
                    <p className="text-sm font-semibold text-amber-900">{disability.label}</p>
                    <p className="text-sm text-amber-800 mt-1">{disability.desc}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </section>

      {/* Botones */}
      {editMode && (
        <div className="flex gap-3 pt-4 border-t">
          <button
            onClick={() => {
              setEditingTeacher(teacher);
              setEditMode(false);
            }}
            className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-semibold"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            className="flex-1 px-4 py-2 bg-teal-800 text-white rounded-lg hover:bg-teal-700 transition-colors font-semibold"
          >
            Guardar Cambios
          </button>
        </div>
      )}
    </div>
  );
}
