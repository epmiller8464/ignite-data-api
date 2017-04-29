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
const Mock = require('../lib/fb').Mock
const BotBuilder = require('../lib/BotBuilder')

describe('fb - mock user', function () {
  let admin = null
  before(function () {
    Mock.getMockUser()
    .then((user) => {
      admin = user
    })
    .catch((error) => {
      throw error
    })
  })
  it('load mock user', (done) => {
    Mock.getMockUser()
    .then((user) => {
      admin = user
      done()
    })
    .catch((error) => {
      should.notEqual(error, null)
      done()
    })
  })
  it('load mock admin', (done) => {
    let botBuilder = new BotBuilder({
      title: 'My Awesome Bot',
      description: 'Some default description about what the bot does',
      timezone_offset: -6,
      admin: admin
    })
    done()
    // botBuilder.
    // botBuilder.setAdmin(admin)

  })
})