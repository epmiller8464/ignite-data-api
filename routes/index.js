'use strict'
let express = require('express')
let router = express.Router()
// let _ = require('lodash')

router.get('/', function (req, res, next) {
  res.status(200).json({
    users: '/users',
    bots: '/bots',
    tokens: '/tokens',
    blocks: '/blocks'
  })
})

router.get('/users', function (req, res, next) {
  try {
    res.status(200).json({data: ['tim', 'tom']})
  } catch (e) {
    return res.status(500).json({error: true, type: 'ServerError', message: e.toString()})
  }
})
router.get('/bots', function (req, res, next) {
  try {
    res.status(200).json({data: ['bot 2', 'bot 1']})
  } catch (e) {
    return res.status(500).json({error: true, type: 'ServerError', message: e.toString()})
  }
})
router.get('/tokens', function (req, res, next) {
  try {
    res.status(200).json({data: ['bot 2', 'bot 1']})
  } catch (e) {
    return res.status(500).json({error: true, type: 'ServerError', message: e.toString()})
  }
})
router.get('/block', function (req, res, next) {
  try {
    res.status(200).json({data: ['block', 'block2']})
  } catch (e) {
    return res.status(500).json({error: true, type: 'ServerError', message: e.toString()})
  }
})

module.exports = router

