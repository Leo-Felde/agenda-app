<template>
  <DialogoCrud
    v-model="showDialog"
    :title="titulo"
    @salvar="salvar"
    @cancelar="cancelar"
  >
    <v-form ref="form">
      <FormUsuario
        class="ma-3"
        :usuario="usuarioSelecionado"
        :show-password-field="!usuarioSelecionado.id"
      />
    </v-form>
  </DialogoCrud>
</template>

<script>
import { ref, computed } from 'vue'
import { isEqual, cloneDeep  } from 'lodash-es'
import { formatDate } from '~/utils/formatacao'

import UsuariosAPI from '~/api/usuarios'
export default {
  props: {
    usuario: {
      type: Object, default: () => {}
    },

    modelValue: Boolean
  },

  emits: ['update:modelValue', 'atualizar'],
  setup (props, { emit }) {
    const loading = ref(false)
    const form = ref(null)
    const showDialog = ref(false)
    const usuarioSelecionado = ref({tipos: ['ROLE_USER']})
    const usuarioOriginal = ref({tipos: ['ROLE_USER']})

    const snackbar = useSnackbar()
    const { $swal } = useNuxtApp()

    const alteracoesPendentes = computed(() => {
      return !isEqual(usuarioSelecionado.value, usuarioOriginal.value)
    })

    const titulo = computed(() => {
      return props.usuario.id ? 'Alterar usuário' : 'Novo usuário'
    })

    watch(() => props.usuario, () => {
      if (props.usuario.id) {
        carregar()
      }
    })

    watch(() => props.modelValue, (newValue) => {
      showDialog.value = newValue
      if (newValue && props.usuario.id) carregar()
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
        const params = {
          usuario: cloneDeep(usuarioSelecionado.value),
          tipos: usuarioSelecionado.value.tipos
        }
        params.usuario.dataNascimento = formatDate(params.usuario.dataNascimento, false)
        // Eu deveria criar arquivos uteis de formatação, mas eu tenho preguiça >.<

        await UsuariosAPI.salvar(params)
        snackbar.add({
          type: 'success',
          text: props.usuario.id ? 'Usuario atualizado' : 'Usuario cadastrado'
        })
        emit('atualizar')
        conclude()
      } catch (error) {
        snackbar.add({
          type: 'error',
          text: 'Ocorreu um erro ao salvar o usuario'
        })
      } finally {
        loading.value = false
      }
    }

    const carregar = async () => {
      try {
        const resp = await UsuariosAPI.buscar(props.usuario.id)
        usuarioOriginal.value = resp.data.object.usuario

        usuarioOriginal.value.dataNascimento = formatDate(usuarioOriginal.value.dataNascimento)
        usuarioOriginal.value.tipos = resp.data.object.tipos
        usuarioSelecionado.value = cloneDeep(usuarioOriginal.value)
      } catch (error) {
        snackbar.add({
          type: 'error',
          text: 'Ocorreu um erro ao carregar o usuario'
        })
      } finally {
        loading.value = false
      }
    }

    const conclude = () => {
      usuarioOriginal.value = { tipos: ['ROLE_USER'] }
      usuarioSelecionado.value = cloneDeep(usuarioOriginal.value)
      form.value.reset()
      emit('update:modelValue', false)
    }

    return {
      form,
      showDialog,
      titulo,
      usuarioSelecionado,
      usuarioOriginal,
      cancelar,
      salvar
    }
  }
}
</script>

<style>

</style>