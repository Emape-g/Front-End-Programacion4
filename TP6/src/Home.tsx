import { Routes, Route } from "react-router-dom";
import ListaPage from "./pages/ListaPage";
import FormularioPage from "./pages/FormularioPage";
import EditarPage from "./pages/EditarPage";

export default function Home() {
  return (
    <div className="max-w-6xl mx-auto p-6 bg-gray-50 min-h-screen">
      <Routes>
        <Route path="/" element={<ListaPage />} />
        <Route path="/nuevo" element={<FormularioPage />} />
        <Route path="/editar/:id" element={<EditarPage />} />
      </Routes>
    </div>
  );
}