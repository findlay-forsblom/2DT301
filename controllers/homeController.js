'use strict'
const passwordChecker = require('../libs/passwordChecker.js')
const User = require('../models/user.js')
const homeController = {}
const err = {}

homeController.index = async (req, res, next) => {
  res.render('home/login')
}

homeController.register = async (req, res, next) => {
  res.render('home/register')
}

/**
 * When a user registers it takes the username and ensures that
 * it is unique. It does the same for the email. It also checks that both passwrods match 
 * and that they meet the requirements
 *
 * If all is good the password is hashed and the user is created and stored in a databse
 */

homeController.registerPost = async (req, res, next) => {
  let username = req.body.username
  let email = req.body.email
  username = username.trim()
  username = username.toLowerCase()
  username = username.charAt(0).toUpperCase() + username.slice(1)
  email = email.trim()
  const password = req.body.password
  const confirmPassword = req.body.confirmPassword

  const match = passwordChecker.check(password, confirmPassword)
  if (match) {
    try {
      const user = new User({
        username: username,
        email: email,
        password: password
      })
      await user.save()
      req.session.flash = { type: 'success', text: 'User succesfully created' }
      req.session.userId = user.id
      req.session.username = user.username
      res.redirect('/profile')
    } catch (error) {
      req.session.flash = { type: 'danger', text: error.message }
      res.redirect('/register')
    }
  } else {
    req.session.flash = { type: 'danger', text: 'passwords do not match' }
    res.redirect('/register')
  }
}

homeController.loginPost = async (req, res, next) => {
  let email = req.body.username
  email = email.trim()
  email = email.toLowerCase()
  const password = req.body.password

  try {
    const user = await User.findOne({ email })
    if (!user) {
      req.session.flash = { type: 'danger', text: 'Log in failed. username or password is incorrect' }
      res.redirect('/')
      return
    }
    const result = await user.comparePassword(password)

    if (result) {
      req.session.userId = user.id
      req.session.username = user.username
      req.session.flash = { type: 'success', text: `Welcome ${user.username}. You have succesfully logged in` }
      res.redirect('/profile')
    } else {
      req.session.flash = { type: 'danger', text: 'Log in failed. username or password is incorrect' }
      res.redirect('/')
    }
  } catch (error) {
    console.log(error.message)
    req.session.flash = { type: 'danger', text: 'An error ocuured while logging in. Pls try again later' }
    res.redirect('/')
  }
}

homeController.profile = async (req, res, next) => {
  res.render('profile/profile')
}

/**
 * Redirects to profile page if an authenticated user tries to access
 * the login page or register page
 */
homeController.redirectHome = async (req, res, next) => {
  if (req.session.userId) {
    req.redirect('/profile')
  } else {
    next()
  }
}

// Ensures that a user that is authentticated before allowing them to resources that requires authentication
homeController.ensureAuthenticated = async (req, res, next) => {
  if (req.session.userId) {
    next()
  } else {
    err.status = 403
    next(err)
  }
}

homeController.logout = async (req, res, next) => {
  delete req.session.userId
  req.session.flash = { type: 'success', text: 'Succesfully logged out' }
  res.redirect('./')
  req.session.cookie.maxAge = 0
}

module.exports = homeController
