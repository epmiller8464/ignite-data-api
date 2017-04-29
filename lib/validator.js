const validator = require('validate.js')

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
