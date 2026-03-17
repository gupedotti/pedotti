import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api/chat': {
        target: 'https://chat.pedotti.com.br',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/chat/, '/v1/chat/completions'),
      },
      '/api/hooks': {
        target: 'https://chat.pedotti.com.br',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/hooks/, '/hooks'),
      },
    },
  },
})
