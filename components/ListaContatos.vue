<template>
  <VDataTable
    item-value="name"
    fixed-header
    :headers="headers"
    :items="contatos"
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

    <template #item="{ item }">
      <tr>
        <td>
          <div class="d-flex py-2">
            <PessoaImagem :id="item.selectable.pessoa.id" />
            <div class="d-flex flex-column my-auto ml-2">
              <span class="contact-name">
                {{ item.selectable.pessoa.nome }}
              </span>
              <span
                v-if="item.selectable.email"
                class="contact-email"
              >
                {{ item.selectable.email }}
              </span>
            </div>
            <v-icon
              v-if="item.selectable.favorito"
              color="yellow"
              class="my-auto ml-5"
            >
              mdi-star
            </v-icon>
          </div>
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
        <td class="text-center">
          <v-btn
            icon="mdi-pencil"
            variant="text"
            @click="$emit('editar', item.selectable)"
          />
          <v-menu :close-on-content-click="false">
            <template #activator="{ props }">
              <v-btn
                icon="mdi-dots-vertical"
                variant="text"
                v-bind="props"
              />
            </template>
            <v-list>
              <v-list-item @click="toggleFavorito(item.selectable)">
                <v-list-item-title>
                  {{ item.selectable.favorito ? 'Desfavoritar' : 'favoritar' }}
                </v-list-item-title>
              </v-list-item>
              <v-list-item @click="excluirContato(item.selectable)">
                <v-list-item-title>
                  Excluir
                </v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </td>
      </tr>
    </template>
  </VDataTable>
</template>

<script>
import { ref } from 'vue'
import { VDataTable } from 'vuetify/labs/VDataTable'
import { VSkeletonLoader } from 'vuetify/labs/VSkeletonLoader'
import { useDisplay } from 'vuetify'

import ContatoAPI from '~/api/contatos'
import FavoritosAPI from '~/api/favoritos'
export default {
  components: {
    VDataTable,
    VSkeletonLoader,
  },

  props: {
    data: {
      type: Array,
      default: () => {}
    },

    loading: Boolean
  },


  emits: ['atualizar', 'editar'],
  setup (props, { emit }) {
    const headers = ref([
      {
        title: 'Informações',
        sortable: true,
        key: 'pessoa.nome'
      },
      {
        title: 'Forma de contato',
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

    const snackbar = useSnackbar()
    const { $swal } = useNuxtApp()
    const { mobile } = useDisplay()

    const contatos = computed(() => {
      return props.data
    })

    const toggleFavorito = async (contato) => {
      try {
        if (contato.favorito) {
          $swal.fire({
            title: 'Desfavoritar?',
            showCancelButton: true,
            confirmButtonText: 'Desfavoritar',
            cancelButtonText: 'Cancelar',
            reverseButtons: true
          }).then((result) => {
            if (result.isConfirmed) {
              favoritar(contato)
            }
          })
        } else {
          favoritar(contato)
        }
      } catch (error) {
        console.error(error)
      }
    }

    const favoritar = async (contato) => {
      try {
        if (contato.favorito) {
          await FavoritosAPI.excluir(contato.id)
        } else {
          await FavoritosAPI.salvar(contato)
        }
        emit('atualizar')
      } catch (error) {
        console.error(error)
      }
    }

    const excluirContato = async (contato) => {
      try {
        $swal.fire({
          title: 'Excluir contato?',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonText: 'Excluir',
          confirmButtonColor: '#d33',
          cancelButtonText: 'Cancelar',
        }).then(async (result) => {
          if (result.isConfirmed) {
            try {
              await ContatoAPI.excluir(contato.id)
              snackbar.add({
                type: 'success',
                text: 'contato excluído'
              })
              emit('atualizar')
            } catch (error) {
              console.error(error)
              snackbar.add({
                type: 'error',
                text: 'Ocorreu um erro ao excluir o contato'
              })
            }
          }
        })
      } catch (error) {
        console.error(error)
      }
    }
    

    return {
      headers,
      contatos,
      mobile,
      toggleFavorito,
      excluirContato
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
    
.user-image
  width: 70px

:deep(.v-skeleton-loader__bone)
  height: inherit
</style>