import type { Participante } from '../types';

interface Props {
  participantes: Participante[];
  onEliminar: (id: number) => void;
}

export default function ListaParticipantes({ participantes, onEliminar }: Props) {
  const getColorNivel = (nivel: string) => {
    if (nivel === 'Principiante') return 'border-t-4 border-green-400';
    if (nivel === 'Intermedio') return 'border-t-4 border-yellow-400';
    if (nivel === 'Avanzado') return 'border-t-4 border-red-400';
    return '';
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {participantes.map((p) => (
        <div 
          key={p.id} 
          
          className={`bg-white rounded-xl p-6 shadow-sm hover:-translate-y-1 hover:shadow-xl transition-all duration-300 border border-gray-100 ${getColorNivel(p.nivel)}`}
        >
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="font-bold text-xl text-gray-800 tracking-tight">{p.nombre}</h3>
              <p className="text-gray-500 text-sm font-medium">{p.pais}</p>
            </div>
            <button 
              onClick={() => onEliminar(p.id)}
              className="text-red-400 hover:text-red-600 hover:bg-red-50 px-2 py-1 rounded transition-colors text-sm font-semibold"
            >
              Eliminar
            </button>
          </div>
          
          <div className="space-y-3 text-sm text-gray-600">
            <div className="flex justify-between border-b pb-2">
              <span className="font-medium">Modalidad:</span>
              <span className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full text-xs font-semibold">{p.modalidad}</span>
            </div>
            
            <div className="flex justify-between border-b pb-2">
              <span className="font-medium">Nivel:</span>
              <span className="font-semibold text-gray-800">{p.nivel}</span>
            </div>

            <div className="pt-1">
              <span className="font-medium block mb-2">Tecnologías:</span>
              <div className="flex flex-wrap gap-2">
                {p.tecnologias.map(t => (
                  <span key={t} className="bg-indigo-50 text-indigo-600 border border-indigo-100 px-3 py-1 rounded-full text-xs font-bold shadow-sm">
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}