'use strict'
/**
 * Routes for authenticating related requests.
 *
 * @author Findlay Forsblom, ff222ey, Linnaeus University.
 * @author Lars Petter Ulvatne, lu222bg, Linnaeus University.
 */

const controller = require('../controllers/authController.js')
const express = require('express')
const app = require('../app.js')

const parseForm = app.bodyParser.urlencoded({ extended: false })

const router = express.Router()

router.get('/', controller.redirectAuthenticated, app.csrfProtection, controller.index) // Login page
router.post('/login', parseForm, app.csrfProtection, controller.loginPost) // Login post handler
router.post('/logout', controller.logout) // Login post handler

module.exports = router
