/* ─── src/main.jsx ───────────────────────────────────────────────────────────
   This is the entry point Vite loads first.
   It simply mounts the <App /> component into the #root div in index.html.
── ─────────────────────────────────────────────────────────────────────────── */

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

// Global styles (Tailwind + custom CSS variables)
import './index.css';

// Root application component
import App from './App.jsx';

createRoot(document.getElementById('root')).render(
  // StrictMode runs extra checks in development only (no effect in production)
  <StrictMode>
    <App />
  </StrictMode>
);
