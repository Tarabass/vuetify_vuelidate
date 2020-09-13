<template>
  <form style="width: 300px; margin: 50px auto 0">
    <v-text-field
      v-model="terminal"
      :error-messages="terminalErrors"
      label="Terminal"
      required
      @input="delayTouch($v.terminal)"
      @blur="$v.terminal.$touch()"
    ></v-text-field>
    <v-text-field
      v-model="name"
      :error-messages="nameErrors"
      :counter="10"
      label="Name"
      required
      @input="$v.name.$touch()"
      @blur="$v.name.$touch()"
    ></v-text-field>
    <v-text-field
      v-model="email"
      :error-messages="emailErrors"
      label="E-mail"
      required
      @input="$v.email.$touch()"
      @blur="$v.email.$touch()"
    ></v-text-field>
    <v-select
      v-model="select"
      :items="items"
      :error-messages="selectErrors"
      label="Item"
      required
      @change="$v.select.$touch()"
      @blur="$v.select.$touch()"
    ></v-select>
    <v-checkbox
      v-model="checkbox"
      :error-messages="checkboxErrors"
      label="Do you agree?"
      required
      @change="$v.checkbox.$touch()"
      @blur="$v.checkbox.$touch()"
    ></v-checkbox>

    <v-btn class="mr-4" @click="submit">submit</v-btn>
    <v-btn @click="clear">clear</v-btn>
  </form>
</template>

<script>
import { validationMixin } from 'vuelidate'
import { required, maxLength, minLength, email } from 'vuelidate/lib/validators'

const touchMap = new WeakMap()

export default {
  mixins: [validationMixin],

  validations: {
    terminal: {
      required,
      minLength: minLength(3),
      async isUnique (value) {
        if (value === '') return true

        const data = await this.getTerminals()
        return Boolean(data.terminals.indexOf(value) < 0)
      }
    },
    name: { required, maxLength: maxLength(10) },
    email: { required, email },
    select: { required },
    checkbox: {
      checked (val) {
        return val
      }
    }
  },

  data: () => ({
    terminal: '',
    name: '',
    email: '',
    select: null,
    items: [
      'Item 1',
      'Item 2',
      'Item 3',
      'Item 4'
    ],
    checkbox: false
  }),

  computed: {
    checkboxErrors () {
      const errors = []
      if (!this.$v.checkbox.$dirty) return errors
      !this.$v.checkbox.checked && errors.push('You must agree to continue!')
      return errors
    },
    selectErrors () {
      const errors = []
      if (!this.$v.select.$dirty) return errors
      !this.$v.select.required && errors.push('Item is required')
      return errors
    },
    terminalErrors () {
      const errors = []
      if (!this.$v.terminal.$dirty) return errors
      !this.$v.terminal.minLength && errors.push('Terminal must be at least 3 characters long')
      !this.$v.terminal.required && errors.push('Terminal is required.')
      !this.$v.terminal.isUnique && errors.push('Terminal must be unique.')

      return errors
    },
    nameErrors () {
      const errors = []
      if (!this.$v.name.$dirty) return errors
      !this.$v.name.maxLength && errors.push('Name must be at most 10 characters long')
      !this.$v.name.required && errors.push('Name is required.')
      return errors
    },
    emailErrors () {
      const errors = []
      if (!this.$v.email.$dirty) return errors
      !this.$v.email.email && errors.push('Must be valid e-mail')
      !this.$v.email.required && errors.push('E-mail is required')
      return errors
    }
  },

  methods: {
    delayTouch ($v) {
      $v.$reset()
      if (touchMap.has($v)) {
        clearTimeout(touchMap.get($v))
      }
      touchMap.set($v, setTimeout($v.$touch, 1000))
    },
    submit () {
      this.$v.$touch()
    },
    clear () {
      this.$v.$reset()
      this.terminal = ''
      this.name = ''
      this.email = ''
      this.select = null
      this.checkbox = false
    },
    async getTerminals () {
      const response = await fetch('./api/terminals.json', {})
      return await response.json()
    }
  }
}
</script>
