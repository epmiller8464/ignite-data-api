'use strict'
let express = require('express')
let cookieParser = require('cookie-parser')
let bodyParser = require('body-parser')
let errorResponse = require('./halSupport').ErrorResponse
let util = require('util')
let config = require('./config')
let api = require('./routes/')
let PATH = util.format('/%s/%s', config.api.basePATH, config.api.version)

let app = express()
app.disable('x-powered-by')

// uncomment after placing your favicon in /public
let pino = require('pino')()
app.use(require('express-pino-logger')({logger: pino}))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))
app.use(cookieParser())
app.set('trust proxy', 1)

app.use(PATH + '/', api)

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  let err = new Error('Not Found')
  err.status = 404
  next(err)
})

if (app.get('env') === 'development') {
  app.use(function (err, req, res, next) {
    res.status(err.status || 500).json(errorResponse('error', err.message))
  })
} else {
  app.use(function (err, req, res, next) {
    res.status(err.status || 500).json(errorResponse('error', err.message))
  })
}

module.exports = app
