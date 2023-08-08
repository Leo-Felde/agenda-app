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
          v-model="form.cpf"
          v-maska:[maskCpf]
          label="Cpf"
          required
          :readonly="readonly"
          :rules="[rules.required, rules.cpf]"
        />
      </v-col>
      <v-col
        cols="12"
        sm="12"
        md="4"
      >
      <!--  POR UM SELECIONADOR DE IMAGEM AQUI !!! -->
      </v-col>
    </v-row>
    <v-row>
      <v-col
        cols="12"
        sm="12"
        md="4"
      >
        <v-text-field
          v-model="form.endereco.cidade"
          label="Cidade"
          :readonly="readonly"
        />
      </v-col>
      <v-col
        cols="12"
        sm="12"
        md="4"
      >
        <v-text-field
          v-model="form.endereco.estado"
          label="Estado"
          :readonly="readonly"
        />
      </v-col>
      <v-col
        cols="12"
        sm="12"
        md="4"
      >
        <v-text-field
          v-model="form.endereco.cep"
          v-maska:[maskCEP]
          label="CEP"
          :readonly="readonly"
        />
      </v-col>
      <v-col
        cols="12"
        sm="12"
        md="4"
      >
        <v-text-field
          v-model="form.endereco.bairro"
          label="Bairro"
          :readonly="readonly"
        />
      </v-col>
      <v-col
        cols="12"
        sm="12"
        md="4"
      >
        <v-text-field
          v-model="form.endereco.numero"
          label="Numero"
          :readonly="readonly"
        />
      </v-col>
      <v-col
        cols="12"
        sm="12"
        md="4"
      >
        <v-text-field
          v-model="form.endereco.logradouro"
          label="Logradouro"
          :readonly="readonly"
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
    pessoa: { type: Object, default: () => {}},
    readonly: { type: Boolean, default: false }
  },

  setup (props) {
    const form = ref({endereco: {}})
    const maskCpf = { mask: '###.###.###-##' }
    const maskCEP = { mask: '#####-###' }

    const showDialog = computed(() => {
      return props.modelValue
    })

    const title = computed(() => {
      return `${props.pessoa.id ? 'Editar' : 'Novo'} usuário`
    })

    watch(() => props.pessoa, () => {
      form.value = props.pessoa
    })

    onMounted(() => {
      form.value = props.pessoa
    })

    return {
      form,
      maskCpf,
      maskCEP,
      rules,
      showDialog,
      title
    }
  }
}
</script>
