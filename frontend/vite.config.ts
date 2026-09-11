import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// Django serves the production build straight from frontend/dist (see
// app/templatetags/vite_assets.py + STATICFILES_DIRS in project/settings.py).
// `base: '/static/'` only applies to the production build so that any
// asset URL baked into the JS/CSS bundle (imported images, CSS url()) is
// resolved correctly once served under Django's STATIC_URL; `vite dev`
// keeps the normal root-relative base for local development.
export default defineConfig(({ command }) => ({
  plugins: [react()],
  base: command === 'build' ? '/static/' : '/',
  build: {
    manifest: true,
    outDir: 'dist',
  },
  server: {
    // During `npm run dev`, proxy the Django-owned routes to `manage.py runserver`
    // so the phone-mask/order form can be exercised against the real backend
    // without a full production build.
    proxy: {
      '/order': 'http://127.0.0.1:8000',
      '/admin': 'http://127.0.0.1:8000',
    },
  },
}))
