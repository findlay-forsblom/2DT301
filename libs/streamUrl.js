
'use strict'
/**
 * Gets the stream id from streaming server, parses and returns a valid stream id.
 *
 * @author Lars Petter Ulvatne, lu222bg, Linnaeus University.
 */
const superagent = require('superagent')

async function streamUrl (serverUrl, socket) {
  const streamUrl = (await superagent.get(`${serverUrl}/setstream?id=${socket.id}`)).body.auth
  const idx = parseInt(streamUrl.charAt(0))
  return streamUrl.substring(idx)
}

module.exports = { streamUrl }
