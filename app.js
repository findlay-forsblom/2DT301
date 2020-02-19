'use strict'

const express = require('express')
const hbs = require('express-hbs')
const path = require('path')
// const ttn = require('ttn')
// const keys = require('keys')
const dotenv = require('dotenv')
const mongoose = require('./config/mongoose.js')
const session = require('express-session')
const redis = require('redis')
const redisClient = redis.createClient()
const RedisStore = require('connect-redis')(session)

dotenv.config({
  path: './.env'
})

const sessionStore = new RedisStore({ host: 'localhost', port: 6379, client: redisClient, ttl: 86400 })

const sessionOptions = {
  name: process.env.SESSION_NAME,
  secret: process.env.SESSION_SECRET,
  resave: false, // Resave even if a request is not changing the session.
  saveUninitialized: false, // Don't save a created but not modified session.
  cookie: {
    maxAge: 1000 * 60 * 60, // % 1 hour
    sameSite: 'lax', // change to lax maybe
    HttpOnly: true
  },
  store: sessionStore
}

mongoose.connect().catch(error => {
  console.log(error)
  process.exit(1)
})

const port = 3000

const app = express()

app.use(session(sessionOptions))

app.use(express.static(path.join(__dirname, 'public')))

app.use((req, res, next) => {
  // flash messages - survives only a round trip
  if (req.session.flash) {
    res.locals.flash = req.session.flash
    delete req.session.flash
  }
  if (req.session.userId) {
    const lol = {}
    const navbar = {}
    navbar.username = req.session.username
    lol.id = req.session.userId
    res.locals.loggedIn = lol
    res.locals.navBar = navbar
  }

  next()
})

app.engine('hbs', hbs.express4({
  defaultLayout: path.join(__dirname, 'views', 'layouts', 'default'),
  partialsDir: path.join(__dirname, 'views', 'partials')
}))
app.set('view engine', 'hbs')

app.use(express.urlencoded({ extended: false }))

app.use('/', require('./routes/homeRouter.js'))

app.use((req, res, next) => {
  const err = {}
  err.status = 404
  next(err)
})

app.use((err, req, res, next) => {
  if (err.status === 404) {
    res.status(404)
    return res.sendFile(path.join(__dirname, 'public', 'assets', 'html', '404.html'))
  } else if (err.status === 403) {
    res.status(403)
    return res.sendFile(path.join(__dirname, 'public', 'assets', 'html', '403.html'))
  }
  res.status(err.status || 500)
  res.sendFile(path.join(__dirname, 'public', 'assets', 'html', '500.html'))
})

// ttn.data(process.env.appID, process.env.accessKey)
//   .then((client) => {
//     client.on('uplink', (devID, payload) => {
//       console.log('Received uplink from ', devID)
//       console.log(payload)
//     })
//   })
//   .catch((err) => {
//     console.log(err)
//   })

app.listen(port, () => console.log('Server running at http://localhost:' + port))
