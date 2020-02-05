const controller = require('../controllers/homeController.js')
const express = require('express')

const router = express.Router()

router.get('/', controller.index)

module.exports = router
