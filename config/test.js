'use strict'
// Development specific configuration
// ==================================
module.exports = {
  // MongoDB connection options
  db: {
    mongoDbUri: process.env.MONGODB_URI
  },
  api: {
    basePATH: 'api',
    version: 'v1'
  },
  fb: {
    clientId: process.env.FB_CLIENTID,
    clientSecret: process.env.FB_CLIENTSECRET,
    app_id: '1526199594071889'

  }
}

