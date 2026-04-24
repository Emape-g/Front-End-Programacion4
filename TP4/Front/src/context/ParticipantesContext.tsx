// src/context/ParticipantesContext.tsx
import { createContext, useContext, useState, useEffect } from "react";
import { Participante } from "../models/Participante";

const API_URL = "http://localhost:3000/participantes";

interface ContextType {
  participantes: Participante[];
  agregar: (p: Participante) => Promise<void>;
  eliminar: (id: string) => Promise<void>;
  resetear: () => Promise<void>;
}

const ParticipantesContext = createContext<ContextType | null>(null);


// eslint-disable-next-line react-refresh/only-export-components
export function useParticipantes() {
  const ctx = useContext(ParticipantesContext);
  if (!ctx) throw new Error("useParticipantes debe usarse dentro de ParticipantesProvider");
  return ctx;
}

export function ParticipantesProvider({ children }: { children: React.ReactNode }) {
  const [participantes, setParticipantes] = useState<Participante[]>([]);

  const parseTecnologias = (data: any[]) =>
    data.map(p => ({
      ...p,
      tecnologias: Array.isArray(p.tecnologias)
        ? p.tecnologias
        : JSON.parse(p.tecnologias || "[]"),
    }));

  // Carga inicial desde la DB
  useEffect(() => {
    fetch(API_URL)
      .then(res => res.json())
      .then(data => setParticipantes(parseTecnologias(data)))
      .catch(() => alert("Error al cargar los participantes."));
  }, []);

  // Usa la respuesta del POST (evita el segundo fetch)

  const agregar = async (p: Participante) => {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...p, acepta_terminos: p.aceptaTerminos }),
  });

  if (res.status === 409) { alert("El email ya está registrado."); return; }
  if (!res.ok) { alert("Error al registrar participante."); return; }

  const nuevo = await res.json(); 
  setParticipantes(prev => [...prev, parseTecnologias([nuevo])[0]]);
  
};

  const eliminar = async (id: string) => { // agregá esto
  await fetch(`${API_URL}/${id}`, { method: "DELETE" });
  setParticipantes(prev => prev.filter(p => String(p.id) !== id));
};

    const resetear = async () => {
        await Promise.all(
        participantes.map(p => fetch(`${API_URL}/${p.id}`, { method: "DELETE" }))
  );
  setParticipantes([]);
};

  return (
    <ParticipantesContext.Provider value={{ participantes, agregar, eliminar, resetear }}>
      {children}
    </ParticipantesContext.Provider>
  );
}
