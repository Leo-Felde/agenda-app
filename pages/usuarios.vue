<!-- eslint-disable vue/valid-v-slot -->
<template>
  <v-card
    elevation="0"
    class="pa-4"
    width="100%"
  >
    <v-card-title class="d-flex mb-2">
      Usuários
      <v-spacer />
      <v-btn
        color="primary"
        append-icon="mdi-account-plus"
      >
        Adicionar usuário
      </v-btn>
    <VDataTable
      item-value="name"
      fixed-header
      :headers="headers"
      :items="usuarios"
      :loading="loading"
    >
      <template #loading>
        <VSkeletonLoader
          v-for="i in 3"
          :key="i"
          width="100%"
          height="100px"
          class="my-2"
        />
      </template>
      <template #item.actions="{ item }">
        <td class="text-center">
          <v-btn
            icon="mdi-pencil"
            variant="text"
            @click="$emit('editar', item.selectable)"
          />
        </td>
      </template>
    </VDataTable>
  </v-card>
</template>

<script>
import { ref, onMounted } from 'vue'
import { VDataTable } from 'vuetify/labs/VDataTable'
import { VSkeletonLoader } from 'vuetify/labs/VSkeletonLoader'

import UsuariosAPI from '~/api/usuarios'
export default {
  components: {
    VDataTable,
    VSkeletonLoader
  },

  setup () {
    // const { $swal } = useNuxtApp()

    const loading = ref(false)
    const usuarios = ref([])
    const headers = ref([
      {
        title: 'Nome',
        sortable: true,
        key: 'nome'
      },
      {
        title: 'E-mail',
        sortable: true,
        key: 'email'
      },
      {
        title: 'Telefone',
        sortable: true,
        key: 'telefone'
      },
      {
        title: 'Documento',
        sortable: true,
        key: 'cpf'
      },
      {
        title: 'Data de nascimento',
        sortable: true,
        key: 'dataNascimento'
      },
      {
        title: 'Ações',
        sortable: false,
        key: 'actions'
      }
    ])
    const snackbar = useSnackbar()

    const listarUsuarios = async () => {
      // const id = user.value.id 
      loading.value = true

      try {
        const param = { termo: ''}
        const resp = await UsuariosAPI.pesquisar(param)

        usuarios.value = resp.data
      } catch (error) {
        console.error(error)
        snackbar.add({
          type: 'error',
          text: 'Ocorreu um erro ao listar os usuários'
        })
      } finally {
        loading.value = false
      }
    }
    
    onMounted(() => {
      listarUsuarios()
    })

    return {
      headers,
      usuarios,
      loading
    }
  }
}
</script>

<style lang="sass" scoped>
.contact
  &-name
    font-size: 1.1rem
  &-email
    font-size: 0.9rem
    color: #5b5b5be3
  
tr
  margin-top: 2px !important
  margin-bottom: 2px !important
    
.user-image
  width: 70px

:deep(.v-skeleton-loader__bone)
  height: inherit
</style>