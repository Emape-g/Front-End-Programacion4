import { useState } from 'react';
import FormularioRegistro from './components/FormularioRegistro';
import ListaParticipantes from './components/ListaParticipantes';
import FiltrosBusqueda from './components/FiltrosBusqueda';
import type { Participante } from './types';

function App() {
  // Cargamos desde el localStorage al iniciar 
  const [participantes, setParticipantes] = useState<Participante[]>(() => {
    const datosGuardados = localStorage.getItem('participantes_tp2');
    return datosGuardados ? JSON.parse(datosGuardados) : [];
  });

  // Estado para los filtros de búsqueda
  const [filtros, setFiltros] = useState({
    nombre: '',
    modalidad: '',
    nivel: ''
  });

  // Guardamos en el LocalStorage justo en el momento de AGREGAR
  const agregarParticipante = (nuevo: Participante) => {
    const nuevaLista = [...participantes, nuevo];
    setParticipantes(nuevaLista); // Actualizamos la pantalla
    localStorage.setItem('participantes_tp2', JSON.stringify(nuevaLista)); // Guardamos en el navegador
  };

  //  Guardamos en el LocalStorage justo en el momento de ELIMINAR
  const eliminarParticipante = (id: number) => {
    const nuevaLista = participantes.filter(p => p.id !== id);
    setParticipantes(nuevaLista); // Actualizamos la pantalla
    localStorage.setItem('participantes_tp2', JSON.stringify(nuevaLista)); // Guardamos en el navegador
  };

  // Lógica de filtrado en tiempo real
  const participantesFiltrados = participantes.filter(p => {
    const coincideNombre = p.nombre.toLowerCase().includes(filtros.nombre.toLowerCase());
    const coincideModalidad = filtros.modalidad === '' || p.modalidad === filtros.modalidad;
    const coincideNivel = filtros.nivel === '' || p.nivel === filtros.nivel;
    return coincideNombre && coincideModalidad && coincideNivel;
  });

  return (
    <div className="max-w-6xl mx-auto p-6 bg-gray-50 min-h-screen">
      <h1 className="text-4xl font-extrabold text-center mb-8 text-transparent bg-clip-text bg-gradient-to-r from-blue-700 to-indigo-600">
        Registro de Evento Tecnológico
      </h1>
      
      
      <div className="text-right mb-4 font-semibold text-gray-700">
        Participantes registrados: {participantes.length}
      </div>
      
      {/*  Formulario */}
      <FormularioRegistro onAgregar={agregarParticipante} />
      
      
      {participantes.length > 0 && (
        <>
          {/*  Filtros de Búsqueda */}
          <FiltrosBusqueda filtros={filtros} setFiltros={setFiltros} />

          {/*  Lista de tarjetas (Le pasamos los filtrados, no todos) */}
          <ListaParticipantes 
            participantes={participantesFiltrados} 
            onEliminar={eliminarParticipante} 
          />
        </>
      )}
    </div>
  )
}

export default App;