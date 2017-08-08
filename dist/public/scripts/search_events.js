'use strict';

/*jshint esversion: 6*/

var events = [];
$(document).ready(function () {
  $('#new_with_meetup form').on('submit', function (event) {
    event.preventDefault();
    console.log('Submitted');
    var serializedStuff = $('#new_with_meetup form').serialize();
    console.log(serializedStuff);
    $.ajax({
      type: 'POST',
      url: '/events/new/meetup',
      data: serializedStuff
    }).done(function (data) {
      var results = data.results; //Everything we get back
      function Event(name, org, time, address, city, state, zip, url) {
        this.name = name;
        this.org = org;
        this.time = time;
        this.address = address || 'No address was provided.';
        this.city = city;
        this.state = state;
        this.zip = zip;
        this.url = url;
      }

      var name, org, address, city, state, zip, url;
      for (var i = 0; i < results.length; i++) {
        if ('venue' in results[i]) {
          address = results[i].venue.address_1;
          city = results[i].venue.city;
          state = results[i].venue.state;
          zip = results[i].venue.zip;
        } else {
          address = ' ';
          city = ' ';
          state = ' ';
          zip = ' ';
        }
        if ('group' in results[i]) {
          org = results[i].group.name;
        } else {
          org = ' ';
        }
        name = results[i].name;
        var time = results[i].time;
        var prettyDate = prettifyDate(time);
        var _event = new Event(name, org, prettyDate, address, city, state, zip);
        events.push(_event);
      }
      events.forEach(function (entry) {
        console.log(entry);
        var html = '<div class="row">' + '<div class="col-xs-12">' + '<div class="card">' + '<div class="card-block">' + '<h4 class="card-title">' + '</h4>' + '<h6 class="card-subtitle mb-2 text-muted">Card subtitle</h6>' + '<p class="card-text">Some quick example text to build on the card title and make up the bulk of the card\'s content.</p>' + '<a href="#" class="card-link">Card link</a>' + '<a href="#" class="card-link">Another link</a>' + '</div>' + '</div>' + '</div>' + '</div>';
        $('#new_with_meetup').append(html);
      });
    });
    $('#new_with_meetup form').change(function () {
      events = [];
      console.log(events);
    });
  });
});

function prettifyDate(date) {
  //This was annoying.
  date = new Date();

  var hour = void 0;
  var minutes = void 0;
  var meridian = void 0;

  var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  if (date.getUTCHours() > 12) {
    //At and after 1pm
    hour = date.getUTCHours() - 12;
    meridian = 'PM';
  } else if (date.getUTCHours() === 12) {
    hour = date.getUTCHours();
    meridian = 'PM';
  } else {
    meridian = 'AM';
    hour = date.getUTCHours();
  }

  if (date.getUTCMinutes() < 10) {
    minutes = '0' + date.getUTCMinutes();
    console.log(minutes);
  } else {
    minutes = date.getUTCMinutes();
  }

  return months[date.getUTCMonth()] + ' ' + date.getUTCDate() + ', ' + date.getUTCFullYear() + ', at ' + hour + ':' + minutes + meridian;
}