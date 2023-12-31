<template>
  <div>
    <v-row>
      <v-col
        cols="12"
        sm="12"
        md="4"
      >
        <v-text-field
          v-model="form.nome"
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
          v-model="form.username"
          label="Nome de usuário"
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
          v-maska:[maskCpf]
          label="Cpf"
          required
          :readonly="readonly"
          :rules="[rules.required, rules.cpf]"
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
          v-model="form.dataNascimento"
          v-maska:[maskData]
          label="Data de nascimento"
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
          v-model="form.telefone"
          v-maska:[maskTelefone]
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
    <v-divider
      v-if="showPasswordField"
      class="my-2"
    />
    <v-row v-if="showPasswordField">
      <v-col
        cols="12"
        sm="12"
        md="4"
      >
        <v-text-field
          v-model="form.password"
          label="Senha"
          required
          :type="showPassword ? 'text' : 'password'"
          :readonly="readonly"
          :rules="[rules.required, rules.senha]"
          :append-inner-icon="`mdi-eye${showPassword ? '' : '-off'}`"
          @click:append-inner.stop="showPassword = !showPassword"
        />
      </v-col>
      <v-col
        cols="12"
        sm="12"
        md="4"
      >
        <v-text-field
          v-model="form.passwordConfirm"
          label="Confirme a senha"
          required
          :type="showPassword ? 'text' : 'password'"
          :readonly="readonly"
          :rules="[rules.required, rules.senha, confirmarSenha]"
        />
      </v-col>
    </v-row>
  </div>
</template>

<script>
import { ref, computed } from 'vue'
import { rules } from '~/utils/validationRules'

export default {
  props: {
    usuario: { type: Object, default: () => {}},
    readonly: { type: Boolean, default: false },
    showPasswordField: Boolean
  },

  setup (props) {
    const form = ref({})
    const maskCpf = { mask: '###.###.###-##' }
    const maskTelefone = { mask: '(##) ####-####' }
    const maskData = { mask: '##/##/####'}
    const showPassword = ref(false)
    const tiposUsuario = ref([
      { text: 'Usuário', value: 'ROLE_USER' },
      { text: 'Admin', value: 'ROLE_ADMIN' },
    ])

    const showDialog = computed(() => {
      return props.modelValue
    })

    const confirmarSenha = computed(() => {
      return (form.value.password === form.value.passwordConfirm) || 'As senhas não são iguais'
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
      maskCpf,
      maskTelefone,
      maskData,
      showPassword,
      tiposUsuario,
      confirmarSenha,
      rules,
      showDialog,
      title
    }
  }
}
</script>
