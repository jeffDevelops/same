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
      url: '/events/new/search',
      data: serializedStuff,
      dataType: 'json'
    }).done(function (data) {
      var results = data.results; //Everything we get back
      function Event(resultNumber, name, org, time, address, city, state, zip, description, url, eventCode) {
        this.resultNumber = resultNumber;
        this.name = name;
        this.org = org;
        this.time = time;
        this.address = address;
        this.city = city;
        this.state = state;
        this.zip = zip;
        this.description = description;
        this.url = url;
        this.eventCode = eventCode;
      }

      var event, resultNumber, name, org, time, prettyDate, address, city, state, zip, description, url, eventCode;

      for (var i = 0; i < results.length; i++) {
        resultNumber = i;
        if ('venue' in results[i]) {
          address = results[i].venue.address_1;
          if ('city' in results[i].venue) {
            city = results[i].venue.city;
          } else {
            city = '';
          }
          if ('state' in results[i].venue) {
            state = results[i].venue.state;
          } else {
            state = '';
          }
          if ('zip' in results[i].venue) {
            zip = results[i].venue.zip;
          } else {
            zip = '';
          }
        } else {
          address = '';
          city = '';
          state = '';
          zip = '';
        }
        if ('group' in results[i]) {
          org = results[i].group.name;
        } else {
          org = '';
        }
        if ('name' in results[i]) {
          name = results[i].name;
        } else {
          name = '';
        }
        if ('url' in results[i]) {
          url = results[i].link;
        } else {
          url = '';
        }
        if ('time' in results[i]) {
          time = results[i].time;
          prettyDate = prettifyDate(time);
        } else {
          time = '';
        }
        if ('description' in results[i]) {
          description = results[i].description;
        } else {
          description = '';
        }

        eventCode = '';

        event = new Event(resultNumber, name, org, prettyDate, address, city, state, zip, description, url, eventCode);
        events.push(event);
      }
      events.forEach(function (entry) {
        var html = '<div class="row entry" data-event-id="' + entry.resultNumber + '">' + '<div class="col-xs-12">' + '<div class="card">' + '<div class="card-block">' + '<a class="clickable" href="' + entry.url + '">' + '<h4 class="card-title">' + entry.name.substr(0, 60) + '...' + '</h4>' + '<h6 class="card-subtitle mb-2 text-muted">' + entry.org + '</h6>' + '</a>' + '<p class="card-text">' + entry.address + '</p>' + '<p class="card-text">' + entry.city + ' ' + entry.state + ' ' + entry.zip + '</p>' + '</div>' + '<form action="/events/new/meetup/confirm" method="POST">' + '<button class="import_button btn">Import This Event</button>' + '</form>' + '</div>' + '</div>' + '</div>';
        $('#search_results').append(html);
      });
    });
    $('#searchbar').click(function () {
      //Clear the array and clear search results from page
      events = [];
      $('#search_results').empty();
    });
    $('#searchbar').on('input', function () {
      events = [];
      $('#search_results').empty();
    });
  });

  $('#search_results').on('click', '.entry .import_button', function (event) {
    event.preventDefault();
    var which = $(this).parents('.entry').data('event-id');
    var eventToSave = events[which];
    delete eventToSave.resultNumber;
    console.log(eventToSave);
    $.ajax({
      type: 'POST',
      url: '/events/new/import',
      data: eventToSave,
      dataType: 'json'
    }).done(function (savedEvent) {
      console.log('Made the POST req, rendering the populated modal now...');
      console.log(savedEvent);
      renderModal(savedEvent);
    }); //Import event event handler
  });
}); //document ready

function renderModal(data) {
  var modal = '' + '<div id="confirm">' + '<div class="container-fluid">' + '<a id="confirm_back_button" class="back_button" href="/events/new/meetup"><i class="fa fa-chevron-left" aria-hidden="true"></i>Back</a>' + '<div class="col-xs-2"></div>' + '<div class="col-xs-8">' + '<form action="/events" method="POST">' + '<h3>Confirm Event Details</h3>' + '<div class="form-group">' + '<label for="eventName">Event Name</label>' + '<input id="eventName" class="form-control" type="text" value="' + data.eventToSave.name + '" name="name">' + '</div>' + '<div class="form-group">' + '<label for="eventOrg">Organization Name</label>' + '<input id="eventOrg" class="form-control" type="text" value="' + data.eventToSave.org + '" name="organization">' + '</div>' + '<div class="form-group">' + '<label for="eventTime">Event Time</label>' + '<input id="eventTime" class="form-control" type="text" value="' + data.eventToSave.time + '" name="time">' + '</div>' + '<div class="form-group">' + '<label for="eventAddress">Event Address</label>' + '<input id="eventAddress" class="form-control" type="text" value="' + data.eventToSave.address + '" name="address">' + '</div>' + '<div class="form-group">' + '<label for="eventCity">City</label>' + '<input id="eventCity" class="form-control" type="text" value="' + data.eventToSave.city + '" name="city">' + '</div>' + '<div class="form-group col-xs-6 state">' + '<label for="eventState">State</label>' + '<input id="eventState" class="form-control" type="text" value="' + data.eventToSave.state + '" name="state">' + '</div>' + '<div class="form-group col-xs-6 zip">' + '<label for="eventZip">Zipcode</label>' + '<input id="eventZip"  class="form-control" type="text" value="' + data.eventToSave.zip + '" name="zip">' + '</div>' + '<div class="form-group">' + '<label for="eventDescription">Event Description</label>' + '<textarea id="eventDescription" class="form-control" name="description">' + data.eventToSave.description + '</textarea>' + '</div>' + '<div class="form-group">' + '<label for="eventCode">Event Code</label>' + '<input id="eventCode" placeholder="Your guests will use this code to check into your event." class="form-control" type="text" value="" />' + '</div>' + '<input type="submit" value="Confirm Event" />' + '</form>' + '</div>' + '<div class="col-xs-2"></div>' + '</div>' + '</div>';
  $('#new_with_meetup').append(modal);
  $('body').css('overflow', 'hidden');
}

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
  } else {
    minutes = date.getUTCMinutes();
  }

  return months[date.getUTCMonth()] + ' ' + date.getUTCDate() + ', ' + date.getUTCFullYear() + ', at ' + hour + ':' + minutes + meridian;
}