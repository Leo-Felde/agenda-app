// plugins/vuetify.js
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import * as labsComponents from 'vuetify/labs/components'

export default defineNuxtPlugin(nuxtApp => {
  const vuetify = createVuetify({
    ssr: true,
    components,
    labsComponents,
    directives,
    theme: {
      themes: {
        light: {
          dark: false,
          colors: {
            primary: '#2f76b9'
          }
        },
        dark: {
          dark: true,
          colors: {
            primary: '#01579b'
          }
        },
      }
    }
  })

  nuxtApp.vueApp.use(vuetify)
})
