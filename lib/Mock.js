'use strict'
let BotModel = require('@ghostmacmiller/ignite-mongoose').Models.BotModel
let BlockModel = require('@ghostmacmiller/ignite-mongoose').Models.BlockModel
let GroupModel = require('@ghostmacmiller/ignite-mongoose').Models.GroupModel
const ComponentTypes = require('./component').ComponentTypes
const PersistentMenu = require('./component').PersistentMenu
const GetStarted = require('./component').GetStarted
const GreetingBlock = require('./component').Greeting
// const MenuItem = require('./lib/buttons').MenuItem
const faker = require('faker')
const chance = require('chance').Chance()

class PageInfo {
  constructor () {
    let self = this
    self.page_id = null
    self.title = null
    self.picture = null
    self.owner = null
    self.bot_id = null
  }
}
class Status {
  constructor () {
    let self = this
    self.read_only = false
    self.status = 'draft'
    self.page = null
    self.page_info = new PageInfo()
    self.payments_status = 'not_connected'
  }
}

class Block {
  constructor ({title, bot_id, group_id, builtin = true, referral = false, is_valid = false}) {
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
  constructor ({title = 'Default Group', botId, builtin = true}) {
    let self = this
    self.title = title
    self.bot_id = botId
    self.blocks = []
    self.builtin = builtin
  }
}

class Bot {
  constructor () {
    let self = this

    let tz = chance.timezone()
    self.title = `${faker.hacker.verb()} Bot`
    self.date_added = Date.now()
    self.timezone_offset = tz.offset
    self.timezone_name = tz.name
    self.default_block = null
    self.starting_block = null
    self.help_block = null
    self.menu_block = MenuHelper.createPersistentMenu()
    self.ai_block = null
    self.blocks = []
    self.settings = []
    self.description = faker.lorem.paragraph()
    self.status = new Status()
    self.admins = []
    self.default_group = new Group()
    self.groups = []
    self.is_valid = false
  }

  addBlock (block) {
    this.blocks.push(block)
    return this
  }

  addDefaultGroupBlock (block) {
    this.default_group.blocks.push(block)
    return this
  }

  toModel () {
    let clone = Object.assign({}, this)
    console.log(clone)
    let model = new BotModel(clone)
    return model
  }
}

const Mock = {
  bot () {
    let mock = new Bot()
    return mock
  },
  blocks: {
    getStartedBlock () {
      return new Block({title: 'Get Started'})
    },
    getGreetingBlock (title) {
      return new Block({title: title})
    },
    getMenuBlock (...menuItems) {
      // let block = new Block({title: title})
      let menu = new Components.PersistentMenu()
      for (var i = 0; i < menuItems.length; i++) {
        let title = faker.hacker.verb()
        let component = new Components.CallToAction({title: title})
        menu.addMenuItem(component)
      }

      return menu
    },
    randomBlock (options) {
      let mock = new Block(options)
      let _block = new BlockModel(mock)

      return _block.toObject()
    }
  },
  component (options) {

  }
}

module.exports = Mock
