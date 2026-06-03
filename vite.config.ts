import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // For GitHub Pages: set to '/<repo-name>/'
  // Change this if your repo name is different
  base: '/freq-explorer/',
})
