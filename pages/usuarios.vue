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
        @click="novoUsuario"
      >
        Adicionar usuário
      </v-btn>
    </v-card-title>
    <v-divider />
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
      <template #item.dataNascimento="{ item }">
        <td class="text-center">
          {{ formatarData(item.selectable.dataNascimento) }}
        </td>
      </template>
      <template #item.actions="{ item }">
        <td class="text-center">
          <v-btn
            icon="mdi-pencil"
            variant="text"
            @click="editarUsuario(item.selectable)"
          />
        </td>
      </template>
    </VDataTable>
    <FormDialogoUsuario
      v-model="showDialog"
      :usuario="usuarioSelecionado"
      @atualizar="listarUsuarios"
    />
  </v-card>
</template>

<script>
import { ref, onMounted } from 'vue'
import { VDataTable } from 'vuetify/labs/VDataTable'
import { VSkeletonLoader } from 'vuetify/labs/VSkeletonLoader'
import { formatDate } from '~/utils/formatacao'

import UsuariosAPI from '~/api/usuarios'
export default {
  components: {
    VDataTable,
    VSkeletonLoader
  },

  setup (inject) {
    // const { $swal } = useNuxtApp()

    const loading = ref(false)
    const showDialog = ref(false)
    const usuarios = ref([])
    const usuarioSelecionado = ref({})
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

    const formatarData = (data) => {
      return formatDate(data)
    }

    const editarUsuario = (usuario) => {
      console.log(usuario)
      usuarioSelecionado.value = usuario
      showDialog.value = true
    }

    const novoUsuario = () => {
      usuarioSelecionado.value = {}
      showDialog.value = true
    }
    
    onMounted(() => {
      listarUsuarios()
    })

    return {
      headers,
      usuarios,
      loading,
      showDialog,
      usuarioSelecionado,
      formatarData,
      editarUsuario,
      novoUsuario,
      listarUsuarios
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