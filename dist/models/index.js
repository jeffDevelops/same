/* jshint esversion: 6 */
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/same');

module.exports.User = require('./user.js');
module.exports.Event = require('./event.js');