import { defineConfig } from 'vite'
import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    babel({ presets: [reactCompilerPreset()] }),
    // SPA fallback: rewrite /app/* paths to app.html for client-side routing
    {
      name: 'spa-fallback',
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          // If path starts with /app and is not a file request, serve app.html
          const url = req.url.split('?')[0];
          if (url.startsWith('/app') && !path.extname(url)) {
            req.url = '/app.html' + (req.url.includes('?') ? '?' + req.url.split('?')[1] : '');
          }
          next();
        });
      }
    }
  ],
  build: {
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'index.html'),
        app: path.resolve(__dirname, 'app.html'),
        resources: path.resolve(__dirname, 'resources.html'),
        unep: path.resolve(__dirname, 'committee-unep.html'),
        disec: path.resolve(__dirname, 'committee-disec.html'),
        hrc: path.resolve(__dirname, 'committee-hrc.html'),
        sochum: path.resolve(__dirname, 'committee-sochum.html'),
        uneai: path.resolve(__dirname, 'committee-unea-i.html'),
        uneaii: path.resolve(__dirname, 'committee-unea-ii.html'),
        wto: path.resolve(__dirname, 'committee-wto.html'),
        sc: path.resolve(__dirname, 'committee-sc.html'),
      },
    },
  },
})
