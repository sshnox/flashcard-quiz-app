import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // Change 'flashcard-quiz-app' to your GitHub repository name
  base: process.env.NODE_ENV === 'production' ? '/flashcard-quiz-app/' : '/',
})
