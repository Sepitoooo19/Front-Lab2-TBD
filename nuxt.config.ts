export default defineNuxtConfig({
  ssr: false,
  css: [
    '~/assets/css/main.css',
    'leaflet/dist/leaflet.css'
  ],
  runtimeConfig: {
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE || 'http://localhost:8090',
    }
  },

  build: {
    transpile: ['@vue-leaflet/vue-leaflet']
  },

  compatibilityDate: '2025-05-15',
  devtools: { enabled: true },
  modules: ['@nuxtjs/tailwindcss', '@pinia/nuxt'],
  pages: true,

  plugins: [
    '~/plugins/axios.ts',
    '~/plugins/vue3-toastify.ts'
  ],
})