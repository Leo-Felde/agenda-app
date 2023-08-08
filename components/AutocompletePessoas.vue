<!-- eslint-disable vue/no-v-model-argument -->
<template>
  <v-autocomplete
    v-model="pessoaSelecionada"
    label="pessoa"
    :items="pessoas"
    item-title="nome"
    return-object
    @update:search="buscarPessoas"
    @update:modelValue="selecionarPessoa"
  />
</template>

<script>
import { ref } from 'vue'

import PessoasAPI from '~/api/pessoas'
export default {
  props: {
    modelValue: { type: Object, default: () => {}}
  },

  emits: ['update:modelValue'],
  setup (props, { emit }) {
    const pessoas = ref([])
    const pessoaSelecionada = ref(null)
    
    const snackbar = useSnackbar()

    const buscarPessoas = async (event) => {
      try {
        const params = { nome: event }
        const resp = await PessoasAPI.pesquisar(params)
        pessoas.value = resp.data
      } catch (error) {
        snackbar.add({
          type: 'error',
          text: 'Ocorreu um erro ao pesquisar pessoas'
        })
        console.error(error)
      }
    }
    const selecionarPessoa = () => {
      emit('update:modelValue', pessoaSelecionada.value)
    }

    watch(() => props.modelValue, () => {
      if (!props.modelValue) return
      if (!pessoas.value.some(p => p.id === props.modelValue.id)) {
        pessoas.value.push(props.modelValue)
        setTimeout(() => {
          pessoaSelecionada.value = props.modelValue
        }, 100)
      }
    })

    onMounted(() => {
      if (props.modelValue) {
        pessoas.value.push(props.modelValue)
      }
    })

    return {
      pessoas,
      buscarPessoas,
      selecionarPessoa,
      pessoaSelecionada
    }
  }
}
</script>