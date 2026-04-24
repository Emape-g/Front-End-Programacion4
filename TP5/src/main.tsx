import { createRoot } from 'react-dom/client'
import './index.css'
import Home from './Home.tsx'
import { ParticipantesProvider } from "./context/ParticipantesContext";
import { StrictMode } from 'react';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ParticipantesProvider>
      <Home/>
    </ParticipantesProvider>
  </StrictMode>
)
