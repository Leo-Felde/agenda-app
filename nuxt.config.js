import { defineNuxtConfig } from 'nuxt/config'

// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
  ssr: false,
  css: [
    '~/assets/styles/main.sass',
    '@mdi/font/css/materialdesignicons.min.css',
    'vuetify/lib/styles/main.sass'
  ],
  build: {
    transpile: ['vuetify'],
  },
  vite: {
    define: {
      'process.env.DEBUG': false,
    },
  },
  modules: [
    '@nuxtjs/eslint-module',
    'nuxt-snackbar'
  ],
  eslint: {
    fix: true
  },
  snackbar: {
    top: true,
    right: true,
    duration: 2000
  }
})
