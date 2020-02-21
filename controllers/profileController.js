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
const randomString = require('../libs/randomString').randomString
// const ttn = require('ttn')
const io = require('../app.js').io
const moment = require('moment')
const profileController = {}
const err = {}

// Url to video stream server.
// const STREAM_SERVER = 'http://linnaeus.asuscomm.com:8081'
const STREAM_SERVER = 'http://85.228.224.34:8081'

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
  res.render('profile/profile')
}

// Setup socket connection to accessed profile page, which handles TTN requests real time.
io.on('connection', (socket) => {
  console.log('Socket online')
  const detectID = randomString()
  superagent
    .get(`${STREAM_SERVER}/img/save?id=${detectID}`)
    .end((err, res) => {
      // Calling the end function will send the request
      if (err) {
        console.log(err)
      }

      // TODO: Save detection to DB with time, img-link etc.
      const imgUrl = `${STREAM_SERVER}/img?id=${detectID}`
      const detectTime = moment().calendar()
      const deviceID = 'lora-device-1'

      console.log(imgUrl)

      io.emit('notification', { deviceID: deviceID, message: 'Motion detected', imgUrl: imgUrl, time: detectTime })
    })

  // Listen for changes on application from TTN.
  // ttn.data(process.env.appID, process.env.accessKey)
  //   .then((client) => {
  //     client.on('uplink', (devID, payload) => {
  //       console.log('Received uplink from ', devID)
  //       console.log(payload)

  //       const detectID = randomString()
  //       superagent
  //         .get(`${STREAM_SERVER}/img/save?id=${detectID}`)
  //         .end((err, res) => {
  //           // Calling the end function will send the request
  //           if (err) {
  //             console.log(err)
  //           }

  //           // TODO: Save detection to DB with time, img-link etc.
  //           const imgUrl = `${STREAM_SERVER}/img?id=${detectID}`
  //           const detectTime = moment().calendar()
  //           const deviceID = 'lora-device-1'

  //           console.log(imgUrl)

  //           io.emit('notification', { deviceID: deviceID, message: 'Motion detected', imgUrl: imgUrl, time: detectTime })
  //         })

  //       if (payload.payload_fields.message !== 'ack') {
  //         client.send(payload.dev_id, [1])
  //         console.log('Sent ack to node.')
  //       }
  //     })
  //   })
  //   .catch((err) => {
  //     console.log(err)
  //   })

  socket.on('disconnect', (data) => {
    console.log(data, 'Socket disconnected')
  })
})

module.exports = profileController
