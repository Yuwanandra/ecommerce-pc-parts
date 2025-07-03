import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  root: resolve(__dirname, 'client'), // <- point to the actual frontend folder
  plugins: [react()],
  server: {
    port: 5173
  },
  build: {
    outDir: '../dist', // <- put build output back in root-level dist
    emptyOutDir: true
  }
});
