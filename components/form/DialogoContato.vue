<template>
  <DialogoCrud
    v-model="showDialog"
    :title="titulo"
    :show-delete-btn="!!contatoSelecionado.id"
    @salvar="salvar"
    @cancelar="cancelar"
    @excluir="excluir"
  >
    <v-form ref="form">
      <FormContato
        class="ma-3"
        :contato="contatoSelecionado"
      />
    </v-form>
  </DialogoCrud>
</template>

<script>
import { ref, computed } from 'vue'
import { isEqual, cloneDeep  } from 'lodash-es'

import ContatoAPI from '~/api/contatos'
export default {
  props: {
    contato: {
      type: Object, default: () => { }
    },
    modelValue: Boolean
  },

  emits: ['update:modelValue', 'atualizar'],
  setup(props, { emit }) {
    const loading = ref(false)
    const form = ref(null)
    const showDialog = ref(false)
    const contatoSelecionado = ref({ pessoa: {}, contato: {} })
    const contatoOriginal = ref({ pessoa: {}, contato: {} })

    const snackbar = useSnackbar()
    const { $swal } = useNuxtApp()

    const alteracoesPendentes = computed(() => {
      return !isEqual(contatoSelecionado.value, contatoOriginal.value)
    })
    const titulo = computed(() => {
      return props.contato.id ? 'Alterar contato' : 'Novo contato'
    })

    watch(() => props.contato, () => {
      if (props.contato.id) {
        carregar()
      }
    })

    watch(() => props.modelValue, (newValue) => {
      showDialog.value = newValue
      if (newValue && props.contato.id)
        carregar()
    })
    const cancelar = () => {
      if (alteracoesPendentes.value) {
        $swal.fire({
          title: 'Descartar alterações?',
          showCancelButton: true,
          confirmButtonText: 'Descartar',
          confirmButtonColor: '#d33',
          cancelButtonText: 'Cancelar',
        }).then((result) => {
          if (result.isConfirmed) {
            conclude()
          }
        })
      }
      else {
        conclude()
      }
    }

    const salvar = async () => {
      const { valid } = await form.value.validate()
      if (!valid)
        return
      if (!alteracoesPendentes.value) {
        conclude()
        return
      }
      try {
        await ContatoAPI.salvar(contatoSelecionado.value)
        snackbar.add({
          type: 'success',
          text: props.contato.id ? 'contato atualizado' : 'contato cadastrado'
        })
        emit('atualizar')
        conclude()
      }
      catch (error) {
        snackbar.add({
          type: 'error',
          text: 'Ocorreu um erro ao salvar o contato'
        })
      }
      finally {
        loading.value = false
      }
    }

    const excluir = async () => {
      $swal.fire({
        title: 'Excluir contato?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Excluir',
        confirmButtonColor: '#d33',
        cancelButtonText: 'Cancelar',
      }).then(async (result) => {
        loading.value = true
        if (result.isConfirmed) {
          try {
            await ContatoAPI.excluir(contatoSelecionado.value.id)
            snackbar.add({
              type: 'success',
              text: 'contato excluído'
            })
            emit('atualizar')
            conclude()
          }
          catch (error) {
            snackbar.add({
              type: 'error',
              text: 'Ocorreu um erro ao excluir o contato'
            })
          }
          finally {
            loading.value = false
          }
        }
      })
    }
    
    const carregar = () => {
      contatoOriginal.value = props.contato
      contatoSelecionado.value = cloneDeep(contatoOriginal.value)
    }

    const conclude = () => {
      contatoOriginal.value = { pessoa: {}, contato: {} }
      contatoSelecionado.value = cloneDeep(contatoOriginal.value)
      form.value.reset()
      emit('update:modelValue', false)
    }
    return {
      form,
      showDialog,
      titulo,
      contatoSelecionado,
      contatoOriginal,
      cancelar,
      salvar,
      excluir
    }
  }
}
</script>

<style>

</style>