<template>
  <v-card
    elevation="0"
    class="pa-4"
    width="100%"
  >
    <v-card-title class="d-flex mb-2">
      Meus contatos
      <v-spacer />
      <v-btn
        color="primary"
        append-icon="mdi-account-plus"
      >
        Adicionar usuário
      </v-btn>
    </v-card-title>
    <v-divider />
    <ListaContatos
      class="pt-3"
      :data="lista"
      :loading="loading"
      @atualizar="listarTodos"
    />
  </v-card>
</template>

<script>
import { ref, onMounted } from 'vue'

import ContatosAPI from '~/api/contatos'
import FavoritosAPI from '~/api/favoritos'

export default {
  name: 'Index',

  setup () {
    const user = useCurrentUser()
    const snackbar = useSnackbar()
    const contatos = ref([])
    const favoritos = ref([])
    const lista = ref([])
    const loading = ref(false)

    const listarUsuarios = async () => {
      const id = user.value.id 
      loading.value = true

      try {
        const resp = await ContatosAPI.listar(id)

        contatos.value = resp.data
      } catch (error) {
        console.error(error)
        snackbar.add({
          type: 'error',
          text: 'Ocorreu um erro ao listar os contatos'
        })
      } finally {
        loading.value = false
      }
    }

    const listarFavoritos = async () => {
      // const id = user.value.id 
      loading.value = true

      try {
        const resp = await FavoritosAPI.pesquisar()

        favoritos.value = resp.data
        favoritos.value.forEach((favorito) => { // adiciona o booleano 'favorito: true' para todos os registros
          favorito.favorito = true
        })
      } catch (error) {
        console.error(error)
        snackbar.add({
          type: 'error',
          text: 'Ocorreu um erro ao listar os favoritos'
        })
      } finally {
        loading.value = false
      }
    }

    const listarTodos = async () => {
      await listarUsuarios()
      await listarFavoritos()
      lista.value = favoritos.value.concat(contatos.value)
    }

    onMounted(async () => {
      listarTodos()
    })

    return {
      lista,
      loading,
      listarTodos
    }
  }
}
</script>