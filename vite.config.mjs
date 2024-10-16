//@ts-check
/// <reference types="vitest" />
import { defineConfig } from 'vite'
import { resolve } from 'path'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  build: {
    lib: {
      entry: {
        index: resolve(__dirname, 'src/index.ts'),
      },
      formats: ['es'],
    },
    rollupOptions: {
      external: ['vue'],
    },
    emptyOutDir: true,
  },
  test: {
    environment: 'jsdom',
  },
})
