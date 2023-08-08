<template>
  <div>
    <v-row>
      <v-col
        cols="12"
        sm="12"
        md="4"
      >
        <AutocompletePessoas v-model="form.pessoa" />
      </v-col>
      <v-col
        cols="12"
        sm="12"
        md="4"
      >
        <AutocompleteUsuario v-model="form.usuario" />
      </v-col>
    </v-row>
    <v-row>
      <v-col
        cols="12"
        sm="12"
        md="4"
      >
        <v-select
          v-model="form.tipoContato"
          label="Tipo de contato"
          :items="tiposContato"
          item-title="text"
          item-value="value"
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
          :readonly="readonly"
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
          :readonly="readonly"
          :rules="form.email ? [rules.email] : []"
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
          v-model="form.tag"
          label="tag"
          :rules="[rules.required]"
        />
      </v-col>
      <v-col
        cols="12"
        sm="12"
        md="4"
      >
        <v-switch
          v-model="form.privado"
          color="primary"
          label="Privado"
        />
      </v-col>
    </v-row>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { rules } from '~/utils/validationRules'

export default {
  props: {
    contato: { type: Object, default: () => {}},
    readonly: { type: Boolean, default: false }
  },

  setup (props) {
    const form = ref({})
    const tiposContato = ref([
      {text: 'Celular', value: 'CELULAR'},
      {text: 'Telefone', value: 'TELEFONE'},
      {text: 'E-mail', value: 'EMAIL'}
    ])
    const maskTelefone = { mask: '(##) ####-####' }

    const showDialog = computed(() => {
      return props.modelValue
    })

    const title = computed(() => {
      return `${props.contato.id ? 'Editar' : 'Novo'} contato`
    })

    watch(() => props.contato, () => {
      form.value = props.contato ? props.contato : {}
    })

    onMounted(() => {
      form.value = props.contato
    })

    return {
      form,
      tiposContato,
      maskTelefone,
      rules,
      showDialog,
      title
    }
  }
}
</script>
