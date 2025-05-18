import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
    force: true, // Force dependency pre-bundling
  },
  server: {
    proxy: {
      '/.netlify/functions': {
        target: 'http://localhost:8888',
        rewrite: (path) => path.replace(/^\/\.netlify\/functions/, ''),
      },
    },
    hmr: {
      timeout: 5000 // Increase HMR timeout
    }
  },
  clearScreen: false, // Helps with debugging by preserving error logs
});