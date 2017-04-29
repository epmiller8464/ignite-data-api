'use strict'

const ComponentType = require('./component').ComponentTypes

class GenericPayload {
  constructor ({type = ComponentType.GENERIC, text}) {
    let self = this
    self.template_type = type
    self.text = text
    self.buttons = []
    self.elements = []
  }

  // override this to form and validate objects before sending
  toObject () {
    return Object.assign(Object.create({}), this)
  }
}

class ButtonPayload extends GenericPayload {
  constructor ({type = ComponentType.BUTTON, text}) {
    super({type, text})
    let self = this
  }
}
class ElementPayload extends GenericPayload {
  constructor ({type = ComponentType.ELEMENT, title, subtitle, image_url, fallback_url}) {
    super()
    let self = this
    self.title = title
    self.image_url = image_url
    self.subtitle = subtitle
    self.default_action = {
      type: 'web_url',
      url: '',
      messenger_extensions: true,
      webview_height_ratio: 'tall',
      fallback_url: fallback_url
    }
  }
}

class ListPayload extends GenericPayload {
  constructor ({type = ComponentType.LIST, text, image_url, subtitle, default_action, top_element_style = 'compact'}) {
    super({type, text})
    let self = this
    self.image_url = image_url
    self.subtitle = subtitle
    self.default_action = default_action
    self.top_element_style = top_element_style
  }

  toObject () {
    let target = Object.assign({}, this)

    if (target.image_url) {
      target.top_element_style = 'large'
    }
    return target
  }
}
//
const Payloads = {
  Button: ButtonPayload,
  Element: ElementPayload,
  List: ListPayload,
  Generic: GenericPayload
}

module.exports = Payloads
