import { defineConfig } from 'vite'

// Local experiment served over the tailnet — allow access by hostname (marko, etc.)
export default defineConfig({
  server: {
    allowedHosts: true,
  },
})
