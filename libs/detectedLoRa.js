'use strict'

const superagent = require('superagent')
const randomString = require('./randomString').randomString
const moment = require('moment')
const Event = require('../models/event.js')

async function detectedLoRa (serverUrl, client, io, payload, detections, value) {
  detections[value] = 0

  // Send ack to client.
  client.send(payload.dev_id, [value.substring(value.length - 2)])
  console.log('Sent ack to node.')

  // Send request to stream server.
  const detectID = randomString()
  superagent
    .get(`${serverUrl}/img/save?id=${detectID}`)
    .end(async (err, res) => {
      // Calling the end function will send the request
      if (err) {
        console.log(err)
      }

      // TODO: Save detection to DB with time, img-link etc.
      const imgUrl = `${serverUrl}/img?id=${detectID}`
      const detectTime = moment().calendar()
      const deviceID = payload.payload_fields.device

      io.emit('notification', { deviceID: deviceID, message: 'Motion detected', imgUrl: imgUrl, time: detectTime })

      try {
        const event = new Event({
          title: 'motion detected',
          deviceID,
          imgUrl
        })
        await event.save()
      } catch (error) {
        console.log(error)
      }
    })
}

module.exports = { detectedLoRa }
