<template>
  <div>
    <VDataTable
      :headers="headers"
      :items="contatos"
      item-value="name"
      class="elevation-1"
    >
      <template #item="{ item }">
        <tr>
          <td class="d-flex flex-column">
            <span class="contact-name">
              {{ item.selectable.pessoa.nome }}
            </span>
            <span
              v-if="item.selectable.email"
              class="contact-email"
            >
              {{ item.selectable.email }}
            </span>
          </td>
          <td>{{ item.selectable.tipoContato }}</td>
          <td>{{ item.selectable.telefone }}</td>
          <td>{{ item.selectable.pessoa.cpf }}</td>
          <td>
            <span class="endereco">
              {{ item.selectable.pessoa.endereco.bairro }}
              , {{ item.selectable.pessoa.endereco.cidade }} - {{ item.selectable.pessoa.endereco.estado }}
              
            </span>
          </td>
          <td>
            <v-btn
              icon="mdi-dots-vertical"
              variant="text"
            />
          </td>
        </tr>
      </template>
    </VDataTable>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { VDataTable } from 'vuetify/labs/VDataTable'

import ContatosAPI from '~/api/contatos'

export default {
  components: {
    VDataTable
  },

  setup() {
    const user = useCurrentUser()
    const snackbar = useSnackbar()

    const headers = ref([
      {
        title: 'Informações',
        align: 'start',
        sortable: true,
        key: 'pessoa.nome'
      },
      {
        title: 'Tipo',
        sortable: true,
        key: 'tipoContato'
      },
      {
        title: 'Telefone',
        sortable: true,
        key: 'telefone'
      },
      {
        title: 'Documento',
        sortable: true,
        key: 'pessoa.cpf'
      },
      {
        title: 'Endereço',
        sortable: true,
        key: 'pessoa.endereco'
      },
      {
        title: 'Ações',
        sortable: false,
        key: 'actions'
      }
    ])
    const contatos = ref([])
    const loading = ref(false)
    const page = ref(1)

    const listarUsuarios = async () => {
      const id = user.value.id 
      loading.value = true

      try {
        const resp = await ContatosAPI.listar(id)

        console.log(resp)
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

    onMounted(() => {
      listarUsuarios()
    })

    return {
      headers,
      contatos,
      loading,
      page,
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
    
</style>