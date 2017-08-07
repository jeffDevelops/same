/* jshint esversion: 6 */
const passport = require('passport');

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

module.exports = {
  getLanding: getLanding,
  postRegister: postRegister,
  postLogin: postLogin,
  differentiateUser: differentiateUser,
};