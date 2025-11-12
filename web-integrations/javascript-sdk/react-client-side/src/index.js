import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles/index.css';
import ClientSideApp from './ClientSideApp.tsx';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ClientSideApp />
  </React.StrictMode>
);

