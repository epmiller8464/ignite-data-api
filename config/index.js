'use strict'

let path = require('path')
let _ = require('lodash')
let url = require('url')

// All configurations will extend these options
// ============================================
let all = {
  env: process.env.NODE_ENV,
  // Root path of server
  root: path.normalize(__dirname + '/../../..'),
  host: process.env.NODE_HOST || 'localhost',
  // Server port
  port: parseInt(process.env.PORT) || 3000,
  // callbackURL: process.env.NODE_HOST,
  fb: {
    clientId: process.env.DEV_FB_CLIENTID,
    clientSecret: process.env.DEV_FB_CLIENTSECRET
  },
  cs: 'asdfjsdl'
  // URL:config.host + '/auth/facebook/callback'
}

// Export the config object based on the NODE_ENV
// ==============================================
module.exports = _.merge(all, require('./' + process.env.NODE_ENV + '.js') || {})

