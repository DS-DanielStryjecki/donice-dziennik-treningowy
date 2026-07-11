import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({base:'/donice-dziennik-treningowy/',plugins:[react(),VitePWA({registerType:'autoUpdate',includeAssets:['apple-touch-icon.png'],manifest:{name:'Donice – Dziennik Treningowy',short_name:'Donice',description:'Prywatny dziennik treningowy nastawiony na hipertrofię',theme_color:'#0a0c0b',background_color:'#0a0c0b',display:'standalone',orientation:'portrait-primary',start_url:'/donice-dziennik-treningowy/',scope:'/donice-dziennik-treningowy/',icons:[{src:'icon-192.png',sizes:'192x192',type:'image/png'},{src:'icon-512.png',sizes:'512x512',type:'image/png'},{src:'icon-512.png',sizes:'512x512',type:'image/png',purpose:'maskable'}]}})]});
