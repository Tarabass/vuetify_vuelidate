import { required, maxLength, minLength, email } from 'vuelidate/lib/validators'
const touchMap = new WeakMap()

export const UserFormValidationMixin = {
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
    submit () {
      this.$v.$touch()
      console.log('submit from mixin')
    },
    delayTouch ($v) {
      $v.$reset()
      if (touchMap.has($v)) {
        clearTimeout(touchMap.get($v))
      }
      touchMap.set($v, setTimeout($v.$touch, 1000))
    },
    async getTerminals () {
      const response = await fetch('./api/terminals.json', {})
      return await response.json()
    }
  }
}
