import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  const isVercel = process.env.VERCEL === '1'
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
