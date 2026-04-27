import React, { useState, useEffect } from 'react';
import type { Participante } from '../models/Participante'; // Ajustá la ruta de tu modelo si es necesario
import { useParticipantes } from '../context/ParticipantesContext';

// NUEVO: Recibe el participante a editar y la función para volver al inicio
interface Props {
  participanteEditar?: Participante | null;
  onSuccess: () => void;
}

export default function FormularioRegistro({ participanteEditar, onSuccess }: Props) {
  // NUEVO: Traemos tu lógica asíncrona del contexto
  const { agregar, editar } = useParticipantes();

  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    edad: '',
    pais: 'Argentina',
    modalidad: '',
    tecnologias: [] as string[],
    nivel: 'Principiante',
    aceptaTerminos: false
  });

  const listaTecnologias = ['React', 'Angular', 'Vue', 'Node', 'Python', 'Java'];

  // NUEVO: Si nos pasan un participante para editar, llenamos los campos
  useEffect(() => {
    if (participanteEditar) {
      setFormData({
        nombre: participanteEditar.nombre,
        email: participanteEditar.email,
        edad: String(participanteEditar.edad),
        pais: participanteEditar.pais,
        modalidad: participanteEditar.modalidad,
        tecnologias: participanteEditar.tecnologias || [],
        nivel: participanteEditar.nivel,
        aceptaTerminos: participanteEditar.aceptaTerminos || false
      });
    }
  }, [participanteEditar]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;

    if (type === 'checkbox' && name === 'aceptaTerminos') {
      setFormData({ ...formData, aceptaTerminos: (e.target as HTMLInputElement).checked });
    } else if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      if (checked) {
        setFormData({ ...formData, tecnologias: [...formData.tecnologias, value] });
      } else {
        setFormData({ ...formData, tecnologias: formData.tecnologias.filter(t => t !== value) });
      }
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // NUEVO: Lógica de guardado con el Contexto
    if (participanteEditar) {
      await editar({
        ...formData,
        id: participanteEditar.id,
        edad: Number(formData.edad)
      } as Participante);
    } else {
      await agregar({
        ...formData,
        id: String(Date.now()), // O como manejes el ID en la creación
        edad: Number(formData.edad)
      } as Participante);
    }
    
    // NUEVO: Volvemos a la lista
    onSuccess();
  };

  return (
    <div className="bg-white shadow-xl rounded-2xl p-8 mb-10 border border-gray-100 text-left">
      
      <div className="mb-6 border-b border-gray-100 pb-4">
        <h2 className="text-2xl font-bold text-gray-800 tracking-tight">
          {participanteEditar ? 'Editar Participante' : 'Nuevo Participante'}
        </h2>
        <p className="text-gray-500 text-sm mt-1">
          {participanteEditar ? 'Modificá los datos del registro.' : 'Completá los datos para registrar un nuevo ingreso al evento.'}
        </p>
      </div>
      
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Nombre */}
        <div className="flex flex-col group">
          <label className="mb-2 text-sm font-bold text-gray-700 group-focus-within:text-indigo-600 transition-colors">Nombre completo</label>
          <input type="text" name="nombre" value={formData.nombre} onChange={handleChange} placeholder="Ej. Juan Pérez" required 
            className="bg-gray-50 border border-gray-200 text-gray-800 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent focus:bg-white transition-all duration-200" 
          />
        </div>

        {/* Email */}
        <div className="flex flex-col group">
          <label className="mb-2 text-sm font-bold text-gray-700 group-focus-within:text-indigo-600 transition-colors">Correo electrónico</label>
          <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="juan@ejemplo.com" required 
            className="bg-gray-50 border border-gray-200 text-gray-800 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent focus:bg-white transition-all duration-200" 
          />
        </div>

        {/* Edad */}
        <div className="flex flex-col group">
          <label className="mb-2 text-sm font-bold text-gray-700 group-focus-within:text-indigo-600 transition-colors">Edad</label>
          <input type="number" name="edad" value={formData.edad} onChange={handleChange} placeholder="18" min="1" required 
            className="bg-gray-50 border border-gray-200 text-gray-800 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent focus:bg-white transition-all duration-200" 
          />
        </div>

        {/* País */}
        <div className="flex flex-col group">
          <label className="mb-2 text-sm font-bold text-gray-700 group-focus-within:text-indigo-600 transition-colors">País de residencia</label>
          <select name="pais" value={formData.pais} onChange={handleChange} 
            className="bg-gray-50 border border-gray-200 text-gray-800 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent focus:bg-white transition-all duration-200 cursor-pointer"
          >
            <option value="Argentina">Argentina</option>
            <option value="Chile">Chile</option>
            <option value="Uruguay">Uruguay</option>
            <option value="México">México</option>
            <option value="España">España</option>
          </select>
        </div>

        {/* Modalidad */}
        <div className="flex flex-col md:col-span-2 mt-2">
          <label className="mb-3 text-sm font-bold text-gray-700">Modalidad de asistencia</label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {['Presencial', 'Virtual', 'Híbrido'].map((mod) => (
              <label key={mod} className={`flex items-center justify-center gap-2 p-3 border rounded-xl cursor-pointer transition-all duration-200 ${formData.modalidad === mod ? 'border-indigo-500 bg-indigo-50 text-indigo-700 font-semibold shadow-sm' : 'border-gray-200 bg-gray-50 text-gray-600 hover:bg-gray-100'}`}>
                <input type="radio" name="modalidad" value={mod} onChange={handleChange} checked={formData.modalidad === mod} required className="accent-indigo-600 w-4 h-4" /> 
                {mod}
              </label>
            ))}
          </div>
        </div>

        {/* Tecnologías */}
        <div className="flex flex-col md:col-span-2 mt-2">
          <label className="mb-3 text-sm font-bold text-gray-700">Tecnologías conocidas</label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {listaTecnologias.map(tech => (
              <label key={tech} className="flex items-center gap-3 p-3 border border-gray-100 rounded-xl cursor-pointer hover:bg-gray-50 hover:border-indigo-200 transition-colors bg-white shadow-sm">
                <input type="checkbox" name="tecnologias" value={tech} onChange={handleChange} checked={formData.tecnologias.includes(tech)} className="accent-indigo-600 w-5 h-5 rounded" /> 
                <span className="font-medium text-gray-700">{tech}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Nivel de Experiencia */}
        <div className="flex flex-col group mt-2 md:col-span-2 lg:col-span-1">
          <label className="mb-2 text-sm font-bold text-gray-700 group-focus-within:text-indigo-600 transition-colors">Nivel de experiencia</label>
          <select name="nivel" value={formData.nivel} onChange={handleChange} 
            className="bg-gray-50 border border-gray-200 text-gray-800 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent focus:bg-white transition-all duration-200 cursor-pointer"
          >
            <option value="Principiante">Principiante</option>
            <option value="Intermedio">Intermedio</option>
            <option value="Avanzado">Avanzado</option>
          </select>
        </div>

        {/* Acepta Términos */}
        <div className="flex items-center md:col-span-2 mt-4 bg-blue-50 p-4 rounded-xl border border-blue-100">
          <label className="flex items-center gap-3 text-gray-700 cursor-pointer w-full">
            <input type="checkbox" name="aceptaTerminos" checked={formData.aceptaTerminos} onChange={handleChange} required className="accent-blue-600 w-5 h-5 rounded flex-shrink-0" />
            <span className="text-sm font-medium">Declaro que la información es correcta y acepto los <a href="#" className="text-blue-600 hover:underline">términos y condiciones</a> del evento.</span>
          </label>
        </div>

        {/* Botones de Envío y Cancelar (NUEVO) */}
        <div className="md:col-span-2 mt-6 flex justify-end gap-3">
          <button 
            type="button" 
            onClick={onSuccess}
            className="px-6 py-3.5 rounded-xl font-bold text-gray-600 hover:bg-gray-100 transition-colors"
          >
            Cancelar
          </button>
          <button type="submit" 
            className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold px-10 py-3.5 rounded-xl shadow-lg hover:shadow-indigo-500/30 hover:from-blue-700 hover:to-indigo-700 transform hover:-translate-y-1 transition-all duration-300"
          >
            {participanteEditar ? 'Actualizar Participante' : 'Registrar Participante'}
          </button>
        </div>

      </form>
    </div>
  );
}
