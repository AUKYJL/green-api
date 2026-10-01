import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'
import tailwindcss from '@tailwindcss/vite'
import path from 'node:path'
import { defineConfig } from 'vitest/config'

// https://vite.dev/config/
export default defineConfig({
  base: '/green-api/',
  plugins: [
    react(),
    babel({ presets: [reactCompilerPreset()] }),
    tailwindcss(),
  ],
  resolve: {
    alias: { '@': path.resolve(import.meta.dirname, './src') },
  },
  test: {
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
    globals: true,
  },
})
