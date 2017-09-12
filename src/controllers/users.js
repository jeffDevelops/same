/* jshint esversion: 6 */
const passport = require('passport');
const keys = require('../env.js');
const request = require('request');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const sanitize = require('sanitize-html');

const db = require('../models/index.js');

function getLanding(req, res) {
  res.render('landing.ejs', { 
    signupMessage: req.flash('signupMessage'), 
    loginMessage: req.flash('loginMessage') 
  });
}

function postRegister(req, res, next) {
  let signupStrategy = passport.authenticate('local-signup', {
    successRedirect: '/differentiate',
    failureRedirect: '/',
    failureFlash: true
  });
  return signupStrategy(req, res, next);
} 

function postLogin(req, res, next) {
  var loginStrategy = passport.authenticate('local-login', {
    successRedirect: '/differentiate',
    failureRedirect: '/',
    failureFlash:true
  });
  return loginStrategy(req, res, next);
}

function getLogout(request, response, next) {
  request.logout();
  response.redirect('/');
}

function differentiateUser(req, res) {
  res.render('user_split.ejs');
}

function renderCreateEventChoices(req, res) {
  res.render('events/new.ejs');
}

function renderSearch (req, res) {
  res.render('events/new_with_meetup');
}

function searchForEvent(req, res) {
  let URL = `https://api.meetup.com/find/events/?text=${req.body.searchterm}&key=${process.env.meetupAPIKey || keys.meetupAPIKey}`;
  request(URL, function(error, response, body) {
    if (error) throw error;
    body = JSON.parse(body);
    res.json({results: body});
  });
}

function populateForm(req, res) {
    res.json({eventToSave: req.body});
}

function saveEvent(req, res) {
  db.Event.create({
      name: req.body.name,
      organization: req.body.organization,
      time: req.body.time,
      address: req.body.address,
      city: req.body.city,
      state: req.body.state,
      zip: req.body.zip,
      description: req.body.description,
      eventCode: req.body.eventCode
    }, function(err, createdEvent) {
      if (err) throw err;
      res.redirect('/events');
    });
}

function renderMyEvents(req, res) {
  db.Event.find({}, function(err, docs) {
    if (err) throw err;
    res.render('events/my_events',{ myEvents: docs});
  });
}

function renderShowPage(req, res) {
  db.Event.findOne({_id: req.params.id}, function(err, doc) {
    if (err) throw err;
    res.render('events/detail', {event: doc});
  });
}

function updateDoc(req, res) {
  console.log(typeof(req.body));
  let updatedEvent = req.body;
  console.log('Updated Event: ' + JSON.stringify(updatedEvent));
  db.Event.findOneAndUpdate({ "_id": req.params.id }, 
    { "$set": 
      {
        "name": updatedEvent.name,
        "organization": updatedEvent.org,
        "time": updatedEvent.time,
        "address": updatedEvent.address,
        "city": updatedEvent.city,
        "state": updatedEvent.state,
        "zip": updatedEvent.zip,
        "description": updatedEvent.description,
        "eventCode": updatedEvent.code
      }
    }, { new: true }).exec(function(err, updatedDoc) {
    if (err) throw err;
  });
  res.redirect('/events/' + req.params.id);
}

function deleteEvent(req, res) {
  db.Event.findOneAndRemove({_id: req.params.id}, function(err, deletedDoc) {
    if (err) throw err;
  });
  res.redirect('/events');
}

module.exports = {
  getLanding: getLanding,
  postRegister: postRegister,
  postLogin: postLogin,
  getLogout: getLogout,
  differentiateUser: differentiateUser,
  renderCreateEventChoices: renderCreateEventChoices,
  renderSearch: renderSearch,
  searchForEvent: searchForEvent,
  populateForm: populateForm,
  saveEvent: saveEvent, //EVENTS CREATE
  renderMyEvents: renderMyEvents, //EVENTS INDEX
  renderShowPage: renderShowPage, //EVENTS READ
  updateDoc: updateDoc,
  deleteEvent: deleteEvent //EVENT DELETE
};