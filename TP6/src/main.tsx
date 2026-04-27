import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import Home from './Home.tsx'; 
import { ParticipantesProvider } from './context/ParticipantesContext';
import './index.css'; 

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <ParticipantesProvider>
        <Home />
      </ParticipantesProvider>
    </BrowserRouter>
  </StrictMode>
);