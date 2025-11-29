import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'sonner'
import './index.css'
import App from './App.tsx'
import { registerSW } from 'virtual:pwa-register'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
})

// Register Service Worker with auto-update
const updateSW = registerSW({
  onNeedRefresh() {
    console.log('New content available, updating...')
    // Automatically update when new content is available
    updateSW(true)
  },
  onOfflineReady() {
    console.log('App ready to work offline')
  },
  onRegistered(registration: ServiceWorkerRegistration | undefined) {
    console.log('Service Worker registered successfully')
    // Check for updates every hour
    if (registration) {
      setInterval(() => {
        registration.update()
      }, 60 * 60 * 1000)
    }
  },
  onRegisterError(error: unknown) {
    console.error('Service Worker registration failed:', error)
  },
  immediate: true,
})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
      <Toaster position="top-right" richColors />
    </QueryClientProvider>
  </StrictMode>,
)
