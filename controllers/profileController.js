'use strict'

/**
 * Controller handling the profile page of authenticated users. Renders profile
 * page and starts socket for real time communication of events sent over The
 * Things Network from IoT-device and sets up video stream/images from camera
 * served on Raspberry Pi module.
 *
 * @author Findlay Forsblom, ff222ey, Linnaeus University.
 * @author Lars Petter Ulvatne, lu222bg, Linnaeus University.
 */

const superagent = require('superagent')
const detectedLora = require('../libs/detectedLoRa').detectedLoRa
const streamUrl = require('../libs/streamUrl').streamUrl
const Event = require('../models/event.js')
const ttn = require('ttn')
const io = require('../app.js').io
const moment = require('moment')
const profileController = {}
const err = {}
const detections = {}

// Url to video stream server.
const STREAM_SERVER = process.env.streamUrl

/**
 * Middleware used to ensure that a user is authenticated before allowing them
 * access to resources which needs authentication.
 * @param {HTTP request object} req The request made by client.
 * @param {HTTP response object} res The response to send to client.
 * @param {Callback function} next Callback for next middleware.
 */
profileController.ensureAuthenticated = async (req, res, next) => {
  if (req.session.userId) {
    next()
  } else {
    err.status = 403
    next(err)
  }
}

/**
 * Render profile view.
 * @param {HTTP request object} req The request made by client.
 * @param {HTTP response object} res The response to send to client.
 * @param {Callback function} next Callback for next middleware.
 */
profileController.profile = async (req, res, next) => {
  // Set up socket connection to client.
  const events = await Event.find()
  events.forEach((event, index) => {
    event = event.toObject()
    const time = event.time
    event.time = moment(time).format('MMMM Do YYYY, h:mm a ')
    events[index] = event
  })
  res.render('profile/profile', { events })
}

/**
 * Removes all past events.
 * @param {HTTP request object} req The request made by client.
 * @param {HTTP response object} res The response to send to client.
 * @param {Callback function} next Callback for next middleware.
 */
profileController.delete = async (req, res, next) => {
  try {
    await Event.deleteMany()
    req.session.flash = { type: 'success', text: 'Succesfully cleared all recent events' }
    res.redirect(`/profile/${req.session.username}`)
  } catch (error) {
    console.log(error)
    req.session.flash = { type: 'danger', text: 'An error occured pls try again later' }
    res.redirect('/')
  }
}

// Setup socket connection to accessed profile page, which handles TTN requests real time.
io.on('connection', async (socket) => {
  console.log('Socket online')

  // Create a valid streaming id for video stream and emit to client.
  const streamId = await streamUrl(STREAM_SERVER, socket)
  io.emit('streamurl', { id: streamId, src: STREAM_SERVER })

  // Listen for changes on application from TTN.
  ttn.data(process.env.appID, process.env.accessKey)
    .then((client) => {
      client.on('uplink', async (devID, payload) => {
        console.log('Received uplink from ', devID)
        const value = payload.payload_fields.value

        if (value.includes('ack')) {
          // If ack was received => Extract message and delete from object.
          const ack = value.substring(3)
          delete detections[ack]
        } else if (detections[value] === undefined) {
          // Notify video server and client through detectedLoRa function
          detectedLora(STREAM_SERVER, client, io, payload, detections, value)
        } else if (detections[value]) {
          // Add counts of detections. If 5 counts found send another ack.
          detections[value] = detections[value]++
          if (detections[value] > 4) {
            client.send(payload.dev_id, [value.substring(value.length - 2)])
            console.log('Sent new ack to node.')
          }
        }
      })
    })
    .catch((err) => {
      console.log(err)
    })

  socket.on('disconnect', async (data) => {
    console.log(data, 'Socket disconnected')

    // End stream id session.
    await superagent.get(`${STREAM_SERVER}/endstream?id=${streamId}`)
  })
})

module.exports = profileController
