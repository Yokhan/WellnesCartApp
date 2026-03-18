import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles/index.css';

// Initialize Telegram WebApp as early as possible
const tg = (window as unknown as Record<string, unknown>).Telegram;
if (tg && typeof tg === 'object' && 'WebApp' in tg) {
  const webApp = (tg as { WebApp: { ready: () => void } }).WebApp;
  webApp.ready();
}

const rootEl = document.getElementById('root');

if (!rootEl) {
  throw new Error('Root element #root not found. Check index.html.');
}

ReactDOM.createRoot(rootEl).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
