'use strict'
const request = require('request')
const UserModel = require('@ghostmacmiller/ignite-mongoose').Models.UserModel
const nextTick = require('async/nextTick')
const config = require('../config')
const mock = require('../config').useMock
const fs = require('fs')
const getMe = (req, res, next) => {
  let accessToken = req.user.accessToken
  let url = 'https://graph.facebook.com/v2.8/me?fields=id,name,email,accounts,picture&access_token=' + accessToken
  request(url, {method: 'GET'}, (error, response, body) => {
    if (!error && response.statusCode === 200) {
      console.log(body) // Show the HTML for the Google homepage.
      let data = JSON.parse(body)
      // updateMe(data)
      return next(data)
    } else {
      return next(null, error)
    }
  })
}

const getUser = (userId, accessToken) => {
  return new Promise(function (resolve, reject) {
    let apiVersion = config.fb.graph_api_version
    let url = `https://graph.facebook.com/${apiVersion}/${userId}?fields=id,name,email,accounts,picture&access_token=${accessToken}`
    request(url, {method: 'GET'}, (error, response, body) => {
      if (!error && response.statusCode === 200) {
        console.log(body) // Show the HTML for the Google homepage.
        let data = JSON.parse(body)
        // updateMe(data)
        return resolve(data)
      } else {
        return resolve(null, error)
      }
    })
  })
}

const getMockUser = () => {
  return new Promise(function (resolve, reject) {
    fs.readFile('fb-admin.json', 'utf8', (error, data) => {
      // error = new Error()
      if (!error) {
        let user = JSON.parse(data)
        // updateMe(data)
        resolve(user)
      } else {
        reject(error)
      }
    })
  })
}

const updateMe = (req, updates) => {
  // nextTick(() => {
  return new Promise((resolve, reject) => {
    if (updates.email && (!req.user.email || req.user.email !== updates.email)) {
      let _updates = {
        email: updates.email,
        name: updates.name
      }
      UserModel.findOneAndUpdate({provider_id: updates.id}, {$set: _updates}, {new: true}, (err, _user) => {
        if (err) {
          console.error(err)
          return reject(err)
        }
        let u = _user.toObject()
        return resolve(u)
      })
    } else {
      return resolve(true)
    }
  })
}

const getRefreshToken = (req, done) => {

  let accessToken = req.user.accessToken
  let cid = config.fb.clientId
  let cs = config.fb.clientSecret

  let url = `https://graph.facebook.com/v2.8/oauth/access_token?grant_type=fb_exchange_token&client_id=${cid}&client_secret=${cs}&fb_exchange_token=${accessToken}`
  request(url, {method: 'GET'}, (error, response, body) => {

    if (!error && response.statusCode === 200) {
      console.log(body) // Show the HTML for the Google homepage.
      let data = JSON.parse(body)
      // updateMe(data)
      let updates = {refreshToken: data.access_token}

      UserModel.findOneAndUpdate({_id: req.user._id}, {$set: updates}, {new: true}, (e, updatedUser) => {

        if (e) {
          return done(e)
        }
        req.user = updatedUser.toObject()
        return done(null, req.user)
      })
    } else {
      return done(error)
    }
  })
}

const validateToken = (req, res, next) => {

  if (!req.user.refreshToken) {
    getRefreshToken(req, (error, user) => {
      if (error) {
        return next(error)
      } else {
        return next()
      }
    })
  } else {
    let refreshToken = req.user.refreshToken
    let url = 'https://graph.facebook.com/v2.8/debug_token?input_token=' + refreshToken + '&access_token=' + req.user.accessToken
    request(url, {method: 'GET'}, (error, response, body) => {
      if (!error && response.statusCode === 200) {
        console.log(body) // Show the HTML for the Google homepage.
        let data = JSON.parse(body)

        if (data.data.is_valid) {
          return next()
        } else {
          return res.redirect('/auth/facebook/')
        }
      } else {
        return next(error)
      }
    })
  }
}

module.exports.Mock = {
  getMockUser: getMockUser
}

module.exports.FB = {
  getMe: getMe,
  getUser: getUser,
  updateMe: updateMe,
  getRefreshToken: getRefreshToken,
  validateToken: validateToken,
}
