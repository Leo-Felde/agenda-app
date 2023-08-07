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
      <v-col
        cols="12"
        sm="12"
        md="4"
      >
        <v-select
          v-if="form.tipos"
          v-model="form.tipos"
          :items="tiposUsuario"
          item-title="text"
          item-value="value"
          :readonly="readonly"
          :rules="[rules.required]"
        />
      </v-col>
    </v-row>
  </div>
</template>

<script>
import { ref, computed } from 'vue'
import { rules } from '~/assets/validationRules'

export default {
  props: {
    usuario: { type: Object, default: () => {}},
    readonly: { type: Boolean, default: false }
  },

  setup (props) {
    const form = ref({})
    const showPassword = ref(false)
    const tiposUsuario = ref([
      { text: 'Usuário', value: 'ROLE_USER' },
      { text: 'Admin', value: 'ROLE_ADMIN' },
    ])

    const showDialog = computed(() => {
      return props.modelValue
    })

    const title = computed(() => {
      return `${props.usuario.id ? 'Editar' : 'Novo'} usuário`
    })

    watch(() => props.usuario, () => {
      form.value = props.usuario
    })

    onMounted(() => {
      form.value = props.usuario
    })

    return {
      form,
      showPassword,
      tiposUsuario,
      rules,
      showDialog,
      title
    }
  }
}
</script>
