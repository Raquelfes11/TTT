// src/index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Crear el "root" de la aplicación y renderizar el componente App
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
