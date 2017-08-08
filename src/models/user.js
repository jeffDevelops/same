/* jshint esversion: 6*/
const mongoose  = require('mongoose');
const bcrypt    = require('bcrypt-nodejs');

const Event     = require('./event.js');   

const Schema = mongoose.Schema;

const User = new Schema({
  local: {
    email: String,
    password: String
  },
  savedEvents: [Event.schema]
});

//Define a User method that hashes a salted version of an incoming password attempt
User.methods.hash = function(passwordAttempt) {
  return bcrypt.hashSync(passwordAttempt, bcrypt.genSaltSync(8));
};

//Define a User method that compares 
User.methods.validPassword = function(passwordAttempt) {
  return bcrypt.compareSync(passwordAttempt, this.local.password);
};

module.exports = mongoose.model('User', User);