import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    sourcemap: false,
    // Configurações padrão do Rollup para evitar erros de chunking
    rollupOptions: {
      output: {
        manualChunks: undefined
      }
    }
  },
  server: {
    host: true
  }
});