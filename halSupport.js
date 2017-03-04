'use strict'
let util = require('util')
let hal = require('hal')

function formatErrorResponse (err, message) {
  return {
    type: 'error',
    error: err,
    message: message || ''
  }
}

function formatResponse (req, data) {
  let selfUrl = req.originalUrl
  let result, next
  if (util.isArray(data)) {
    for (let i = 0; i < data.length; i++) {
      let resource = data[i]
      data[i] = new hal.Resource(resource, req.baseUrl + '/' + resource._id)
    }
    next = nextResponse(req, data)
    result = new hal.Resource({data: data}, selfUrl)
  } else {
    result = new hal.Resource({data: [data]}, selfUrl)
  }
  if (next) {
    result.link(next)
  }
  return result
}

function nextResponse (req, data) {
  let offset = req.params.offset ? parseInt(req.params.offset) : 0
  let limit = req.params.limit ? parseInt(req.params.limit) : 10
  let _limit = util.format('?limit=%s', limit)
  let _offset = util.format('&offset=%s', offset += data.length)
  let _query = util.format('%s%s', _limit, _offset)
  let _nextUrl = util.format('%s%s', req.path, _query)
  let next = new hal.Link('next', {href: _nextUrl})
  return next
}

module.exports = {
  ErrorResponse: formatErrorResponse,
  Response: formatResponse,
  NextResponse: nextResponse
}
