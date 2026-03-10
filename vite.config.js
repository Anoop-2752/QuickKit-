import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Core React runtime — loaded on every page
          vendor: ['react', 'react-dom', 'react-router-dom'],
          // Lucide icon tree — shared by many components
          icons: ['lucide-react'],
        },
      },
    },
    // Raise warning limit slightly — our chunks are intentionally split
    chunkSizeWarningLimit: 600,
  },
})
