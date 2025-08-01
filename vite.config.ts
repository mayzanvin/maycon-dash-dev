// vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },

  // Configurações para suporte a Node.js APIs no browser (para desenvolvimento)
  define: {
    global: 'globalThis',
  },

  // Configurações do servidor de desenvolvimento
  server: {
    port: 3000,
    host: true, // Permite acesso externo
    fs: {
      // Permite acesso a arquivos fora do root do projeto (OneDrive)
      allow: [
        // Root do projeto
        '..',
        // Caminho do OneDrive (ajustar conforme necessário)
        'C:/Users/mzvinga/OneDrive - RORAIMA ENERGIA'
      ]
    }
  },

  // Otimizações de build
  build: {
    target: 'esnext',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          charts: ['recharts'],
          excel: ['xlsx'],
          icons: ['lucide-react']
        }
      }
    }
  },

  // Configurações específicas para desenvolvimento
  optimizeDeps: {
    include: ['xlsx', 'recharts', 'lucide-react'],
    exclude: ['fs', 'path', 'os']
  },

  // Configurações experimentais para APIs do Node.js
  experimental: {
    renderBuiltUrl(filename, { hostType, type }) {
      if (type === 'asset') {
        return `/${filename}`
      }
      return { runtime: `window.__viteAssets[${JSON.stringify(filename)}]` }
    }
  }
})