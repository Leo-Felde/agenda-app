<template>
  <div>
    <v-row>
      <v-col
        cols="12"
        sm="12"
        md="4"
      >
        <v-text-field
          v-model="form.username"
          label="Nome"
          required
          :readonly="readonly"
          :rules="[rules.required]"
        />
      </v-col>
      <v-col
        cols="12"
        sm="12"
        md="4"
      >
        <v-text-field
          v-model="form.cpf"
          label="Documento"
          required
          :readonly="readonly"
          :rules="[rules.required]"
        />
      </v-col>
      <v-col
        cols="12"
        sm="12"
        md="4"
      >
        <v-text-field
          v-model="form.dataNascimento"
          label="Data de nascimento"
          required
          :readonly="readonly"
          :rules="[rules.required]"
        />
      </v-col>
    </v-row>
    <v-row>
      <v-col
        cols="12"
        sm="12"
        md="4"
      >
        <v-text-field
          v-model="form.telefone"
          label="Telefone"
          required
          :readonly="readonly"
          :rules="[rules.required]"
        />
      </v-col>
      <v-col
        cols="12"
        sm="12"
        md="4"
      >
        <v-text-field
          v-model="form.email"
          label="E-mail"
          required
          :readonly="readonly"
          :rules="[rules.required, rules.email]"
        />
      </v-col>
    </v-row>
    <!-- <v-row>
      <v-col
        cols="12"
        sm="12"
        md="4"
      >
        <v-text-field
          v-model="form.password"
          label="Senha"
          required
          :readonly="readonly"
          :type="showPassword ? 'text' : 'password'"
          :rules="[rules.required]"
          :append-inner-icon="`mdi-eye${showPassword ? '' : '-off'}`"
          @click:append-inner.stop="showPassword = !showPassword"
        />
      </v-col>
    </v-row> -->
  </div>
</template>

<script>
import { ref, computed } from 'vue'

export default {
  props: {
    usuario: { type: Object, default: () => {}},
    readonly: { type: Boolean, default: false }
  },

  // emits: ['update:modelValue'],

  setup (props) {
    const form = ref({})
    const showPassword = ref(false)

    const rules = ref({
      required: value => !!value || 'Campo obrigatório.',
      counter: value => value.length <= 20 || 'Max 20 characters',
      email: value => {
        const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        return pattern.test(value) || 'E-mail inválido.'
      }
    })

    const showDialog = computed(() => {
      return props.modelValue
    })

    const title = computed(() => {
      return `${props.usuario.id ? 'Editar' : 'Novo'} usuário`
    })

    watch(() => props.usuario, (newValue) => {
      form.value = newValue
    })

    return {
      form,
      showPassword,
      rules,
      showDialog,
      title
    }
  }
}
</script>

<style>

</style>