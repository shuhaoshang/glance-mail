import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { DemoApp } from './demo/DemoApp';
import './design-system/tokens/tokens.css';
import './global.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <DemoApp syncUrl />
  </StrictMode>,
);
