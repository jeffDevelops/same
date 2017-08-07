/* jshint esversion: 6 */
const expect = require('chai').expect;
const request = require('request');
const keys = require('../keys.js');

const URL = 'https://api.meetup.com/DenverScript/events/?key=' + keys.meetupAPIKey;

//
describe('meetupAPI', function() {
  let apiError, apiResponse, apiBody;
  before(function(done) {
    request(URL, function(err, res, body) {
      apiError = err;
      apiResponse = res;
      apiBody = body;
      done();
    });
  });
  it ('should return statusCode 200', function() {
    expect(apiResponse.statusCode).to.eq(200);
  });
  it ('should not return an empty response body', function() {
    expect(apiBody).to.not.be.empty;
    expect(Array.isArray(JSON.parse(apiBody))).to.eq(true);
  });
});