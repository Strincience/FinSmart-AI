import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],

  server: {
    port: 3000,

    // Dev proxy: any request to /api/* is forwarded to the Express backend.
    // This means you never have to hard-code http://localhost:5000 in your
    // React code — just call '/api/chat' and Vite handles the rest.
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
    },
  },
});
