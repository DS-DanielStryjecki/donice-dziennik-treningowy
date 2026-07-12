import React from 'react';import{createRoot}from'react-dom/client';import{registerSW}from'virtual:pwa-register';import App from './App';import './styles.css';import './additions.css';import './art.css';import './theme-red.css';
registerSW({immediate:true});createRoot(document.getElementById('root')!).render(<React.StrictMode><App/></React.StrictMode>);
