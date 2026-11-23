import { defineConfig } from 'vite';
import { resolve } from 'node:path';

export default defineConfig({
  base: './',
  server: {
    host: true,
  },
  build: {
    target: 'es2019',
    cssCodeSplit: false,
    rollupOptions: {
      input: {
        main: resolve(process.cwd(), 'index.html'),
        cal: resolve(process.cwd(), 'cal.html'),
      },
    },
  },
});
