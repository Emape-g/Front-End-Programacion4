import { useState, useEffect } from 'react';
import FormularioRegistro from './components/FormularioRegistro';
import ListaParticipantes from './components/ListaParticipantes';
import FiltrosBusqueda from './components/FiltrosBusqueda';
import { Participante } from './models/Participante';

function App() {
  const [participantes, setParticipantes] = useState<Participante[]>(() => {
    const datosGuardados = localStorage.getItem('participantes');
    return datosGuardados ? JSON.parse(datosGuardados) : [];
  });

  const [filtros, setFiltros] = useState({
    nombre: '',
    modalidad: '',
    nivel: ''
  });

  useEffect(() => {
    localStorage.setItem('participantes', JSON.stringify(participantes));
  }, [participantes]);

  const agregarParticipante = (nuevo: Participante) => {
    setParticipantes([...participantes, nuevo]);
  };

  const eliminarParticipante = (id: number) => {
    setParticipantes(participantes.filter(p => p.id !== id));
  };

  const limpiarFiltros = () => {
    setFiltros({ nombre: '', modalidad: '', nivel: '' });
  };

  const resetearDatos = () => {
    if (window.confirm("¿Estás seguro de que querés borrar todos los datos?")) {
      localStorage.removeItem('participantes');
      setParticipantes([]);
    }
  };

  const participantesFiltrados = participantes.filter(p => {
    const coincideNombre = p.nombre.toLowerCase().includes(filtros.nombre.toLowerCase());
    const coincideModalidad = filtros.modalidad === '' || p.modalidad === filtros.modalidad;
    const coincideNivel = filtros.nivel === '' || p.nivel === filtros.nivel;
    return coincideNombre && coincideModalidad && coincideNivel;
  });

  const hayFiltrosActivos = participantesFiltrados.length !== participantes.length;

  return (
    <div className="max-w-6xl mx-auto p-6 bg-gray-50 min-h-screen">
      
      {/* Encabezado y Botón Reset General */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-8">
        <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-700 to-indigo-600">
          Registro de Evento
        </h1>
        {participantes.length > 0 && (
          <button 
            onClick={resetearDatos}
            className="mt-4 sm:mt-0 bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700 font-medium px-4 py-2 rounded-lg transition-colors border border-red-200 text-sm shadow-sm"
          >
            Borrar todos los datos
          </button>
        )}
      </div>
      
      <FormularioRegistro onAgregar={agregarParticipante} />
      
      {participantes.length > 0 ? (
        <>
          <div className="relative">
            <FiltrosBusqueda filtros={filtros} setFiltros={setFiltros} />
            
            {hayFiltrosActivos && (
              <div className="flex justify-end mb-6 -mt-2">
                <button 
                  onClick={limpiarFiltros}
                  className="flex items-center gap-2 bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 hover:text-indigo-600 hover:border-indigo-300 px-4 py-2 rounded-lg shadow-sm transition-all duration-200 text-sm font-medium"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  Limpiar filtros
                </button>
              </div>
            )}
          </div>

          {/* Sección de la Lista con el Contador Integrado */}
          <div className="flex justify-between items-center mb-6 mt-4 border-b border-gray-200 pb-2">
            <h2 className="text-2xl font-bold text-gray-800">Participantes Registrados</h2>
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
              onEliminar={eliminarParticipante} 
            />
          ) : (
            <div className="text-center py-12 bg-white rounded-xl border border-gray-100 shadow-sm">
              <p className="text-gray-500 text-lg font-medium">No hay participantes que coincidan con los filtros.</p>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-12 bg-white rounded-xl border border-gray-100 shadow-sm mt-8">
          <p className="text-gray-500 text-lg font-medium">Todavía no hay participantes registrados.</p>
        </div>
      )}
    </div>
  )
}

export default App;