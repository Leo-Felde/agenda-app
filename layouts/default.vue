<template>
  <v-app>
    <v-app-bar color="primary">
      <template #prepend>
        <v-app-bar-nav-icon @click="drawer = !drawer" />
      </template>
      <v-app-bar-title>
        AgendaApp
      </v-app-bar-title>
      <template #append>
        <theme-button @toggleTheme="toggleTheme" />

        <v-menu :close-on-content-click="false">
          <template #activator="{ props }">
            <v-avatar
              class="ml-3"
              color="orange"
              v-bind="props"
            >
              <v-icon
                icon="mdi-account"
                color="white"
              />
            </v-avatar>
          </template>
          <v-card>
            <v-list class="pa-0">
              <v-list-item
                title="sair"
                prepend-icon="mdi-logout"
                @click="logout"
              />
            </v-list>
          </v-card>
        </v-menu>
      </template>
    </v-app-bar>

    <v-navigation-drawer
      v-model="drawer"
      temporary
    >
      <v-list>
        <v-list-item
          v-for="item in items"
          :key="item.value"
          :prepend-icon="item.icon"
          :title="item.title"
        />
      </v-list>
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
    const user = useCurrentUser()
    const { mobile } = useDisplay()

    const drawer = ref(false)
    
    const items = ref([
      {
        title: 'Home',
        value: 'home',
        to: '/',
        icon: 'mdi-home'
      }
    ])

    const logout = () => {
      // criar confirmação?
      localStorage.removeItem('userData')
      navigateTo('/auth')
    }

    return {
      theme,
      mobile,
      user,
      drawer,
      items,
      logout,
      toggleTheme: () => theme.global.name.value = theme.global.current.value.dark ? 'light' : 'dark'
    }
  }
}
</script>