import React from 'react';

// Le pasamos los filtros actuales y la función para cambiarlos
interface Props {
  filtros: { nombre: string; modalidad: string; nivel: string };
  setFiltros: React.Dispatch<React.SetStateAction<{ nombre: string; modalidad: string; nivel: string }>>;
}

export default function FiltrosBusqueda({ filtros, setFiltros }: Props) {
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFiltros({ ...filtros, [e.target.name]: e.target.value });
  };

  return (
    <div className="bg-white shadow rounded p-4 mb-8 flex flex-col md:flex-row gap-4 items-center justify-between">
      
      {/* Buscar por nombre */}
      <div className="flex items-center gap-2 w-full md:w-1/3">
        <label className="font-medium text-gray-700">Buscar:</label>
        <input 
          type="text" 
          name="nombre" 
          value={filtros.nombre} 
          onChange={handleChange} 
          className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 w-full" 
          placeholder="Nombre..." 
        />
      </div>

      {/* Filtrar por modalidad */}
      <div className="flex items-center gap-2 w-full md:w-1/3">
        <label className="font-medium text-gray-700">Modalidad:</label>
        <select name="modalidad" value={filtros.modalidad} onChange={handleChange} className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 w-full">
          <option value="">Todas</option>
          <option value="Presencial">Presencial</option>
          <option value="Virtual">Virtual</option>
          <option value="Híbrido">Híbrido</option>
        </select>
      </div>

      {/* Filtrar por nivel */}
      <div className="flex items-center gap-2 w-full md:w-1/3">
        <label className="font-medium text-gray-700">Nivel:</label>
        <select name="nivel" value={filtros.nivel} onChange={handleChange} className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 w-full">
          <option value="">Todos</option>
          <option value="Principiante">Principiante</option>
          <option value="Intermedio">Intermedio</option>
          <option value="Avanzado">Avanzado</option>
        </select>
      </div>

    </div>
  );
}