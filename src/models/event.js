/* jshint esversion: 6 */
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Event = new Schema({
  name: String,
  organization: String,
  time: String,
  address: String,
  city: String,
  state: String,
  zip: String,
  description: String,
  url: String
});

module.exports = mongoose.model('Event', Event);