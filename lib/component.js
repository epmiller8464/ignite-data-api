'use strict'
const IValidator = require('./validator').IValidator
const {
  ButtonType,
  UrlButton,
  PostbackButton,
  ShareButton,
  CallButton,
  BuyButton,
  MenuItem,
  LoginButton,
  LogoutButton
} = require('./buttons')

//
const ComponentTypes = {
  IMAGE: 'image',
  VIDEO: 'video',
  FILE: 'file',
  TEXT: 'text',
  AUDIO: 'audio',
  TEMPLATE: 'template',
  BUTTON: 'button',
  GENERIC: 'generic',
  LIST: 'list',
  RECEIPT: 'receipt',
  GREETING: 'greeting',
  GET_STARTED: 'get_started',
  PERSISTENT_MENU: 'persistent_menu',
  CALL_TO_ACTIONS: 'call_to_actions'
}

/**
 *
 */
class Component extends IValidator {
  constructor ({type, localization = {}}) {
    super()
    let self = this
    // this[Symbol('type.field')] = 'component_type'
    self.component_type = type
    self.payload = null
    self.is_valid = false
    self.localization = localization
  }

  get constraints () {
    return {
      component_type: {presence: true},
      payload: {presence: {message: 'Payload is required'}}
    }
  }

  validate () {
    return super.validate()
  }

  isValid () {
    let validationResults = this.validate()
    return {
      isValid: IValidator.utility.isEmpty(validationResults),
      errors: validationResults
    }
  }

  addButton () {}

  addElement () {}

  toObject (requireTypeField = true) {
    let self = this
    let component = {
      type: self.component_type,
      payload: self.payload
    }

    if (!requireTypeField) {
      delete component.type
    }

    return {
      [self.component_type]: component
    }
  }
}

class GenericTemplate extends Component {
  constructor ({localization, image_aspect_ratio = 'horizontal'}) {
    super({type: ComponentTypes.TEMPLATE, localization})
    let self = this
    self.payload = {
      template_type: ComponentTypes.GENERIC,
      image_aspect_ratio: image_aspect_ratio,
      elements: []
    }
  }

  get constraints () {
    return {
      type: {equality: ComponentTypes.TEMPLATE},
      component_type: {presence: true},
      payload: {presence: {message: 'Payload is required'}},
      'payload.template_type': {equality: ComponentTypes.GENERIC},
      elements: {
        length: {minimum: 0, maximum: 10, message: ' is limited to a maximum of %{count} allowed)'},
        nestedButtonValidator: function (value, options, key, attributes) {

        }
      }
    }
  }

  addElement (element) {

    let elementValidation = element.isValid()
    if (elementValidation) {
      throw new Error(elementValidation.join(' '))
    }
    this.payload.elements.push(element)
    return this

  }
}

class ButtonTemplate extends Component {
  constructor ({localization, text}) {
    super({type: ComponentTypes.TEMPLATE, localization})
    let self = this
    self.payload = {
      template_type: ComponentTypes.BUTTON,
      buttons: [],
      text: text
    }
  }

  addButton (button) {
    this.payload.buttons.push(button)
    return this
  }
}

class ListTemplate extends Component {
  constructor ({localization, topElementStyle = 'large'}) {
    super({type: ComponentTypes.TEMPLATE, localization})
    let self = this
    self.payload = {
      template_type: ComponentTypes.LIST,
      elements: [],
      buttons: [],
      top_element_style: topElementStyle
    }
  }

  addButton (button) {
    this.payload.buttons.push(button)
    return this
  }

  addElement (element) {
    this.payload.elements.push(element)
    return this
  }
}

class TextComponent extends Component {
  constructor ({text}) {
    super({type: ComponentTypes.TEXT})
    let self = this
    self.payload = {
      text: text
    }
  }
}

class FileComponent extends Component {
  constructor ({url}) {
    super({type: ComponentTypes.FILE})
    let self = this
    self.payload = {
      url: url
    }
  }
}

class ImageComponent extends Component {
  constructor ({url}) {
    super({type: ComponentTypes.IMAGE})
    let self = this
    self.payload = {
      url: url
    }
  }
}

class VideoComponent extends Component {
  constructor ({url}) {
    super({type: ComponentTypes.VIDEO})
    let self = this
    self.payload = {
      url: url
    }
  }
}

class AudioComponent extends Component {
  constructor ({url}) {
    super({type: ComponentTypes.AUDIO})
    let self = this
    self.payload = {
      url: url
    }
  }
}

class GetStarted {
  constructor () {
    let self = this
    self.setting_type = ComponentTypes.CALL_TO_ACTIONS
    self.thread_state = 'new_thread'
    self.call_to_actions = [{payload: 'DEFAULT_BLOCK'}]
  }

  transform () {
    let clone = Object.assign({}, this)
    return clone
  }
}

class Greeting {
  constructor ({text, locale = 'en_US', personalize = true}) {
    let self = this
    self.setting_type = ComponentTypes.GREETING
    self.type = ComponentTypes.GREETING
    self.locale = locale
    self.personalize = personalize
    self.text = this.personalize ? `Hello {{user_full_name}}, ${text}` : text
  }

  transform () {
    let greetings = [{
      locale: this.locale,
      text: this.text
    }, BuiltIn.defaults.greeting()]
    return {
      setting_type: this.setting_type,
      [this.type]: greetings
    }
  }
}

class PersistentMenu extends Component {
  constructor (locale) {
    super({type: ComponentTypes.PERSISTENT_MENU}, locale = 'en_US')
    let self = this
    self.locale = locale
    self.composer_input_disabled = false
    self.call_to_actions = []
  }

  transform () {
    let menu = Object.assign({}, this)
    return {
      [this.component_type]: menu
    }
  }
}



module.exports = {
  ComponentTypes,
  GetStarted,
  Greeting,
  // CallToAction,
  PersistentMenu,
  GenericTemplate,
  ListTemplate,
  ButtonTemplate,
  TextComponent,
  AudioComponent,
  VideoComponent,
  ImageComponent,
  FileComponent
}
