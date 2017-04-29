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

describe('fb - mock user', function () {
  let adminId = ''
  before(function () {
    // runs before all tests in this block
  })

  it('load mock admin', (done) => {
    let getUser = Mock.getMockUser()
    getUser.then((user) => {
      should.notEqual(user, null)
      done()
    }).catch((error) => {
      should(error).equal(null)
      done()
    })
  })
})