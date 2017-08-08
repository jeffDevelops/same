/* jshint esversion: 6 */
const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const passport = require('passport');

const usersController = require('../controllers/users');

function authorizeUser(req, res, next) {
  if (req.isAuthenticated()) return next();
  res.redirect('/');
}

//USERS ROUTES

//Landing page
router.route('/')
      .get(usersController.getLanding);

//Posts new email and password
router.route('/register')
      .post(usersController.postRegister);

//Posts login info for Passport
router.route('/login')
      .post(usersController.postLogin);

//Log User Out
router.route("/logout")
  .get(usersController.getLogout);

//Renders split users' experience page
router.route('/differentiate')
      .get(authorizeUser, usersController.differentiateUser);

//Renders new event choices page (Meetup or form)
router.route('/events/new')
      .get(authorizeUser, usersController.renderCreateEventChoices);

//Renders new event via Meetup page
router.route('/events/new/meetup')
      .get(usersController.renderPopulateFromMeetupPage);

router.route('/events/new/meetup')
      .post(usersController.searchForEvent);

router.route('/events/new/meetup/confirm')
      .post(usersController.confirmEvent);

module.exports = router;
