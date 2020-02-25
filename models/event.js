'use strict'
/**
 * Module for creating an Event scheme for the database.
 * This is what is used for storing the recent events
 */
const mongoose = require('mongoose')

const eventSchema = mongoose.Schema({
  title: String, // String is shorthand for {type: String}
  deviceID: String,
  imgUrl: String,
  time: { type: Date, default: Date.now }
})

const Schema = mongoose.model('Event', eventSchema)

module.exports = Schema
