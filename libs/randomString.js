/**
 * Uses crypto to create a random string.
 *
 * @author Lars Petter Ulvatne, lu222bg, Linnaeus University.
 */

const crypto = require('crypto')

function randomString (length = 20) {
  return crypto.randomBytes(length).toString('hex')
}

module.exports = { randomString }
