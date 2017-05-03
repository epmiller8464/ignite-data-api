const validator = require('validate.js')
const _ = require('lodash')
// const {Button} = require('./buttons')

validator.validate.validators.nestedButtonValidator = function (value, options, key, attributes) {

  // let isArray = validator.validate.isArray(value)
  if (!_.isArray(value)) {
    return `${key} must be an Array.`
  }
  let errors = []
  for (var i = 0; i < value.length; i++) {
    let btn = value[i]
    if (!_.isObject(btn)) {
      return `All values in ${key} must of type Button`
    }
    // _.forEach(options, (type, key) => {
    //
    //   if (!(btn instanceof type)) {
    //     errors.push(`All values in ${key} must of type Button`)
    //   }
    // })

    let buttonError = btn.isValid()
    if (buttonError.errors) {
      let flat = Array.of(buttonError.errors)
      errors.push(...flat)
    }
  }
  return errors.length > 0 ? errors : null
}

class IValidator {
  get constraints () {}

  static get utility () {
    return validator.validate
  }

  validate () {
    return validator.validate(this, this.constraints)
  }

  isValid () {}

}

module.exports = {
  IValidator
}
