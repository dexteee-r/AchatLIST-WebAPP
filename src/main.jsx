import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './styles.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)

// ---- PWA: enregistrement du Service Worker (autoUpdate) ----
import { Workbox } from 'workbox-window';
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    const wb = new Workbox('/sw.js', { scope: '/' });
    wb.addEventListener('waiting', () => {
      // met à jour automatiquement quand un nouveau SW est prêt
      wb.messageSkipWaiting();
      wb.addEventListener('controlling', () => window.location.reload());
    });
    wb.register();
  });
}