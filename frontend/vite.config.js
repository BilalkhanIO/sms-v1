import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'https://effective-cod-9jx56r7jjvjcprx-6000.app.github.dev',
        changeOrigin: true,
        secure: false,
        ws: true
      }
    }
  }
})
