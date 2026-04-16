import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  // Vercel sets this env var automatically — deploy at root '/'
  const isVercel = process.env.VERCEL === '1'
  
  // GitHub Actions sets this — extract repo name for the base path
  const ghRepo = process.env.GITHUB_REPOSITORY?.split('/')[1]

  let base = '/'
  if (mode === 'production' && !isVercel && ghRepo) {
    base = `/${ghRepo}/`
  }

  return {
    plugins: [react()],
    base,
  }
})
