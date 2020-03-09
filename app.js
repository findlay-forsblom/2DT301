'use strict'

/**
 * Express server application program, which serves an application which fetches
 * information from connected IoT-devices and sets up video stream from video streaming
 * server from a Raspberry Pi. Security has been implemented from different modules and
 * code implementations.
 *
 * For the project in the course 2DT301, this server runs behind a
 * Reversed Proxy which only handles HTTPS request.
 *
 * @author Findlay Forsblom, ff222ey, Linnaeus University.
 * @author Lars Petter Ulvatne, lu222bg, Linnaeus University.
 */

const express = require('express')
const hbs = require('express-hbs')
const path = require('path')
const dotenv = require('dotenv')
const mongoose = require('./config/mongoose.js')
const session = require('express-session')
const redis = require('redis')
const redisClient = redis.createClient()
const RedisStore = require('connect-redis')(session)
const helmet = require('helmet')

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
    maxAge: 1000 * 60 * 60, // % 1 hours
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
const server = require('http').Server(app)
const io = require('socket.io')(server, { pingInterval: 2000, pingTimeout: 5000 })

// CSRF protection for form POST requests.
const csrf = require('csurf')
const csrfProtection = csrf({ cookie: true })

const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
app.use(bodyParser.json())
app.use(cookieParser())

module.exports = { io, csrfProtection, bodyParser }

// Helmet security functions.
app.use(helmet())

// Set the CSP header to trusted sources.
app.use(helmet.contentSecurityPolicy({
  directives: {
    defaultSrc: ["'self'", 'https://*.cscloud626.lnu.se/'],
    styleSrc: ["'self'", 'https://stackpath.bootstrapcdn.com/', 'https://fonts.googleapis.com/'],
    scriptSrc: ["'self'", 'https://code.jquery.com/', 'https://cscloud626.lnu.se/', 'https://cdn.jsdelivr.net/', 'https://stackpath.bootstrapcdn.com/'],
    imgSrc: ["'self'", 'https://linnaeus.asuscomm.com:8081/', 'https://getbootstrap.com/'],
    connectSrc: ["'self'"],
    fontSrc: ['https://fonts.gstatic.com/', "'self'"]
  }
}))

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

app.use('/', require('./routes/authRouter.js'))
app.use('/profile', require('./routes/profileRouter.js'))

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

server.listen(port, () => { console.log(`Server running at http://localhost:${port}`) })
