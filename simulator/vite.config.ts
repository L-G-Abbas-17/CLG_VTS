import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  base: '/simulator/',   // ✅ VERY IMPORTANT
  plugins: [react()],
  define: {
    global: 'globalThis',
    'process.env': {},
  },
})
