import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      '/allposts': 'http://localhost:5001',
      '/createpost': 'http://localhost:5001',
      '/mypost': 'http://localhost:5001',
      '/givelike': 'http://localhost:5001',
      '/removelike': 'http://localhost:5001',
      '/insert-comment': 'http://localhost:5001',
      '/delete-post': 'http://localhost:5001',
      '/user': 'http://localhost:5001',
      '/follow': 'http://localhost:5001',
      '/unfollow': 'http://localhost:5001',
      '/update-profile-image': 'http://localhost:5001',
      '/protected': 'http://localhost:5001',
      '/create-profile': 'http://localhost:5001',
      '/get-profile': 'http://localhost:5001'
    }
  },
  build: {
    outDir: 'build'
  }
})
