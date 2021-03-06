/* eslint-disable camelcase */
'use strict'
const IValidator = require('./validator').IValidator

const ButtonTypes = {
  WEB_URL: 'web_url',
  POSTBACK: 'postback',
  CALL: 'phone_number',
  SHARE: 'element_share',
  BUY: 'payment',
  LOGIN: 'account_link',
  LOGOUT: 'account_unlink',
  DEFAULT: 'default',
  QUICK_REPLY: 'quick_reply'
}

class Button extends IValidator {
  constructor ({type, url, imageUrl, fallbackUrl, webview_height_ratio = 'compact', messenger_extensions = false}) {
    super()
    let self = this
    self.type = type
    self.url = url || null
    self.payload = {}
    self.fallback_url = fallbackUrl || null
    self.image_url = imageUrl || null
    self.webview_height_ratio = webview_height_ratio || null
    self.messenger_extensions = messenger_extensions
    self.webview_share_button = 'hide'
  }

  get constraints () {
    return {
      type: {presence: true}
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

  setPayload (...blocks) {}

  toObject () {
    return Object.assign({}, this)
  }
}
const WEB_URL = Symbol(`${ButtonTypes.WEB_URL}.constraints`)
const POSTBACK = Symbol(`${ButtonTypes.POSTBACK}.constraints`)

class UrlButton extends Button {
  constructor ({title, url, fallbackUrl, webview_height_ratio = 'tall', messenger_extensions = false}) {
    super({type: ButtonTypes.WEB_URL, url, fallbackUrl, webview_height_ratio, messenger_extensions})
    let self = this
    self.title = title
    self[WEB_URL] = self.constraints
  }

  get constraints () {
    let _constraints = super.constraints
    Object.assign(_constraints, {
      title: {presence: true, length: {minimum: 1, maximum: 20}},
      url: {
        presence: true,
        url: {schemes: ['http', 'https'], message: 'is not a valid url, the url must support https.'}
      }
    })
    return _constraints
  }

  toObject () {
    let copy = Object.assign({}, this)
    delete copy.payload
    return copy
  }
}

class DefaultAction extends UrlButton {
  constructor ({url, fallbackUrl, webview_height_ratio = 'full', messenger_extensions = false}, ...buttons) {
    super({url, fallbackUrl, webview_height_ratio, messenger_extensions})
    let self = this
    self.buttons = Array.from(buttons.slice(0, MAX_BUTTONS))
  }

  get constraints () {
    let _constraints = super.constraints

    Object.assign(_constraints, {
      title: {length: {is: 0}},
      buttons: {length: {minimum: 0, maximum: MAX_BUTTONS, message: 'too many buttons (maximum of 3 allowed)'}}
    })
    return _constraints
  }

  addButtons (buttons) {
    if (this.buttons.length >= MAX_BUTTONS) {
      this.buttons = this.buttons.slice(0, MAX_BUTTONS)
    }

    this.buttons = Array.from(buttons.slice(0, MAX_BUTTONS))
    return this
  }

  toObject () {
    let copy = Object.assign({}, this)
    delete copy.payload
    delete copy.type
    delete copy.title
    return copy
  }
}

class PostbackButton extends Button {
  constructor ({title}, ...blocks) {
    super({type: ButtonTypes.POSTBACK, title})
    let self = this
    self.title = title
    self.payload = {blocks: Array.from(blocks)}
    self[POSTBACK] = this.constraints
  }

  get constraints () {
    let _constraints = super.constraints
    Object.assign(_constraints, {
      title: {presence: true, length: {minimum: 1, maximum: (MAX_BUTTON_TITLE_CHARS)}},
      'payload.blocks': {presence: true}
    })
    return _constraints
  }

  addBlocks (...blocks) {
    // slice(0, MAX_BUTTONS - 1)
    this.payload.blocks.push(...blocks)
    return this
  }

  toObject () {
    let copy = Object.assign({}, this)
    delete copy.url
    delete copy.fallback_url
    delete copy.image_url
    return copy
  }
}

class CallButton extends Button {
  constructor () {
    super()
    let self = this
    self.type = ButtonTypes.CALL
    self.payload = null
  }
}

class BuyButton extends Button {
  constructor () {
    super()
    let self = this
    self.type = ButtonTypes.BUY
    self.payload = null
  }
}

class ShareButton extends Button {
  constructor () {
    super()
    let self = this
    self.type = ButtonTypes.SHARE
  }
}

class LoginButton extends Button {
  constructor () {
    super()
    let self = this
    self.type = ButtonTypes.LOGIN
  }
}

class LogoutButton extends Button {
  constructor () {
    super()
    let self = this
    self.type = ButtonTypes.LOGOUT
  }
}

class Element extends IValidator {
  constructor ({title, subtitle, image_url}, ...buttons) {
    super()
    let self = this
    self.title = title
    self.subtitle = subtitle
    self.image_url = image_url
    self.default_action = null
    self.buttons = []
    self.addButtons(...buttons)
  }

  get constraints () {
    return {
      title: {presence: true, length: {minimum: 1, maximum: MAX_ELEMENT_TITLE_CHARS}},
      subtitle: {length: {maximum: MAX_ELEMENT_TITLE_CHARS}},
      buttons: {
        length: {minimum: 0, maximum: MAX_BUTTONS, message: `is limited to maximum of ${MAX_BUTTONS} allowed`},
        nestedButtonValidator: [PostbackButton, UrlButton, CallToAction]
      },
      image_url: {
        presence: true,
        // todo: make this configureable for prod
        url: {schemes: ['https', 'http'], message: 'is not a valid url.'}
      }
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

  addDefaultAction ({url, fallbackUrl, webview_height_ratio, messenger_extensions}) {
    this.default_action = new DefaultAction({url, fallbackUrl, webview_height_ratio, messenger_extensions})
  }

  addButtons (...buttons) {
    if (this.buttons.length >= MAX_BUTTONS) {
      this.buttons = this.buttons.slice(0, MAX_BUTTONS)
    }
    this.buttons = Array.from(buttons.slice(0, MAX_BUTTONS))

    // this.buttons.push(buttons)
    return this
  }

  toObject () {
    let copy = Object.assign({}, this)
    // delete copy.url
    // delete copy.fallback_url
    // delete copy.image_url
    return copy
  }
}

class CallToAction extends IValidator {
  constructor ({title, type = 'postback'}) {
    super()
    let self = this
    self.title = title
    self.type = type
    self.payload = {}
  }

  get constraints () {
    return {
      type: {presence: true},
      title: {presence: true, length: {minimum: 1, maximum: MAX_ELEMENT_TITLE_CHARS}},
      payload: {presence: true}
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
}

const MAX_ELEMENTS = 10
const MAX_BUTTONS = 3
const MAX_ELEMENT_TITLE_CHARS = 80
const MAX_BUTTON_TITLE_CHARS = 20

module.exports = {
  ButtonTypes,
  Button,
  UrlButton,
  PostbackButton,
  ShareButton,
  CallButton,
  BuyButton,
  LoginButton,
  LogoutButton,
  Element,
  DefaultAction,
  CallToAction
}
