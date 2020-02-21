'use strict'
/**
 * Routes for profile page.
 *
 * @author Findlay Forsblom, ff222ey, Linnaeus University.
 * @author Lars Petter Ulvatne, lu222bg, Linnaeus University.
 */

const controller = require('../controllers/profileController.js')
const express = require('express')

const router = express.Router()

router.get('/', controller.ensureAuthenticated, controller.profile) // route for profile

module.exports = router
