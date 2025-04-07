import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { BrowserRouter } from 'react-router-dom';  // Aquí es donde colocas BrowserRouter

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <App />  {/* Ahora App está dentro de BrowserRouter */}
    </BrowserRouter>
  </React.StrictMode>
);
