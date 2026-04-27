import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import FiltrosBusqueda from '../components/FiltrosBusqueda';
import ListaParticipantes from '../components/ListaParticipantes';
import { useParticipantes } from '../context/ParticipantesContext';

export default function ListaPage() {
  const { participantes, eliminar, resetear } = useParticipantes();
  const navigate = useNavigate();

  const [filtros, setFiltros] = useState({ nombre: '', modalidad: '', nivel: '' });

  const limpiarFiltros = () => setFiltros({ nombre: '', modalidad: '', nivel: '' });

  const resetearDatos = () => {
    if (window.confirm("¿Estás seguro de que querés borrar todos los datos?")) {
      resetear();
    }
  };

  // Función para navegar a la página de edición
  const handleEditar = (p: any) => {
    navigate(`/editar/${p.id}`);
  };

  const participantesFiltrados = participantes.filter(p => {
    const coincideNombre = p.nombre.toLowerCase().includes(filtros.nombre.toLowerCase());
    const coincideModalidad = filtros.modalidad === '' || p.modalidad === filtros.modalidad;
    const coincideNivel = filtros.nivel === '' || p.nivel === filtros.nivel;
    return coincideNombre && coincideModalidad && coincideNivel;
  });

  const hayFiltrosActivos = participantesFiltrados.length !== participantes.length;

  return (
    <>
      <div className="flex flex-col sm:flex-row justify-between items-center mb-8">
        <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-700 to-indigo-600">
          Registro de Evento
        </h1>
        
        <div className="flex gap-4 mt-4 sm:mt-0">
          {participantes.length > 0 && (
            <button
              onClick={resetearDatos}
              className="bg-red-50 text-red-600 hover:bg-red-100 font-medium px-4 py-2 rounded-lg transition-colors border border-red-200 text-sm shadow-sm"
            >
              Borrar todos los datos
            </button>
          )}
          {/* Botón para ir a /nuevo */}
          <Link 
            to="/nuevo" 
            className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold px-6 py-2 rounded-xl shadow-lg hover:shadow-indigo-500/30 transition-all duration-300"
          >
            + Nuevo Participante
          </Link>
        </div>
      </div>

      {participantes.length > 0 ? (
        <>
          <FiltrosBusqueda filtros={filtros} setFiltros={setFiltros} />

          {hayFiltrosActivos && (
            <div className="flex justify-end mb-6 -mt-2">
              <button
                onClick={limpiarFiltros}
                className="text-gray-700 hover:text-indigo-600 px-4 py-2 rounded-lg text-sm font-medium"
              >
                Limpiar filtros
              </button>
            </div>
          )}

          <div className="flex justify-between items-center mb-6 mt-4 border-b border-gray-200 pb-2">
            <h2 className="text-2xl font-bold text-gray-800 text-left">Participantes Registrados</h2>
            <div className="font-semibold text-sm bg-indigo-50 text-indigo-700 px-4 py-1.5 rounded-full border border-indigo-100">
              {hayFiltrosActivos
                ? `Mostrando ${participantesFiltrados.length} de ${participantes.length}`
                : `Total: ${participantes.length}`
              }
            </div>
          </div>

          {participantesFiltrados.length > 0 ? (
            <ListaParticipantes
              participantes={participantesFiltrados}
              onEliminar={eliminar}
              onEditar={handleEditar} 
            />
          ) : (
            <div className="text-center py-12 bg-white rounded-xl border border-gray-100 shadow-sm">
              <p className="text-gray-500 text-lg font-medium">No hay resultados.</p>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-12 bg-white rounded-xl border border-gray-100 shadow-sm mt-8">
          <p className="text-gray-500 text-lg font-medium">No hay participantes registrados.</p>
        </div>
      )}
    </>
  );
}