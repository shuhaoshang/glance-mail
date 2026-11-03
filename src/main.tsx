import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './app/App';
import './design-system/tokens/tokens.css';
import './global.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App personaId="maya" />
  </StrictMode>,
);
