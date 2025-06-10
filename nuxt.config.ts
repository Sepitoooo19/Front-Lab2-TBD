// https://nuxt.com/docs/api/configuration/nuxt-config

import { createPinia } from 'pinia';

export default defineNuxtConfig({
  ssr: false,
  css: ['~/assets/css/main.css'],
  runtimeConfig: {
    public: {
      apiBase: 'http://localhost:8090', // Cambia esto según la URL de tu backend
    },
  },


  compatibilityDate: '2025-05-01',
  devtools: { enabled: true },
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },
    modules: ['@nuxtjs/tailwindcss', '@pinia/nuxt'],
  pages: true // Habilita la detección automática de rutas en la carpeta "pages"
})




