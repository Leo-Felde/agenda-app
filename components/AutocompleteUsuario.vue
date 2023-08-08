<!-- eslint-disable vue/no-v-model-argument -->
<template>
  <v-autocomplete
    v-model="usuarioSelecionado"
    label="usuario"
    :items="usuarios"
    item-title="nome"
    return-object
    @update:search="buscarUsuarios"
    @update:modelValue="selecionarUsuario"
  />
</template>

<script>
import { ref } from 'vue'

import UsuariosAPI from '~/api/usuarios'
export default {
  props: {
    modelValue: { type: Object, default: () => {}}
  },

  emits: ['update:modelValue'],
  setup (props, { emit }) {
    const usuarios = ref([])
    const usuarioSelecionado = ref(null)
    
    const snackbar = useSnackbar()

    const buscarUsuarios = async (event) => {
      try {
        const params = { termo: event }
        const resp = await UsuariosAPI.pesquisar(params)
        usuarios.value = resp.data
      } catch (error) {
        snackbar.add({
          type: 'error',
          text: 'Ocorreu um erro ao pesquisar usuarios'
        })
        console.error(error)
      }
    }
    const selecionarUsuario = () => {
      emit('update:modelValue', usuarioSelecionado.value)
    }

    watch(() => props.modelValue, () => {
      if (!props.modelValue) return
      if (!usuarios.value.some(u => u.id === props.modelValue.id)) {
        usuarios.value.push(props.modelValue)
        setTimeout(() => {
          usuarioSelecionado.value = props.modelValue
        }, 100)
      }
    })
    
    onMounted(() => {
      if (props.modelValue) {
        usuarios.value.push(props.modelValue)
      }
    })

    return {
      usuarios,
      buscarUsuarios,
      selecionarUsuario,
      usuarioSelecionado
    }
  }
}
</script>