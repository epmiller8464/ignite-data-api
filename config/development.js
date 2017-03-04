'use strict'
// Development specific configuration
// ==================================
module.exports = {
  // MongoDB connection options
  db: {
    mongoDbUri: 'mongodb://localhost/igniteDB'
  },
  api: {
    basePATH: 'api',
    version: 'v1'
  },
  fb: {
    clientId: process.env.DEV_FB_CLIENTID,
    clientSecret: process.env.DEV_FB_CLIENTSECRET
  }
}

