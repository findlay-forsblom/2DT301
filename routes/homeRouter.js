const controller = require('../controllers/homeController.js')
const express = require('express')

const router = express.Router()

router.get('/', controller.redirectHome, controller.index) // Login page
router.get('/profile', controller.ensureAuthenticated, controller.profile) // route for profile
router.get('/register', controller.register) // route for register page

router.post('/register', controller.registerPost) // post regsiter handler
router.post('/login', controller.loginPost) // Login post handler
router.post('/logout', controller.logout) // Login post handler

module.exports = router
