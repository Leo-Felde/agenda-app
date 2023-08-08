<template>
  <v-app>
    <link
      id="dark"
      href="//cdn.jsdelivr.net/npm/@sweetalert2/theme-dark@5.0.11/dark.css"
      rel="stylesheet"
      :disabled="!themeDark"
    >
    <link
      id="bootstrap"
      href="//cdn.jsdelivr.net/npm/@sweetalert2/theme-bootstrap-4@5.0.11/bootstrap-4.css"
      rel="stylesheet"
      :disabled="themeDark"
    >
    <v-app-bar elevation="1">
      <template #prepend>
        <v-app-bar-nav-icon @click="drawer = !drawer" />
      </template>
      <v-app-bar-title
        v-if="!mobile"
        class="pointer text-primary"
        @click="navigateTo('/')"
      >
        AgendaApp
        <v-icon> mdi-book-check-outline </v-icon>
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
          <v-card
            height="150"
            width="300"
            class="ml-4 d-flex flex-column"
          >
            <div class="d-flex pa-4">
              <v-avatar
                color="primary"
                size="64"
              >
                <span class="text-uppercase text-h5">
                  {{ user.username.slice(0, 1) }}
                </span>
              </v-avatar>
              <div class="my-auto ml-2 d-flex flex-column">
                <span class="text-capitalize">{{ user.username }}</span>
                <span class="text-caption">loremIpsumDolor@email.com</span>
              </div>
            </div>
            <v-divider />
            <v-btn
              block
              @click="logout"
            >
              Sair
              <v-icon class="ml-1">
                mdi-logout
              </v-icon>
            </v-btn>
          </v-card>
        </v-menu>
      </template>
    </v-app-bar>

    <v-navigation-drawer
      v-model="drawer"
      :permanent="!mobile"
      :temporary="mobile"
    >
      <v-card-title
        v-if="mobile"
        class="my-2 text-center text-primary"
        color="primary"
      >
        AgendaApp
        <v-icon> mdi-book-check-outline </v-icon>
      </v-card-title>
      <v-divider />
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
      
    <v-main :class="{'main-wrapper my-4 ml-4 mr-8': !mobile}">
      <slot />
    </v-main>
  </v-app>
</template>

<script>
import { ref, computed } from 'vue'
import { useTheme, useDisplay } from 'vuetify'

export default {
  name: 'DefaultLayout',

  setup () {
    const theme = useTheme()
    const user = useCurrentUser()
    const { mobile } = useDisplay()

    const drawer = ref(true)
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

    const themeDark = computed(() => {
      return theme.global.name.value === 'dark'
    })

    const logout = () => {
      localStorage.removeItem('userData')
      user.value = {}
      navigateTo('/auth')
    }

    const toggleTheme = () => {
      theme.global.name.value = theme.global.current.value.dark ? 'light' : 'dark'
    }

    watch(() => drawer.value, () => {
      if (drawer.value) {
        DrawerList.value.focus()
      }
    })

    return {
      theme,
      mobile,
      user,
      drawer,
      items,
      DrawerList,
      userAdmin,
      themeDark,
      logout,
      toggleTheme
    }
  }
}
</script>

<style lang="sass" scoped>
.main-wrapper
  // margin-left: 10%
  // margin-right: 10%
</style>