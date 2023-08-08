import { ref } from 'vue'

export const rules = ref({
  required: value => !!value || 'Campo obrigatório.',
  counter: value => value.length <= 20 || 'Max 20 characters',
  email: value => {
    const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    return pattern.test(value) || 'E-mail inválido.'
  },
  cpf: value => {
    const pattern = /^\d{3}\.\d{3}\.\d{3}-\d{2}$/
    return pattern.test(value) || 'Cpf inválido'
  },
  senha: value => {
    const pattern = /^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d!@#$%^&*()-_=+[\]{}|;:'",.<>/?\\]+$/
    return value.length >= 8 ? pattern.test(value) || 'Deve conter letras e numeros' : 'Deve ter no minimo 8 characteres'
  }
})
