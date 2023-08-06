<template>
  <v-app>
    <v-app-bar>
      <template #prepend>
        <v-app-bar-nav-icon @click="drawer = !drawer" />
      </template>
      <v-app-bar-title
        class="pointer"
        @click="navigateTo('/')"
      >
        AgendaApp
      </v-app-bar-title>
      <template #append>
        <theme-button @toggleTheme="toggleTheme" />

        <v-menu :close-on-content-click="false">
          <template #activator="{ props }">
            <v-avatar
              class="ml-3 pointer"
              color="primary"
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
      <v-list
        ref="DrawerList"
        color="primary"
      >
        <v-list-item
          v-for="item in items"
          :key="item.value"
          :prepend-icon="item.icon"
          :title="item.title"
          :to="item.to"
          tabindex="0"
          :show="item.adminOnly ? userAdmin : true"
          nuxt
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
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useTheme, useDisplay } from 'vuetify'

export default {
  name: 'DefaultLayout',

  setup () {
    const theme = useTheme()
    const user = useCurrentUser()
    const { mobile } = useDisplay()

    const drawer = ref(false)
    const DrawerList = ref(null)
    const items = ref([
      {
        title: 'Home',
        value: 'home',
        to: '/',
        icon: 'mdi-home'
      },
      {
        title: 'Meu cadastro',
        value: 'meu-cadastro',
        to: '/meu-cadastro',
        icon: 'mdi-badge-account'
      },
      {
        title: 'Usuarios',
        value: 'usuarios',
        adminOnly: true,
        to: '/usuarios',
        icon: 'mdi-account'
      },
      {
        title: 'Pessoas',
        value: 'pessoas',
        to: '/pessoas',
        icon: 'mdi-account-group'
      },
    ])

    const userAdmin = computed(() => {
      return user.value.tipos.includes('ROLE_ADMIN')
    })

    const logout = () => {
      // criar confirmação?
      localStorage.removeItem('userData')
      navigateTo('/auth')
    }

    watch(() => drawer.value, () => {
      if (drawer.value) {
        DrawerList.value.focus()
      }
    })

    onMounted(() => {
      document.addEventListener('keydown', (e) => {
        if(e.key === 'Escape') {
          drawer.value = false
        }
      })
    })

    onBeforeUnmount(() => {
      document.removeEventListener('keydown', () => {})
    })

    return {
      theme,
      mobile,
      user,
      drawer,
      items,
      DrawerList,
      userAdmin,
      logout,
      toggleTheme: () => theme.global.name.value = theme.global.current.value.dark ? 'light' : 'dark'
    }
  }
}
</script>