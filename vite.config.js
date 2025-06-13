import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/sf6notes/', // ✅ Matches your GitHub repo name
  plugins: [react()],
})
