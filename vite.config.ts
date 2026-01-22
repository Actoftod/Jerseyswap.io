
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: './',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    sourcemap: false,
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true
      }
    },
    rollupOptions: {
      input: {
        main: './index.html',
      },
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          'motion-vendor': ['framer-motion'],
        },
      },
    },
    chunkSizeWarningLimit: 1000,
  },
  server: {
    port: 3000,
    host: true
  },
  define: {
    'import.meta.env.VITE_API_KEY': JSON.stringify(process.env.VITE_API_KEY || ''),
    'import.meta.env.VITE_ADMIN_EMAIL': JSON.stringify(process.env.VITE_ADMIN_EMAIL || ''),
    'import.meta.env.VITE_ADMIN_PASSWORD': JSON.stringify(process.env.VITE_ADMIN_PASSWORD || ''),
    'import.meta.env.VITE_APP_URL': JSON.stringify(process.env.VITE_APP_URL || '')
  }
});
