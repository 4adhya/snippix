import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// ✅ Correct Vite configuration — no @tailwindcss/vite needed
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173
  }
})

