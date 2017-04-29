'use strict'
require('dotenv').config()
process.env.NODE_ENV = 'development'
require('mocha')
const assert = require('assert')
const should = require('should')
const faker = require('faker')
const chance = require('chance')
let Bot = require('@ghostmacmiller/ignite-mongoose').Models.BotModel
let Block = require('@ghostmacmiller/ignite-mongoose').Models.BlockModel
let User = require('@ghostmacmiller/ignite-mongoose').Models.UserModel
require('../db')

describe('bot', function () {
  let adminId = ''
  before(function () {
    // runs before all tests in this block
    User.findOne({email: 'epmiller8464@gmail.com'}, (err, _user) => {
      adminId = _user.id
    })
  })

  it('create bot', (done) => {
    let timezone = chance.timezone()
    let GroupSchema = {
      title: 'Default Block',
      blocks: [],
      built_in: true,
      is_default: true
    }

    let PageInfo = {
      // id: {type: String, required: true},
      title: '',
      picture: faker.image.business(),
      owner: adminId,
      bot_id: ''
    }

    let StatusSchema = {
      read_only: false,
      status: 'draft',
      page: '1843107532569349',
      page_info: PageInfo,
      payments_status: ''
    }

    let bot = new Bot({
      title: faker.hacker.adjective(),
      timezone_offset: (timezone.offset * 1000),
      timezone_name: timezone.name,
      // default_group_id: '',
      default_block: null,
      first_block: null,
      help_block: null,
      ai_block: null,
      description: faker.hacker.phrase(),
      status: StatusSchema,
      admins: [adminId],
      groups: [GroupSchema]
    })

    bot.save((err, doc) => {
      should(err).equal(null)
      should.notEqual(doc, null)
      done()
    })
  })
})

function buildDefaultBlock () {
  let CardSchema = {
    // "id": "58927d59e4b099e9389e51f5",
    // "plugin_id": "ai",
    // name of plugin i.e. text, gallery, ai,json_plugin, go_to_plugin, etc
    type: 'generic',
    is_valid: true,
    // is determined by the plugin_id which each have a unique config type: Object
    config: {
      template_type: 'generic',
      elements: [{
        title: 'Ignite AI',
        subtitle: 'Facebook Marketing A.I. for E-commerce Brands, Made Easy.',
        item_url: faker.image.business(),
        image_url: faker.image.business(),
        buttons: [{
          type: 'web_url',
          url: faker.image.business(),
          title: 'View Our Site'
        }, {
          type: 'postback',
          title: 'Call Postback',
          payload: 'Payload for first bubble'
        }]
      }]
    },
    localization: {}
  }

  let block = new Block({
    title: 'Block Title - ' + faker.hacker.verb(),
    // bot_id: {type: mongoose.Schema.Types.ObjectId, ref: 'bot', required: true},
    // parent_group_id: {type: mongoose.Schema.Types.ObjectId, refPath: 'bots.default_group_id', required: false},
    builtin: true,
    cards: [CardSchema],
    referral_active: false,
    is_valid: true

  })
  return block
}