import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const proxyTarget = env.VITE_PROXY_TARGET

  const proxyConfig = proxyTarget
    ? {
        proxy: {
          '/api': {
            target: proxyTarget,
            changeOrigin: true,
          },
          '/uploads': {
            target: proxyTarget,
            changeOrigin: true,
          },
        },
      }
    : undefined

  return {
    plugins: [react()],
    build: {
      rollupOptions: {
        output: {
          onlyExplicitManualChunks: true,
          manualChunks(id) {
            if (/\/node_modules\/(framer-motion|motion-dom|motion-utils)\//.test(id)) {
              return 'vendor-motion'
            }
          },
        },
      },
    },
    ...(proxyConfig ? { server: proxyConfig, preview: proxyConfig } : {}),
  }
})
