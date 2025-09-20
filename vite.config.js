import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(),
    VitePWA({
      registerType: 'autoUpdate',
      // 3. Configuración del "Web App Manifest"
      manifest: {
        name: 'Gestión de Combustible',
        short_name: 'Gestión App',
        description: 'Aplicación para la gestión y control de consumo de combustible.',
        theme_color: '#013442', // Un color de tu paleta (--midnight-green)
        background_color: '#0E4D5C', // Un color de tu paleta (--midnight-green-2)
        icons: [
          {
            src: 'icon-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'icon-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    })
  ],
  
})
