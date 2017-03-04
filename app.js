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

app.use(PATH + '/', (req, res, next) => {

  if (!req.query.limit || isNaN(req.query.limit) || parseInt(req.query.limit) <= 0) {
    res.status(404).json(errorResponse('BAD REQUEST', 'Every call must contain limit=n query parameter and n must be a positive int greater then 0 and less then 1000'))
    return
  }
  next()
}, api)

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  // let err = new Error('Not Found')
  // err.status = 404
  // next(err)
  res.redirect(PATH)
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
