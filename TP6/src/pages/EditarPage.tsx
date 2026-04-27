import { useParams, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useParticipantes } from "../context/ParticipantesContext";
import FormularioRegistro from "../components/FormularioRegistro"; // Nombre actualizado

export default function EditarPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const { participantes, seleccionar } = useParticipantes();

  useEffect(() => {
    const participante = participantes.find(p => String(p.id) === String(id));
    
    if (participante) {
      seleccionar(participante);
    }
  }, [id, participantes, seleccionar]);

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Editar Participante</h1>
      <FormularioRegistro onSuccess={() => navigate("/")} />
    </div>
  );
}