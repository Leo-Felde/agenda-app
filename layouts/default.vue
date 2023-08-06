<template>
  <v-app>
    <v-app-bar color="primary">
      <template #prepend>
        <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
      </template>
      <v-app-bar-title>
        Agenda
      </v-app-bar-title>
      <template #append>
        <theme-button @toggleTheme="toggleTheme" />
      </template>
    </v-app-bar>

    <v-navigation-drawer
      v-model="drawer"
      temporary
    >
      <v-list
        :items="items"
      />
    </v-navigation-drawer>
      
    <!-- aqui é renderizada a página atual -->
    <v-main>
      <slot />
    </v-main>
  </v-app>
</template>

<script>
import { ref } from 'vue'
import { useTheme, useDisplay } from 'vuetify'

export default {
  name: 'DefaultLayout',

  setup () {
    const theme = useTheme()
    const { mobile } = useDisplay()
    const drawer = ref(false)
    const items = ref([
      {
        title: 'Foo',
        value: 'foo',
      }
    ])
    return {
      theme,
      mobile,
      drawer,
      items,
      toggleTheme: () => theme.global.name.value = theme.global.current.value.dark ? 'light' : 'dark'
    }
  }
}
</script>