import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// base matches the repo name for GitHub Pages project hosting
export default defineConfig({
  plugins: [vue()],
  base: '/blog/'
})
