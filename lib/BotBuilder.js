'use strict'

const qs = require('querystring')
const EventEmitter = require('events').EventEmitter
const config = require('../config')
const FB = require('./fb').FB
const Mock = require('./fb').Mock

let faker = require('faker')
let chance = require('chance')
let User = require('@ghostmacmiller/ignite-mongoose').Models.UserModel
let Bot = require('@ghostmacmiller/ignite-mongoose').Models.BotModel
let Block = require('@ghostmacmiller/ignite-mongoose').Models.BlockModel
let Group = require('@ghostmacmiller/ignite-mongoose').Models.GroupModel
let ComponentTypes = require('./component').ComponentTypes
let Component = require('./component').Component
let GetStarted = require('./component').GetStarted
let Greeting = require('./component').Greeting
let CallToAction = require('./component').CallToAction
let PersistentMenu = require('./component').PersistentMenu

const CardTypes = {
  GALLERY: 'gallery',
  AI: 'ai',
  FILE: 'file',
  AUDIO: 'audio',
  VIDEO: 'video',
  GO_TO: 'go_to',
  TEXT: 'text',
  json: 'json'
}

class CardSchema {
  constructor ({pluginId, isValid, config, localization}) {
    // "id": "58927d59e4b099e9389e51f5",
    // "plugin_id": "ai",
    // name of plugin i.e. text, gallery, ai,json_plugin, go_to_plugin, etc
    this.type = pluginId || null
    this.is_valid = isValid || null
    // is determined by the plugin_id which each have a unique config type: Object
    this.config = config || null
    this.localization = localization || null
  }
}
//
class BotSchema {
  constructor ({title, timezoneOffset, timezoneName, defaultBlock, firstBlock, helpBlock, aiBlock, blocks, description, status, admins, groups}) {
    this.title = title || null
    this.timezone_offset = timezoneOffset || null
    this.timezone_name = timezoneName || null
    this.default_block = defaultBlock || null
    this.first_block = firstBlock || null
    this.help_block = helpBlock || null
    this.ai_block = aiBlock || null
    this.blocks = blocks || null
    this.description = description || null
    this.status = status || null
    this.admins = admins || null
    this.default_group = null
    this.groups = groups || null
  }
}

class BlockSchema {
  constructor ({title, botId, groupId, builtin, cards, referralActive, isValid}) {
    this.title = title || null
    this.bot_id = botId || null
    this.group_id = groupId || null
    this.builtin = builtin || null
    this.cards = cards || []
    this.referral_active = referralActive || null
    this.is_valid = isValid || null
  }
}
// let PageInfo = new mongoose.Schema({
//   id: {type: String, required: true},
//   title: {type: String, required: true},
//   picture: {type: String},
//   owner: {type: mongoose.Schema.Types.ObjectId, ref: 'user', required: false},
//   bot_id: {type: String}
// }, {_id: false, id: false})
//

class PageInfo {
  constructor ({id, title, picture, owner}) {
    this.id = id
    this.title = title
    this.picture = picture
    this.owner = owner
  }
}

class Status {
  constructor ({readOnly = false, status = 'draft', paymentStatus = 'not_connected'}) {
    this.read_only = readOnly
    this.status = status
    this.page = null
    this.page_info = null
    this.payments_status = paymentStatus
  }

  setPage (pageId) {
    this.page = pageId
  }

  setPageInfo (info) {
    this.page_info = new PageInfo(info)
  }
}

class BotBuilder {
  constructor ({title, description, timezoneOffset = 0, timezoneName, admin}) {
    let self = this
    self.get_started_block = null
    self.greeting_block = {greetings: []}
    self.persistent_menu_block = null
    self.default_block = null
    self.starting_block = null
    self._admin = admin || null
    self._status = null
    self._bot = null
    self._botConfig = {
      title: title,
      description: description,
      timezone_offset: timezoneOffset,
      timezone_name: timezoneName

    }
  }

  setThreadSettingsBlock () {

  }

  // 10202498887709748?fields=id,name,accounts
  findAdmin (condition, next) {
    User.findOne(condition, (error, user) => {
      if (error && !user) {
        return next(error)
      }

      if (user) {
        return next(user.toObject())
      } else {
        return next(null)
      }
    })
  }

  setAdmin (admin) {
    this._admin = admin
    return this
  }

  setStatus () {
    let self = this
    self._status = new Status({read_only: false, page: '', page_info: {}, payments_status: false})
    return this
  }

  buildGetStartedBlock ({block_id}) {
    let gsb = new GetStarted()
    this.setGetStartedBlock(gsb)
  }

  setGetStartedBlock (block) {
    this.get_started_block = block
  }

  buildGreetingBlock () {
    let personalizedGreeting = new Greeting({
      text: 'Hi {{user_first_name}}, welcome to this bot. Powered by IgniteAI',
      locale: 'en_US'
    })
    this.setGreetingBlock([personalizedGreeting])
  }

  setGreetingBlock ([...greetings]) {
    this.greeting_block.greetings = greetings
  }

  buildPersistentMenuBlock ([...menuItems]) {
    let menu = {
      'persistent_menu': [
        {
          'locale': 'default',
          'composer_input_disabled': false,
          'call_to_actions': [
            {
              'title': 'Bot Menu',
              'type': 'nested',
              'call_to_actions': [
                {
                  'title': 'About',
                  'type': 'postback',
                  'payload': 'about_block'
                },
                {
                  'title': 'Help',
                  'type': 'postback',
                  'payload': 'help_block'
                },
                {
                  'title': 'Contact Info',
                  'type': 'postback',
                  'payload': 'contact_block'
                }
              ]
            },
            {
              'type': 'web_url',
              'title': 'Latest News',
              'url': 'http://petershats.parseapp.com/hat-news',
              'webview_height_ratio': 'full'
            }
          ]
        },
        {
          'locale': 'zh_CN',
          'composer_input_disabled': false
        }
      ]
    }
    callMessengerProfileAPI(menu, cb)
  }

  buildDefaultBlock () {
    let messageData = {
      recipient: {
        id: recipientId
      },
      message: {
        attachment: {
          type: 'template',
          payload: {
            template_type: 'generic',
            elements: [{
              title: 'Ignite AI',
              subtitle: 'Facebook Marketing A.I. for E-commerce Brands, Made Easy.',
              item_url: process.env.IGNITE_AI_URI,
              image_url: process.env.IGNITE_AI_URI + 'images/logo-black.png',
              buttons: [{
                type: 'web_url',
                url: process.env.IGNITE_AI_URI,
                title: 'Open Web URL'
              }, {
                type: 'postback',
                title: 'Call Postback',
                payload: 'Payload for first bubble'
              }]
            }, {
              title: 'Ignite AI - Fact of the day',
              subtitle: 'Grass is green!',
              item_url: process.env.IGNITE_AI_URI,
              image_url: process.env.IGNITE_AI_URI + 'images/logo-black.png',
              buttons: [{
                type: 'web_url',
                url: process.env.IGNITE_AI_URI + '/ignite/',
                title: 'Open Web URL'
              }, {
                type: 'postback',
                title: 'Call Postback',
                payload: 'Payload for second bubble'
              }]
            }, {
              title: 'Ignite AI - Joke of the day',
              subtitle: 'some joke',
              item_url: process.env.IGNITE_AI_URI,
              image_url: process.env.IGNITE_AI_URI + 'images/logo-black.png',
              buttons: [{
                type: 'web_url',
                url: process.env.IGNITE_AI_URI + '/ignite/',
                title: 'Open Web URL'
              }, {
                type: 'postback',
                title: 'Call Postback',
                payload: 'Payload for second bubble'
              }]
            }]
          }
        }
      }
    }

    callSendAPI(messageData)
  }

  buildBot () {
    let self = this
    this._bot = new Bot({
      title: title,
      timezone_offset: timezone_offset,
      description: description,
      status: null,
      admins: [],
      groups: []
    })
  }

  sendTextMessage (recipientID, messageText) {
    let messageData = {
      recipient: {
        id: recipientID
      },
      message: {
        text: messageText
      }
    }
    callSendAPI(messageData)
  }

  callMessengerProfileAPI (messageData, cb) {
    request({
      uri: 'https://graph.facebook.com/v2.6/me/messenger_profile',
      qs: {access_token: process.env.PAGE_ACCESS_TOKEN},
      method: 'POST',
      json: messageData
    }, (error, response, body) => {
      console.log('callMessengerProfileAPI:error, %s', error)
      console.log('callMessengerProfileAPI:response, %s', response)
      console.log('callMessengerProfileAPI:body, %s', body)
      if (!error && response.statusCode === 200) {
        return cb({success: true})
        console.log('Successfully sent persistent menu and/or get stared')
      } else {
        return cb({success: false})
        console.error('Error setting a menu or greeting')
        console.error(response)
        console.error(error)
      }
    })
  }

  callSendAPI (messageData) {
    request({
      uri: 'https://graph.facebook.com/v2.6/me/messages',
      qs: {access_token: process.env.PAGE_ACCESS_TOKEN},
      method: 'POST',
      json: messageData
    }, (error, response, body) => {
      if (!error && response.statusCode === 200) {
        let recipientId = body.recipient_id
        let messageId = body.message_id
        console.log('Successfully sent generic message with id %s to recipient %s', messageId, recipientId)
      } else {
        console.error('Unable to send message.')
        console.error(response)
        console.error(error)
      }
    })
  }
}

class ValidationResult {
  constructor (validationMap) {
    this.isValid = false
    this.errors = new Map()
  }

  addError (field, message) {
    this.errors.set(field, message)
  }

  errorsToString () {
    this.errors.map
  }
}

const ValidateEntryBlock = (block) => {

}

class BotValidator {
  constructor () {
    this.required_settings = [
      'name',
      'description',
      'entry_block',
      'greeting_block',
      'persistent_menu',
      'default_block_group',
      'help_block',
      'timezone_offset'
    ]
  }
}

class Plugin {
  constructor (plugin_id) {
    let self = this
    self.type = plugin_id
    self.payload = {}
  }
}
class GreetingBlock extends Plugin {
  constructor (text, locale = 'en-US', personalize = false) {
    super('greeting')
    this.text = text || 'Hello'
    this.locale = locale
    this.personalize = personalize
  }
}

let menu = {
  persistent_menu: [
    {
      locale: 'en-US',
      composer_input_disabled: false,
      call_to_actions: [
        {
          title: 'Bot Menu',
          type: 'nested',
          call_to_actions: [
            {
              title: 'About',
              type: 'postback',
              payload: 'about_block'
            },
            {
              title: 'Help',
              type: 'postback',
              payload: 'help_block'
            },
            {
              title: 'Contact Info',
              type: 'postback',
              payload: 'contact_block'
            }
          ]
        },
        {
          type: 'web_url',
          title: 'Latest News',
          url: '',
          webview_height_ratio: 'full'
        }
      ]
    }
  ]
}

module.exports = BotBuilder
