/* jshint esversion: 6 */
const passport = require('passport');
const keys = require('../keys.js');
const request = require('request');
const bodyParser = require('body-parser');

function getLanding(req, res) {
  res.render('landing.ejs', { 
    signupMessage: req.flash('signupMessage'), 
    loginMessage: req.flash('loginMessage') 
  });
}

function postRegister(req, res, next) {
  console.log('Signup route hit!');
  console.log(req.body);
  let signupStrategy = passport.authenticate('local-signup', {
    successRedirect: '/differentiate',
    failureRedirect: '/',
    failureFlash: true
  });
  console.log('Did we get here?');
  return signupStrategy(req, res, next);
} 

function postLogin(req, res, next) {
  console.log('Oh, wow thats me!');
  var loginStrategy = passport.authenticate('local-login', {
    successRedirect: '/differentiate',
    failureRedirect: '/',
    failureFlash:true
  });
  return loginStrategy(req, res, next);
}

function differentiateUser(req, res) {
  console.log('Hooray, something new is happening!');
  res.render('user_split.ejs');
}

function renderCreateEventChoices(req, res) {
  res.render('events/new.ejs');
}

function renderPopulateFromMeetupPage (req, res) {
  res.render('events/new_with_meetup');
}

function searchForEvent(req, res) {
  console.log("HIT");
  let URL = `https://api.meetup.com/find/events/?text=${req.body.searchterm}&key=${keys.meetupAPIKey}`;
  request(URL, function(error, response, body) {
    if (error) {
      console.log(error);
      return;
    }
    body = JSON.parse(body);
    res.json({results: body});
  });
}

module.exports = {
  getLanding: getLanding,
  postRegister: postRegister,
  postLogin: postLogin,
  differentiateUser: differentiateUser,
  renderCreateEventChoices: renderCreateEventChoices,
  renderPopulateFromMeetupPage: renderPopulateFromMeetupPage,
  searchForEvent: searchForEvent
};