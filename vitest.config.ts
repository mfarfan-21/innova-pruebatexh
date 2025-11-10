import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  // @ts-expect-error - Conflicto de tipos entre Vite 7.x y Vite interno de Vitest 1.x
  // Funciona correctamente en runtime, es solo un problema de tipos de TypeScript
  plugins: [react()],
  test: {
    globals: true,
    environment: 'happy-dom',
    setupFiles: './src/test/setup.ts',
    css: true,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'src/test/',
        '**/*.d.ts',
        '**/*.config.*',
        '**/mockData',
        'src/main.tsx',
      ],
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@/infrastructure': path.resolve(__dirname, './src/infrastructure'),
      '@/domain': path.resolve(__dirname, './src/domain'),
      '@/presentation': path.resolve(__dirname, './src/presentation'),
    },
  },
});
