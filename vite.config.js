import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'robots.txt', 'apple-touch-icon.png'],
      manifest: {
        name: 'Liste_achats_MVP',
        short_name: 'Achats',
        description: 'Ta liste d’achats avec priorités, offline et installable.',
        theme_color: '#0f172a',
        background_color: '#f6f7fb',
        display: 'standalone',
        start_url: '/',
        scope: '/',
        icons: [
          { src: '/pwa-192.png', sizes: '192x192', type: 'image/png' },
          { src: '/pwa-512.png', sizes: '512x512', type: 'image/png' },
          { src: '/pwa-512-maskable.png', sizes: '512x512', type: 'image/png', purpose: 'any maskable' }
        ]
      },
      workbox: {
        // Cache-first pour les assets statiques buildés
        globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
        // Network-first pour la page (utile si tu changes souvent)
        navigateFallback: 'index.html'
      }
    })
  ]
})
