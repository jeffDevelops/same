/* jshint esversion: 6 */
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/user');

console.log('Hello?');

module.exports = function(passport) {

  passport.serializeUser(function(user, callback) {
    console.log('User serialized.');
    callback(null, user.id);
  });

  passport.deserializeUser(function(id, callback) {
    console.log('User deserialized');
    User.findById(id, function(error, user) {
      callback(error, user);
    });
  });

  passport.use('local-signup', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
  }, function(request, email, password, callback) {
    //Find User with given email
    User.findOne({'local.email': email}, function(error, user) {
      if (error) return callback(error);
      //If user already exists:
      if (user) {
        console.log('You cannot register an email that already has an account!');
        return callback(null, false, request.flash('signupMessage', 'A user with this email already exists.'));
      //User does not exist yet, so create it:
      } else {
        console.log('No user with that email exists, creating...');
        let newUser = new User();
        newUser.local.email = email;
        newUser.local.password = newUser.hash(password);

        newUser.save(function(err) {
          if (err) throw err;
          return callback(null, newUser);
        });
      }
    });
  }));

  passport.use('local-login', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
  }, function(request, email, password, callback) {
    //Search for a user with the provided email
    User.findOne({'local.email': email}, function(error, user) {
      if (error) {
        return callback(error);
      }
      //If no user is found:
      if(!user) {
        return callback(null, false, request.flash('loginMessage', 'Sorry, the email and password you provided didn\'t match an account in our records.'));
      }
      if(!user.validPassword(password)) {
        return callback(null, false, request.flash('loginMessage', 'Sorry, the email and password you provided didn\'t match an account in our records.'));
      }
      return callback(null, user);
    });
  }));
};