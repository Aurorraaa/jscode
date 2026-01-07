import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Для корректной работы на GitHub Pages в репозитории, развернутом по пути /jscode/
export default defineConfig({
  base: '/jscode/',
  plugins: [react()],
})
