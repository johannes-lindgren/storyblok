import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import ViteYaml from '@modyfi/vite-plugin-yaml'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    ViteYaml(), // you may configure the plugin by passing in an object with the options listed below
    react(),
  ],
  define: {
    global: 'globalThis', // Polyfill `global`
    'process.env': {}, // Fix `process is not defined`
  },
})
