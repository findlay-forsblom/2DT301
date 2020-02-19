'use strict'
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const uniqueValidator = require('mongoose-unique-validator')

const userSchema = mongoose.Schema({
  username: { type: String, required: true, unique: true, minlength: 3 },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, minlength: 8 }
})

userSchema.plugin(uniqueValidator, { message: 'Error, {PATH} already exist.' })

userSchema.pre('save', async function (next) {
  const user = this

  if (user.isModified('password') || user.isNew) {
    const hash = await bcrypt.hash(user.password, 12)
    user.password = hash
  }
  next()
})

userSchema.methods.comparePassword = function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password)
}

const Schema = mongoose.model('User', userSchema)

module.exports = Schema
