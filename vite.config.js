import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // Relative, so the same build works from the dev server and from the
  // portfolio's /roi-pot/ sub-path on GitHub Pages - same as Arrivals.
  base: './',
})
