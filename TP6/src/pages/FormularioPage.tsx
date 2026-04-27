import { useNavigate } from "react-router-dom";
import FormularioRegistro from "../components/FormularioRegistro";

export default function FormularioPage() {
  const navigate = useNavigate();

  return (
    <div className="pt-8">
      <FormularioRegistro onSuccess={() => navigate("/")} />
    </div>
  );
}