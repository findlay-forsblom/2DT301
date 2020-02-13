'use strict'

const express = require('express')
const hbs = require('express-hbs')
const path = require('path')
const ttn = require('ttn')
const keys = require('keys')

const port = 8000

const app = express()

app.engine('hbs', hbs.express4({
  defaultLayout: path.join(__dirname, 'views', 'layouts', 'default'),
  partialsDir: path.join(__dirname, 'views', 'partials')
}))
app.set('view engine', 'hbs')

app.use('/', require('./routes/homeRouter.js'))
console.log('ll')

app.use((err, req, res, next) => {
  if (err.status === 404) {
    res.status(404)
    return res.sendFile(path.join(__dirname, 'public', '404.html'))
  } else if (err.status === 403) {
    res.status(403)
    return res.sendFile(path.join(__dirname, 'public', '403.html'))
  }
  res.status(err.status || 500)
  res.sendFile(path.join(__dirname, 'public', '500.html'))
})

ttn.data(keys.ttn.appID, keys.ttn.accessKey)
  .then((client) => {
    client.on('uplink', (devID, payload) => {
      console.log('Received uplink from ', devID)
      console.log(payload)
    })
  })
  .catch((err) => {
    console.log(err)
  })

app.listen(port, () => console.log('Server running at http://localhost:' + port))
