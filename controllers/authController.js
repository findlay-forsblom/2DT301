'use strict'

/**
 * Controller for authentication related requests. Handles login,
 * registration and logout of users.
 *
 * @author Findlay Forsblom, ff222ey, Linnaeus University.
 * @author Lars Petter Ulvatne, lu222bg, Linnaeus University.
 */

const passwordChecker = require('../libs/passwordChecker.js')
const User = require('../models/user.js')
const authController = {}

/**
 * Renders login page. Secures login by adding CSRF token to form.
 * @param {HTTP request object} req The request made by client.
 * @param {HTTP response object} res The response to send to client.
 * @param {Callback function} next Callback for next middleware.
 */
authController.index = async (req, res, next) => {
  res.render('auth/login', { csrfToken: req.csrfToken() })
}

/**
 * Renders registration page. Secures registration by adding CSRF token to form.
 * @param {HTTP request object} req The request made by client.
 * @param {HTTP response object} res The response to send to client.
 * @param {Callback function} next Callback for next middleware.
 */
authController.register = async (req, res, next) => {
  res.render('auth/register', { csrfToken: req.csrfToken() })
}

/**
 * When user tries to register, username/email has to be unique. Also checks for matching
 * passwords and meets the requirement. If all passes tests the password is hashed and
 * the user is created and stored in database. Redirects to profile. Secured by CSRF token.
 * @param {HTTP request object} req The request made by client.
 * @param {HTTP response object} res The response to send to client.
 * @param {Callback function} next Callback for next middleware.
 */
authController.registerPost = async (req, res, next) => {
  // Fetch parameters from request.
  let username = req.body.username
  let email = req.body.email
  const password = req.body.password
  const confirmPassword = req.body.confirmPassword

  // Process fetched parameters.
  username = username.trim()
  username = username.toLowerCase()
  username = username.charAt(0).toUpperCase() + username.slice(1)
  email = email.trim()
  const match = passwordChecker.check(password, confirmPassword)

  if (match) {
    // If matched password, create new user.
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

/**
 * Logs in a user by fetching username from database and compares the hash
 * of password input to database. Secured by CSRF token.
 * @param {HTTP request object} req The request made by client.
 * @param {HTTP response object} res The response to send to client.
 * @param {Callback function} next Callback for next middleware.
 */
authController.loginPost = async (req, res, next) => {
  // Fetch and process request parameters.
  let email = req.body.username
  const password = req.body.password
  email = email.trim()
  email = email.toLowerCase()

  try {
    // Check if user exist
    const user = await User.findOne({ email })
    if (!user) {
      req.session.flash = { type: 'danger', text: 'Log in failed. Username or password is incorrect.' }
      res.redirect('/')
      return
    }

    // Check if password match.
    const result = await user.comparePassword(password)
    if (result) {
      req.session.userId = user.id
      req.session.username = user.username
      req.session.flash = { type: 'success', text: `Welcome ${user.username}. You have succesfully logged in` }
      res.redirect(`/profile/${user.username}`)
    } else {
      req.session.flash = { type: 'danger', text: 'Log in failed. username or password is incorrect' }
      res.redirect('/')
    }
  } catch (error) {
    console.log(error.message)
    req.session.flash = { type: 'danger', text: 'An error ocuured while logging in. Please try again later' }
    res.redirect('/')
  }
}

/**
 * Redirects to profile page is authenticated user is found through cookie when
 * trying to access login/register page.
 * @param {HTTP request object} req The request made by client.
 * @param {HTTP response object} res The response to send to client.
 * @param {Callback function} next Callback for next middleware.
 */
authController.redirectAuthenticated = async (req, res, next) => {
  if (req.session.userId) {
    res.redirect(`/profile/${req.session.username}`)
  } else {
    next()
  }
}

/**
 * Logs out an authenticated user by deleting user session object.
 * @param {HTTP request object} req The request made by client.
 * @param {HTTP response object} res The response to send to client.
 * @param {Callback function} next Callback for next middleware.
 */
authController.logout = async (req, res, next) => {
  delete req.session.userId
  req.session.flash = { type: 'success', text: 'Succesfully logged out' }
  res.redirect('/')
  req.session.cookie.maxAge = 0
}

module.exports = authController
