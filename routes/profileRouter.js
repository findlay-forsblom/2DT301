const controller = require('../controllers/profileController.js')
const express = require('express')

const router = express.Router()

router.get('/', controller.ensureAuthenticated, controller.profile) // route for profile

module.exports = router
