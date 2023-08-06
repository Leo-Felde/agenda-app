<template>
  <v-app class="d-flex">
    <v-card
      class="ma-auto pa-6"
      width="350"
      elevation="4"
    >
      <slot />
    </v-card>
  </v-app>
</template>

<script>
// import { ref } from 'vue'
import { useDisplay } from 'vuetify'

export default {
  setup () {
    const { mobile } = useDisplay()

    return {
      mobile
    }
  }
}
</script>