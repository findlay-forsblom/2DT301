'use strict'
const mongoose = require('mongoose')

const eventSchema = mongoose.Schema({
  title: String, // String is shorthand for {type: String}
  deviceID: String,
  imgUrl: String,
  time: { type: Date, default: Date.now }
})

const Schema = mongoose.model('Event', eventSchema)

module.exports = Schema
