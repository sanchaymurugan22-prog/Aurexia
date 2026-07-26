import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

import { cloudflare } from "@cloudflare/vite-plugin";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],

  // ── Dev-server proxy ────────────────────────────────────────────────────
  // Browsers cannot call https://integrate.api.nvidia.com directly (CORS).
  // Any request to /nim-api/** is transparently forwarded to the NVIDIA NIM
  // endpoint by Vite's own server, which is not subject to browser CORS rules.
  server: {
    proxy: {
      '/nim-api': {
        target: 'https://integrate.api.nvidia.com',
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path.replace(/^\/nim-api/, ''),
      },
    },
  },

  build: {
    // Raise the warning threshold so large but legitimate chunks don't warn
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks(id) {
          // Firebase — split into its own chunk
          if (id.includes('node_modules/firebase') || id.includes('node_modules/@firebase')) {
            return 'vendor-firebase'
          }
          // React core
          if (id.includes('node_modules/react') || id.includes('node_modules/react-dom')) {
            return 'vendor-react'
          }
          // React Router
          if (id.includes('node_modules/react-router') || id.includes('node_modules/react-router-dom')) {
            return 'vendor-router'
          }
          // Everything else in node_modules goes into a shared vendor chunk
          if (id.includes('node_modules')) {
            return 'vendor-misc'
          }
        },
      },
    },
  },
})