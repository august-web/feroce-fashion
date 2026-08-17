import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 5173,
    allowedHosts: true,
    // Same-origin /api calls hit the checkout server (server/index.ts, default port 8787).
    proxy: { '/api': { target: 'http://localhost:8787', changeOrigin: true } },
  },
})
