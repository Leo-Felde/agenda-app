<template>
  <div class="d-flex flex-column">
    <span class="text-body-1 mx-auto mb-2"> Entrar no AgendaApp </span>
    <v-card
      v-if="invalidCredentials"
      elevation="0"
      color="red"
      class="pa-2 mb-2 d-flex"
      style="background-color: #ff000014; border-radius: 0;"
      variant="outlined"
    >
      <div
        class="mx-auto d-flex flex-column text-center"
        style="color: black"
      >
        <span> Credenciais inválidas </span>
        <span class="text-caption"> Usuário ou senha incorretos </span>
      </div>
    </v-card>
    <v-form
      ref="form"
      @submit.prevent="authenticate"
    >
      <v-text-field
        v-model="userName"
        label="Usuário"
        density="comfortable"
        variant="outlined"
        :readonly="loading"
        :rules="required"
      />

      <v-text-field
        v-model="password"
        label="Senha"
        density="comfortable"
        variant="outlined"
        :rules="required"
        :type="showPassword ? 'text' : 'password'"
        :append-inner-icon="`mdi-eye${showPassword ? '' : '-off'}`"
        :readonly="loading"
        @click:append-inner.stop="showPassword = !showPassword"
      />

      <v-btn
        type="submit"
        block
        class="mt-2"
        color="green"
        :loading="loading"
        :disabled="loading"
      >
        Entrar
      </v-btn>
    </v-form>
  </div>
</template>

<script>
import { onMounted, ref } from 'vue'
import { useTheme } from 'vuetify'
import AuthAPI from '~/api/auth'

export default {
  name: 'Index',

  setup () {
    definePageMeta({
      layout: 'auth'
    })

    const theme = useTheme()
    const snackbar = useSnackbar()
    const user = useCurrentUser()

    const form = ref(null)
    const userName = ref(null)
    const password = ref(null)
    const loading = ref(false)
    const invalidCredentials = ref(false)
    

    const showPassword = ref(false)
    const required = ref([
      value => {
        if (value) return true

        return 'Campo obrigatório.'
      },
    ])

    onMounted(() => {
      theme.global.name.value = 'light'
    })
    
    const authenticate = async () => {
      const { valid } = await form.value.validate()
      if (!valid) return

      const params = {
        username: userName.value,
        password: password.value
      }
      loading.value = true

      try {
        const resp = await AuthAPI.login(params)
        invalidCredentials.value = false

        user.value = resp.data
        localStorage.setItem('userData',  JSON.stringify(user.value))
        return navigateTo('/')
      } catch (error) {
        if (error.response.status === 401) {
          invalidCredentials.value = true
        } else {
          console.error(error)
          snackbar.add({
            type: 'error',
            text: 'Ocorreu um erro ao realizar o login, tente novamente mais tarde'
          })
        }
      } finally {
        loading.value = false
      }
    }

    return {
      userName,
      password,
      required,
      loading,
      invalidCredentials,
      showPassword,
      user,
      authenticate,
      form
    }
  }
}
</script>

<style lang="sass" scoped>

</style>