import { createContext, useContext, useReducer, useEffect } from "react";
import { Participante } from "../models/Participante";
import { participantesReducer } from "../reducers/participantesReducer";

const API_URL = "http://localhost:3000/participantes";

interface ContextType {
    participantes: Participante[];
    agregar: (p: Participante) => Promise<void>;
    editar: (p: Participante) => Promise<void>;
    eliminar: (id: string) => Promise<void>;
    resetear: () => Promise<void>;
}

const ParticipantesContext = createContext<ContextType | null>(null);

const parseParticipante = (p: any) => ({
    ...p,
    tecnologias: Array.isArray(p.tecnologias)
        ? p.tecnologias
        : JSON.parse(p.tecnologias || '[]'),
    aceptaTerminos: Boolean(p.aceptaTerminos ?? p.acepta_terminos),
});

const parseTecnologias = (data: any[]) => data.map(parseParticipante);

const toAPIPayload = (p: Participante) => ({
    nombre: p.nombre,
    email: p.email,
    edad: p.edad,
    pais: p.pais,
    modalidad: p.modalidad,
    tecnologias: p.tecnologias,
    nivel: p.nivel,
    acepta_terminos: Boolean(p.aceptaTerminos),
});

export function ParticipantesProvider({ children }: { children: React.ReactNode }) {
    const [participantes, dispatch] = useReducer(participantesReducer, []);

    useEffect(() => {
        fetch(API_URL)
            .then(res => res.json())
            .then(data => dispatch({ type: "GET_PARTICIPANTES", payload: parseTecnologias(data) }));
    }, []);

    const agregar = async (p: Participante) => {
        await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(toAPIPayload(p)),
        });
        const res = await fetch(API_URL);
        const data = await res.json();
        dispatch({ type: "SET", payload: parseTecnologias(data) });
    };

    const editar = async (p: Participante) => {
        const res = await fetch(`${API_URL}/${p.id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(toAPIPayload(p)),
        });
        const updated = await res.json();
        dispatch({ type: "EDITAR", payload: parseTecnologias([updated])[0] });
    };

    const eliminar = async (id: string) => {
        await fetch(`${API_URL}/${id}`, { method: "DELETE" });
        dispatch({ type: "ELIMINAR", payload: id });
    };

    const resetear = async () => {
    try {
        // 1. Borramos cada participante en el backend
        await Promise.all(
            participantes.map(p => fetch(`${API_URL}/${p.id}`, { method: "DELETE" }))
        );

        // 2. Limpiamos el estado global en React
        dispatch({ type: "RESET", payload: [] }); 
    } catch (error) {
        alert("Hubo un error al intentar borrar los datos de la base de datos.");
    }
};

    return (
        <ParticipantesContext.Provider value={{ participantes, agregar, editar, eliminar, resetear }}>
            {children}
        </ParticipantesContext.Provider>
    );
}

export function useParticipantes() {
    const ctx = useContext(ParticipantesContext);
    if (!ctx) throw new Error("useParticipantes debe usarse dentro de ParticipantesProvider");
    return ctx;
}
