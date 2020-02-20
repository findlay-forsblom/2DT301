const crypto = require('crypto')

function randomString (length = 20) {
  return crypto.randomBytes(length).toString('hex')
}

module.exports = { randomString }
