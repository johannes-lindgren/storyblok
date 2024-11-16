// @ts-check
import { defineConfig } from 'astro/config'

import react from '@astrojs/react'
import viteBasicSslPlugin from '@vitejs/plugin-basic-ssl'

// https://astro.build/config
export default defineConfig({
  integrations: [react()],
  vite: { plugins: [viteBasicSslPlugin()] },
})
