import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    host: true, // This opens the "doors" to your network for mobile testing
    proxy: {
      // This catches any request starting with /api and routes it to your backend
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
    },
  }
})