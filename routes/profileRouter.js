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

router.get('/:id', controller.ensureAuthenticated, controller.profile) // route for profile
router.post('/:id/delete', controller.ensureAuthenticated, controller.delete) // Delete past events.

module.exports = router
