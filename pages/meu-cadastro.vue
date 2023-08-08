<template>
  <v-card
    elevation="0"
    width="100%"
  >
    <v-card-title class="d-flex mb-2 px-4 pt-4">
      Meu cadastro
      <v-spacer />
      <v-btn
        color="primary"
        append-icon="mdi-pencil"
        :disabled="editando"
        @click="editando = true"
      >
        Alterar
      </v-btn>
    </v-card-title>
    <v-divider />
    <v-progress-linear
      v-if="loading"
      color="primary"
      indeterminate
    />
    <v-form ref="form">
      <FormUsuario
        class="ma-3"
        :readonly="!editando"
        :usuario="usuario"
      />
    </v-form>
    <v-divider />
    <div class="d-flex pa-2">
      <v-spacer />
      <v-btn
        variant="text"
        class="mr-1"
        :disabled="!editando"
        @click="cancelar"
      >
        cancelar
      </v-btn>
      <v-btn
        color="primary"
        :disabled="!editando"
        class="mr-1"
        append-icon="mdi-content-save"
        @click="salvar"
      >
        salvar
      </v-btn>
    </div>
  </v-card>
</template>

<script>
import { ref, onMounted, computed } from 'vue'
import { isEqual, cloneDeep } from 'lodash-es'
import { formatDate } from '~/utils/formatacao'

import UsuariosAPI from '~/api/usuarios'
export default {
  setup () {
    const editando = ref(false)
    const loading = ref(false)
    const form = ref(null)
    const usuario = ref({})
    const usuarioOriginal = ref({})
    
    const user = useCurrentUser()
    const snackbar = useSnackbar()
    const { $swal } = useNuxtApp()

    const alteracoesPendentes = computed(() => {
      return editando.value ? !isEqual(usuarioOriginal.value, usuario.value) : false
    })

    const salvar = async () => {
      const { valid } = await form.value.validate()
      if (!valid) return
      if (!alteracoesPendentes.value) {
        conclude()
        return
      }

      try {
        await UsuariosAPI.atualizar(usuario.value)
        snackbar.add({
          type: 'success',
          text: 'Usuário atualizado'
        })
        editando.value = false
      } catch (error) {
        snackbar.add({
          type: 'error',
          text: 'Ocorreu um erro ao buscar o usuário'
        })
      } finally {
        loading.value = false
      }
    }

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

    const conclude = () => {
      usuario.value = cloneDeep(usuarioOriginal.value)
      editando.value = false
    }

    const carregar = async () => {
      const id = user.value.id 
      loading.value = true

      try {
        const resp = await UsuariosAPI.buscar(id)

        usuarioOriginal.value = resp.data.object.usuario
        usuarioOriginal.value.dataNascimento = formatDate(usuarioOriginal.value.dataNascimento)
        usuario.value = cloneDeep(usuarioOriginal.value)
      } catch (error) {
        snackbar.add({
          type: 'error',
          text: 'Ocorreu um erro ao buscar o usuário'
        })
      } finally {
        loading.value = false
      }
    }

    onMounted(() => {
      carregar()
    })

    return {
      editando,
      loading,
      form,
      usuario,
      salvar,
      cancelar
    }
  }
}
</script>

<style>

</style>