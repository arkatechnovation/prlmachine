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
      modulePreload: {
        resolveDependencies: (_filename, deps) =>
          deps.filter(
            (dep) =>
              !dep.includes('vendor-motion') && !dep.includes('vendor-swiper'),
          ),
      },
      rollupOptions: {
        output: {
          manualChunks: {
            'vendor-react': ['react', 'react-dom', 'react-router', 'react-router-dom'],
            'vendor-motion': ['framer-motion'],
            'vendor-swiper': ['swiper'],
            'vendor-icons': ['lucide-react', 'react-icons'],
          },
        },
      },
    },
    ...(proxyConfig ? { server: proxyConfig, preview: proxyConfig } : {}),
  }
})
