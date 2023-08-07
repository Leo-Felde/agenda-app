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
      />
    </v-form>
  </DialogoCrud>
</template>

<script>
import { ref, computed } from 'vue'
import { isEqual, cloneDeep  } from 'lodash-es'

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
    const usuarioSelecionado = ref({})
    const usuarioOriginal = ref({})
    
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
      if (newValue) carregar()
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
        await UsuariosAPI.salvar(usuarioSelecionado.value)
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
      usuarioOriginal.value = { usuario: {} }
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