import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,           // bind 0.0.0.0 so it's reachable over Tailscale
    port: 5173,
    strictPort: true,
    allowedHosts: true,   // allow the Tailscale IP/hostname
  },
})
