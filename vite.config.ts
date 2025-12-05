import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    sourcemap: false,
    rollupOptions: {
      // Simplificado para evitar erros de dependência circular ou CommonJS no Vercel
      output: {
        manualChunks: undefined
      }
    }
  },
  server: {
    host: true
  }
});