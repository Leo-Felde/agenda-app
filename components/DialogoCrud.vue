<template>
  <v-dialog
    v-model="showDialog"
    width="900"
    persistent
  >
    <v-card>
      <div class="d-flex pa-2 justify-center">
        <span class="text-h6 my-auto"> {{ title }} </span> 
        <v-spacer />
        <v-btn
          icon="mdi-close"
          variant="text"
          class="my-auto"
          @click="cancelar"
        />
      </div>
      <v-divider class="pb-2" />

      <slot />

      <v-divider class="mt-2" />
      <div class="d-flex pa-2">
        <v-btn
          v-if="showDeleteBtn"
          color="red"
          append-icon="mdi-delete"
          @click="excluir"
        >
          Excluir
        </v-btn>
        <v-spacer />
        <v-btn
          class="mr-1"
          variant="text"
          @click="cancelar"
        >
          Cancelar
        </v-btn>
        <v-btn
          v-if="cancelar"
          color="primary"
          append-icon="mdi-content-save"
          @click="salvar"
        >
          Salvar
        </v-btn>
      </div>
    </v-card>
  </v-dialog>
</template>

<script>
import { ref } from 'vue'

export default {
  props: {
    modelValue: Boolean,
    showDeleteBtn: Boolean,
    showSaveBtn: { type: Boolean, default: true},
    title: { type: String, default: 'Titulo' }
  },

  emits: ['update:modelValue', 'salvar', 'cancelar', 'excluir'],

  setup (props, { emit }) {
    const form = ref(null)
    const showDialog = ref(false)

    watch(() => props.modelValue, (newValue) => {
      showDialog.value = newValue
    })

    const excluir = () => {
      emit('excluir')
    }

    const cancelar = () => {
      emit('cancelar')
    }

    const salvar = async () => {
      emit('salvar')
    }

    // const conclude = () => {
    //   emit('update:modelValue', false)
    //   form.value.reset() 
    // }

    return {
      form,
      showDialog,
      excluir,
      cancelar,
      salvar
    }
  }
}
</script>

<style>

</style>