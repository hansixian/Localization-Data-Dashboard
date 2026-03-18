import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';

const sharedConfig = {
  base: './',
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '.'),
    },
  },
  server: {
    hmr: process.env.DISABLE_HMR !== 'true',
  },
};

export default defineConfig(({mode}) => {
  if (mode === 'pages-root') {
    return {
      ...sharedConfig,
      build: {
        outDir: 'assets',
        emptyOutDir: true,
        cssCodeSplit: false,
        lib: {
          entry: path.resolve(__dirname, 'src/main.tsx'),
          formats: ['es'],
          fileName: () => 'app.js',
        },
        rollupOptions: {
          output: {
            assetFileNames: (assetInfo) =>
              assetInfo.name?.endsWith('.css') ? 'app.css' : '[name][extname]',
          },
        },
      },
    };
  }

  return sharedConfig;
});
