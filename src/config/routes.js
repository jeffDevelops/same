/* jshint esversion: 6 */
const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
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

//Renders new event in a confirmation form via Meetup page
router.route('/events/new/search')
      .get(authorizeUser, usersController.renderSearch)
      .post(usersController.searchForEvent);


router.route('/events/new/meetup')
      .get(usersController.searchForEvent);

router.route('/events/new/import')
      .post(usersController.populateForm);

//EVENTS INDEX
router.route('/events')
      .get(authorizeUser, usersController.renderMyEvents)
      .post(authorizeUser, usersController.saveEvent);

//EVENTS SHOW (DETAIL)
router.route('/events/:id')
      .get(/*authorizeUser,*/usersController.renderShowPage)
      .put(/*authorizeUser,*/usersController.updateDoc)
      .delete(/*authorizeUser,*/usersController.deleteEvent);

module.exports = router;
