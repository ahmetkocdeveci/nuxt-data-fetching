// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },
  
  // Sayfa geçiş animasyonunu etkinleştirelim
  app: {
    pageTransition: { name: 'page', mode: 'out-in' }
  }
})