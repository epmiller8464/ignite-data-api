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
  LogoutButton,
  CallToAction,
  Element
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

  addButtons (...buttons) {}

  addElements (...elements) {}

  toObject () {
    return {
      type: this.component_type,
      payload: this.payload
    }
  }
}

class GenericTemplate extends Component {

  constructor ({localization, image_aspect_ratio = 'horizontal'}, ...elements) {
    super({type: ComponentTypes.TEMPLATE, localization})
    let self = this
    self.payload = {
      template_type: ComponentTypes.GENERIC,
      image_aspect_ratio: image_aspect_ratio,
      elements: Array.from(elements.slice(0, 10))
    }
  }

  get constraints () {
    return {
      component_type: {inclusion: [ComponentTypes.TEMPLATE]},
      payload: {presence: {message: 'Payload is required'}},
      'payload.template_type': {inclusion: [ComponentTypes.GENERIC]},
      'payload.elements': {
        nestedButtonValidator: [Element, UrlButton, PostbackButton],
        length: {
          minimum: 0, maximum: 10, message: ' is limited to a maximum of %{count} allowed)'
        }
      }
    }
  }

  addElements (...elements) {
    if (elements.length > 10) {
      console.log('Only 3 elements allowed.')
    }

    this.payload.elements = Array.from(elements.slice(0, 10))
    return this
  }

  toObject () {
    let copy = Object.assign({}, this)
    // copy['con']
    // delete copy.url
    // delete copy.fallback_url
    // delete copy.image_url
    return copy
  }
}

class ButtonTemplate extends Component {

  constructor ({localization, text}, ...buttons) {
    super({type: ComponentTypes.TEMPLATE, localization})
    let self = this
    self.payload = {
      template_type: ComponentTypes.BUTTON,
      text: text,
      buttons: []
    }
    self.addButtons(buttons)
  }

  get constraints () {
    return {
      type: {equality: ComponentTypes.BUTTON},
      component_type: {presence: true},
      payload: {presence: {message: 'Payload is required'}},
      'payload.template_type': {
        equality: {
          attribute: 'payload.template_type',
          message: `for GenericTemplate must equal ${ComponentTypes.GENERIC}`,
          comparator: function (v1, v2) {
            return v1 === ComponentTypes.TEMPLATE
          }
        }
      },
      'payload.elements': {
        nestedButtonValidator: [Element, UrlButton, PostbackButton],
        length: {
          minimum: 0, maximum: 3, message: ' is limited to a maximum of %{count} allowed)'
        }
      }
    }
  }

  addButtons (...buttons) {
    if (buttons.length > 3) {
      console.log('Only 3 buttons allowed.')
    }

    this.payload.buttons = Array.from(buttons.slice(0, 3))
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

  addButtons (...buttons) {
    if (buttons.length > 1) {
      console.log('Only 1 buttons allowed.')
    }

    this.payload.buttons = Array.from(buttons.slice(0, 1))
    return this
  }

  addElements (...elements) {
    if (elements.length > 4) {
      console.log('Only 4 elements allowed.')
    }

    this.payload.elements = Array.from(elements.slice(0, 4))
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

  toObject () {
    return Object.assign({}, this)
    // return {
    //   [this.setting_type]: menu
    // }
  }
}
const wrap = (...values) => {
  return values.map((v) => { return `{{${v}}}`}).join(' ')
}
class Greeting {
  constructor ({text, locale = 'en_US', personalize = true}, ...personalizations) {
    let self = this
    self.setting_type = ComponentTypes.GREETING
    self.type = ComponentTypes.GREETING
    self.locale = locale
    self.personalize = personalize
    self.text = this.formatText(text, ...personalizations)
  }

  formatText (text, ...personalizations) {
    console.log(...personalizations)
    if (!this.personalize)
      return `${text}.  I am powered by Ignite A.I.`

    if (personalizations.length > 0) {
      return `Hello ${wrap(...personalizations)}, ${text}. I am powered by Ignite A.I.`
    } else {
      return `Hello ${wrap(...['user_first_name', 'user_last_name'])}, ${text}. I am a bot powered by Ignite A.I.`
    }
  }

  static defaultGreeting (...personalizations) {
    if (personalizations.length > 0) {
      return {
        locale: 'default',
        text: `Hello ${wrap(...personalizations)}, I am a bot powered by Ignite A.I.`
      }
    } else {
      return {
        locale: 'default',
        text: `Hello ${wrap(...['user_first_name', 'user_last_name'])}, I am a bot powered by Ignite A.I.`
      }
    }
  }

  toObject () {
    let greetings = [{
      locale: this.locale,
      text: this.text
    }, Greeting.defaultGreeting()]
    return {
      // setting_type: this.setting_type,
      [this.setting_type]: greetings
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

  addCallToActions (...call_to_action) {
    if (this.call_to_actions.length > 1) {
      console.log('Only 1 call_to_actions allowed.')
    }

    this.call_to_actions = Array.from(call_to_action.slice(0, 1))
    return this
  }

  toObject () {
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
