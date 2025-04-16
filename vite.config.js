import { fileURLToPath, URL } from 'node:url'
import { existsSync } from 'node:fs'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

const dotPathFixPlugin = () => ({
  name: 'dot-path-fix-plugin',
  configureServer: (server) => {
    server.middlewares.use((req, _, next) => {
      const reqPath = req.url.split('?', 2)[0]
      if (
        !req.url.startsWith('/@') && // virtual files provided by vite plugins
        !req.url.startsWith('/api/') && // api proxy, configured below
        !existsSync(`./public${reqPath}`) && // files served directly from public folder
        !existsSync(`.${reqPath}`) // actual files
      ) {
        req.url = '/'
      }
      next()
    })
  }
})

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), dotPathFixPlugin()],
  base: './',
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      '~': fileURLToPath(new URL('./node_modules', import.meta.url))
    }
  }
})
