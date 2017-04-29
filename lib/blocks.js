'use strict'
let BlockModel = require('@ghostmacmiller/ignite-mongoose').Models.BlockModel
let GroupModel = require('@ghostmacmiller/ignite-mongoose').Models.GroupModel
const {ComponentTypes, Component, GetStarted, Greeting, CallToAction, PersistentMenu, GenericTemplate, ListTemplate, ButtonTemplate, TextComponent, AudioComponent, VideoComponent, ImageComponent, FileComponent} = require('./component')
const {ButtonType, UrlButton, PostbackButton, ShareButton, CallButton, BuyButton, MenuItem, LoginButton, LogoutButton} = require('./buttons')
const faker = require('faker')
const chance = require('chance').Chance()

class Block {
  constructor ({title, bot_id, group_id, builtin, referral = false, is_valid = false}) {
    let self = this
    self.title = title
    self.bot_id = bot_id
    self.group_id = group_id
    self.builtin = builtin
    self.components = []
    self.referral_active = referral
    self.is_valid = is_valid
  }

  addComponent (component) {
    this.components.push(component)
    return this
  }

  validate(){

  }

  toModel () {
    let clone = Object.assign({}, this)
    return clone
  }
}

/*
 title: {type: String, required: true},
 blocks: [{type: mongoose.Schema.Types.ObjectId, ref: 'block', required: true}],
 bot_id: {type: mongoose.Schema.Types.ObjectId, ref: 'bot', required: true},
 built_in: {type: Boolean, required: true, default: false}
 */
class Group {
  constructor ({title = 'BUILT-IN blocks', botId, builtin = true}) {
    let self = this
    self.title = title
    self.bot_id = botId
    self.blocks = []
    self.builtin = builtin
  }
}
const BuiltIn = {
  settings: {
    defaultGetStarted () {
      return new GetStarted()
    },
    defaultGreeting({text = faker.lorem.paragraph(), locale = 'en_US'}){
      return [{
        locale: 'default',
        text: 'Hello {{user_first_name}}, I am bot assisting {{Page}}'
      }, {
        locale: locale,
        text: text
      }]
    },
    defaultMenuItems () {
      let items = []
      let resetButton = new PostbackButton({title: 'Start Over', payload: 'DEFAULT_BLOCK'})
      let aboutButton = new UrlButton({title: 'About'})
      items.push(resetButton)
      items.push(aboutButton)
      return items
    }
  },
  defaultStartingBlock(text){
    let block = new Block({title: 'Default Blocks', builtin: true})
    let component = new ButtonTemplate({text})
    component
    .addButton(new UrlButton({title: 'View Website', url: faker.internet.url(),fallbackUrl: faker.internet.url()}))
    .addButton(new PostbackButton({title: 'View Questionnaires'}))
    .addButton(new UrlButton({
      title: 'View Privacy Policy',
      url: faker.internet.url(),
      fallbackUrl: faker.internet.url()
    }))
    .addButton(new PostbackButton({
      title: 'Live Chat',
      payload:{}
    }))
    // new UrlButton({title: 'View Website', url: faker.internet.url()})
    // component.payload.buttons.push()
  },
  defaultResponseBlock(text){
    let block = new Block({title: 'Default Blocks', builtin: true})
    let component = new ButtonTemplate({text})
    component.payload.buttons.push()
  }
}

// module.exports
