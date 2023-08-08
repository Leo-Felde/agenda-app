<!-- eslint-disable vue/valid-v-slot -->
<template>
  <v-card
    elevation="0"
    class="pa-4"
    width="100%"
  >
    <v-card-title class="d-flex mb-2">
      Pessoas
      <v-spacer />
      <v-btn
        color="primary"
        append-icon="mdi-account-plus"
        @click="novaPessoa"
      >
        Adicionar pessoa
      </v-btn>
    </v-card-title>
    <v-divider />
    <VDataTable
      item-value="name"
      fixed-header
      :headers="headers"
      :items="pessoas"
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
      <template #item.nome="{ item }">
        <td class="text-center">
          <div class="d-flex py-2">
            <PessoaImagem :id="item.selectable.id" />
            <span class="my-2 ml-2">{{ item.selectable.nome }}</span>
          </div>
        </td>
      </template>
      <template #item.actions="{ item }">
        <td class="text-center">
          <v-btn
            icon="mdi-pencil"
            variant="text"
            @click="editarPessoa(item.selectable)"
          />
        </td>
      </template>
      <template #item.endereco="{ item }">
        <td>
          <span class="endereco">
            {{ item.selectable.endereco.bairro }}, №{{ item.selectable.endereco.numero }} {{ item.selectable.endereco.cidade }} - {{ item.selectable.endereco.estado }}
              
          </span>
        </td>
      </template>
    </VDataTable>
    <FormDialogoPessoa
      v-model="showDialog"
      :pessoa="pessoaSelecionada"
      @atualizar="listarPessoas"
    />
  </v-card>
</template>

<script>
import { ref, onMounted } from 'vue'
import { VDataTable } from 'vuetify/labs/VDataTable'
import { VSkeletonLoader } from 'vuetify/labs/VSkeletonLoader'

import PessoasAPI from '~/api/pessoas'
export default {
  components: {
    VDataTable,
    VSkeletonLoader
  },

  setup () {
    // const { $swal } = useNuxtApp()

    const loading = ref(false)
    const showDialog = ref(false)
    const pessoaSelecionada = ref({})
    const pessoas = ref([])
    const headers = ref([
      {
        title: 'Nome',
        sortable: true,
        key: 'nome'
      },
      {
        title: 'Documento',
        sortable: true,
        key: 'cpf'
      },
      {
        title: 'Endereço',
        sortable: true,
        key: 'endereco'
      },
      {
        title: 'Logradouro',
        sortable: true,
        key: 'endereco.logradouro'
      },
      {
        title: 'CEP',
        sortable: true,
        key: 'endereco.cep'
      },
      {
        title: 'Ações',
        sortable: false,
        key: 'actions'
      }
    ])
    const snackbar = useSnackbar()

    const listarPessoas = async () => {
      // const id = user.value.id 
      loading.value = true

      try {
        const param = { nome: ''}
        const resp = await PessoasAPI.pesquisar(param)

        pessoas.value = resp.data
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
    
    const editarPessoa = (pessoa) => {
      pessoaSelecionada.value = pessoa
      showDialog.value = true
    }

    const novaPessoa = () => {
      pessoaSelecionada.value = {}
      showDialog.value = true
    }

    onMounted(() => {
      listarPessoas()
    })

    return {
      headers,
      pessoas,
      showDialog,
      pessoaSelecionada,
      loading,
      listarPessoas,
      editarPessoa,
      novaPessoa
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