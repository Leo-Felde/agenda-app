<template>
  <v-card
    elevation="0"
    class="pa-4"
    width="100%"
  >
    <v-card-title class="d-flex mb-2 search-header">
      <span class="title my-auto">Contatos</span>
      <v-text-field
        v-model="search"
        variant="solo"
        rounded
        placeholder="Pesquisar"
        append-inner-icon="mdi-magnify"
        hide-details
        density="compact"
        class="search ml-3"
        clearable
        @click:clear="listarTodos"
        @click:append-inner="listarTodos(true)"
        @keydown.enter="listarTodos(true)"
      />
      <v-spacer />
      <v-btn
        color="primary"
        append-icon="mdi-account-plus"
        @click="novoContato"
      >
        Adicionar contato
      </v-btn>
    </v-card-title>
    <v-divider />

    <ListaContatos
      class="pt-3"
      :data="lista"
      :loading="loading"
      @atualizar="listarTodos"
      @editar="editarContato"
    />

    <FormDialogoContato
      v-model="showDialog"
      :contato="contatoSelecionado"
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
    const contatos = ref([])
    const favoritos = ref([])
    const lista = ref([])
    const loading = ref(false)
    const showDialog = ref(false)
    const contatoSelecionado = ref({})
    const search = ref(null)

    const snackbar = useSnackbar()

    const listarUsuarios = async (useSearch = false) => {
      loading.value = true

      try {
        const param = { termo: useSearch ? search.value || '' : ''}
        const resp = await ContatosAPI.pesquisar(param)

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
      loading.value = true

      try {
        const resp = await FavoritosAPI.pesquisar(param)

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

    const listarTodos = async (useSearch = false) => {
      await listarUsuarios(useSearch)
      await listarFavoritos()
      lista.value = favoritos.value.concat(contatos.value)
    }

    const editarContato = (contato) => {
      contatoSelecionado.value = contato
      showDialog.value = true
    }

    const novoContato = () => {
      contatoSelecionado.value = {}
      showDialog.value = true
    }

    onMounted(async () => {
      listarTodos()
    })

    return {
      lista,
      loading,
      showDialog,
      search,
      contatoSelecionado,
      listarTodos,
      editarContato,
      novoContato
    }
  }
}
</script>
