<template>
  <DialogoCrud
    v-model="showDialog"
    :title="titulo"
    :show-delete-btn="!!pessoaSelecionada.id"
    @salvar="salvar"
    @cancelar="cancelar"
    @excluir="excluir"
  >
    <v-form ref="form">
      <FormPessoa
        class="ma-3"
        :pessoa="pessoaSelecionada"
      />
    </v-form>
  </DialogoCrud>
</template>

<script>
import { ref, computed } from 'vue'
import { isEqual, cloneDeep  } from 'lodash-es'

import PessoasAPI from '~/api/pessoas'
export default {
  props: {
    pessoa: {
      type: Object, default: () => {}
    },

    modelValue: Boolean
  },

  emits: ['update:modelValue', 'atualizar'],
  setup (props, { emit }) {
    const loading = ref(false)
    const form = ref(null)
    const showDialog = ref(false)
    const pessoaSelecionada = ref({endereco: {}})
    const pessoaOriginal = ref({endereco: {}})

    const snackbar = useSnackbar()
    const { $swal } = useNuxtApp()

    const alteracoesPendentes = computed(() => {
      return !isEqual(pessoaSelecionada.value, pessoaOriginal.value)
    })

    const titulo = computed(() => {
      return props.pessoa.id ? 'Alterar pessoa' : 'Nova pessoa'
    })

    watch(() => props.pessoa, () => {
      if (props.pessoa.id) {
        carregar()
      }
    })

    watch(() => props.modelValue, (newValue) => {
      showDialog.value = newValue
      if (newValue && props.pessoa.id) carregar()
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
      } else {
        conclude()
      }
    }

    const salvar = async () => {
      const { valid } = await form.value.validate()
      if (!valid) return
      if (!alteracoesPendentes.value) {
        conclude()
        return
      }

      try {
        await PessoasAPI.salvar(pessoaSelecionada.value)
        snackbar.add({
          type: 'success',
          text: props.pessoa.id ? 'Pessoa atualizada' : 'pessoa cadastrada'
        })
        emit('atualizar')
        conclude()
      } catch (error) {
        snackbar.add({
          type: 'error',
          text: 'Ocorreu um erro ao salvar a pessoa'
        })
      } finally {
        loading.value = false
      }
    }

    const excluir = async () => {
      $swal.fire({
        title: 'Excluir pessoa?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Excluir',
        confirmButtonColor: '#d33',
        cancelButtonText: 'Cancelar',
      }).then(async (result) => {
        loading.value = true
        if (result.isConfirmed) {
          try {
            await PessoasAPI.excluir(pessoaSelecionada.value.id)
            snackbar.add({
              type: 'success',
              text: 'Pessoa excluída'
            })
            emit('atualizar')
            conclude()
          } catch (error) {
            snackbar.add({
              type: 'error',
              text: 'Ocorreu um erro ao excluir a pessoa'
            })
          } finally {
            loading.value = false
          }
        }
      })
    }

    const carregar = async () => {
      try {
        const resp = await PessoasAPI.buscar(props.pessoa.id)
        pessoaOriginal.value = resp.data.object
        pessoaSelecionada.value = cloneDeep(pessoaOriginal.value)
      } catch (error) {
        snackbar.add({
          type: 'error',
          text: 'Ocorreu um erro ao carregar a pessoa'
        })
      } finally {
        loading.value = false
      }
    }

    const conclude = () => {
      pessoaOriginal.value = { endereco: {} }
      pessoaSelecionada.value = cloneDeep(pessoaOriginal.value)
      form.value.reset()
      emit('update:modelValue', false)
    }

    return {
      form,
      showDialog,
      titulo,
      pessoaSelecionada,
      pessoaOriginal,
      cancelar,
      salvar,
      excluir
    }
  }
}
</script>

<style>

</style>