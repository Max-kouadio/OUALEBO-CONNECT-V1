import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { VitePWA } from 'vite-plugin-pwa'

const CACHE_VERSION = 'v3'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      // Force immediate update
      workbox: {
        // Clean old caches automatically
        cleanupOutdatedCaches: true,
        // Skip waiting to activate new service worker immediately
        skipWaiting: true,
        // Take control of all clients immediately
        clientsClaim: true,
        // Network-first strategy for HTML/JS files
        runtimeCaching: [
          {
            // Cache HTML files with network-first strategy
            urlPattern: /^https?:\/\/.*\.html$/,
            handler: 'NetworkFirst',
            options: {
              cacheName: `html-cache-${CACHE_VERSION}`,
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 60 * 60 * 24 * 7, // 7 days
              },
              networkTimeoutSeconds: 10,
            },
          },
          {
            // Cache JS/CSS with network-first strategy
            urlPattern: /^https?:\/\/.*\.(js|css)$/,
            handler: 'NetworkFirst',
            options: {
              cacheName: `assets-cache-${CACHE_VERSION}`,
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 60 * 60 * 24 * 7, // 7 days
              },
              networkTimeoutSeconds: 10,
            },
          },
          {
            // Cache images with cache-first strategy
            urlPattern: /^https?:\/\/.*\.(png|jpg|jpeg|svg|gif|webp|ico)$/,
            handler: 'CacheFirst',
            options: {
              cacheName: `images-cache-${CACHE_VERSION}`,
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 60 * 60 * 24 * 30, // 30 days
              },
            },
          },
          {
            // Cache API calls with network-first strategy
            urlPattern: /^https?:\/\/.*\/api\/.*/,
            handler: 'NetworkFirst',
            options: {
              cacheName: `api-cache-${CACHE_VERSION}`,
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 60 * 5, // 5 minutes
              },
              networkTimeoutSeconds: 10,
            },
          },
        ],
      },
      manifest: {
        name: 'Cabinet Civil Numérique V2',
        short_name: 'OUALEBO Connect',
        description: 'Système de gestion du cabinet civil',
        theme_color: '#8B1538',
        background_color: '#ffffff',
        display: 'standalone',
        start_url: '/',
        icons: [
          {
            src: '/vite.svg',
            sizes: '192x192',
            type: 'image/svg+xml',
          },
          {
            src: '/vite.svg',
            sizes: '512x512',
            type: 'image/svg+xml',
          },
        ],
      },
      devOptions: {
        enabled: true, // Enable PWA in development
        type: 'module',
      },
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      'zod/v4/core': 'zod'
    },
  },
})
