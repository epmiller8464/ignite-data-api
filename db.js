'use strict'
let dbConfig = require('./config').db
let mongoose = require('mongoose')
mongoose.Promise = require('bluebird')
let connect = require('@ghostmacmiller/ignite-mongoose').Connect
// let UserModel = require('@ghostmacmiller/ignite-mongoose').Models.UserModel

let dbOptions = {
  db: {native_parser: true},
  server: {poolSize: 5, socketOptions: {keepAlive: 1}},
  promiseLibrary: require('bluebird')
}

let db = connect(dbConfig.mongoDbUri, dbOptions)
db.on('open', console.info.bind(console, 'connection open'))
db.on('error', console.error.bind(console, 'connection error'))

db.once('open', (callback) => {
  console.log('open')
})

module.exports = db
