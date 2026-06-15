import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    open: true,
    host: true,
    allowedHosts: ['cs.oc.zwjde.com', 'ioj6n6ye4y3v.shares.zrok.io']
  },
  preview: {
    allowedHosts: ['libreloom.org']
  },
  build: {
    outDir: 'dist',
    sourcemap: true
  }
})
