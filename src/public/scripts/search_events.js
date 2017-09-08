/*jshint esversion: 6*/

let events = [];
$(document).ready(function() {
  $('#new_with_meetup form').on('submit', function(event) {
    event.preventDefault();
    console.log('Submitted');
    var serializedStuff = $('#new_with_meetup form').serialize();
    console.log(serializedStuff);
    $.ajax({
      type: 'POST',
      url: '/events/new/search',
      data: serializedStuff,
      dataType: 'json'
    }).done(function(data) {
      var results = data.results; //Everything we get back
      function Event(resultNumber, name, org, time, address, city, state, zip, description, url) {
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
      }
      
      var event, resultNumber, name, org, time, prettyDate, address, city, state, zip, description, url;

      for (let i = 0; i < results.length; i++) {
        resultNumber = i;
        if ('venue' in results[i]) {
          address = results[i].venue.address_1;
          if ('city' in results[i].venue) {
            city = results[i].venue.city; 
          } else { city = ''; }
          if ('state' in results[i].venue) {
            state = results[i].venue.state;
          } else { state = ''; }
          if ('zip' in results[i].venue) {
            zip = results[i].venue.zip;
          } else { zip = ''; }
        } else {
          address = '';
          city = '';
          state = '';
          zip = '';
        }
        if ('group' in results[i]) {
          org = results[i].group.name;
        } else { org = ''; }
        if ('name' in results[i]) {
          name = results[i].name;
        } else { name = ''; }
        if ('url' in results[i]) {
          url = results[i].link;
        } else { url = '' ;}
        if ('time' in results[i]) {
          time = results[i].time; 
          prettyDate = prettifyDate(time);
        } else { time = '' ; }
        if ('description' in results[i]) {
          description = results[i].description;
        } else { description = ''; }

        event = new Event(resultNumber, name, org, prettyDate, address, city, state, zip, description, url);
        events.push(event);
      }
      events.forEach(function(entry) {
        var html = 
          '<div class="row entry" data-event-id="' + entry.resultNumber + '">' +
            '<div class="col-xs-12">' +
              '<div class="card">' + 
                '<div class="card-block">' +
                  '<a class="clickable" href="' + entry.url + '">' +
                    '<h4 class="card-title">' + entry.name.substr(0, 60) + '...' + '</h4>' +
                    '<h6 class="card-subtitle mb-2 text-muted">' + entry.org + '</h6>' +
                  '</a>' +
                  '<p class="card-text">' + entry.address + '</p>' + 
                  '<p class="card-text">' + entry.city + ' ' + entry.state + ' ' + entry.zip + '</p>' +
                '</div>' +
                '<form action="/events/new/meetup/confirm" method="POST">' +
                '<button class="import_button btn">Import This Event</button>' +
                '</form>' +
              '</div>' +
            '</div>' +
          '</div>';
        $('#search_results').append(html);
      });
    });
    $('#searchbar').click(function() { //Clear the array and clear search results from page
      events = [];
      $('#search_results').empty();
    });
    $('#searchbar').on('input', function() {
      events = [];
      $('#search_results').empty();
    });
  });

  $('#search_results').on('click', '.entry .import_button', function(event) {
    event.preventDefault();
    var which = ($(this).parents('.entry').data('event-id'));
    var eventToSave = events[which];
    delete eventToSave.resultNumber;
    console.log(eventToSave);
    $.ajax({
      type: 'POST',
      url: '/events/new/import',
      data: eventToSave,
      dataType: 'json'
    }).done(function() {
      console.log('Made the POST req, making a GET request now...');
      window.location.replace('/events/new/meetup/saved');
      });
    });//Import event event handler
});//document ready

function prettifyDate(date) { //This was annoying.
  date = new Date();

  let hour;
  let minutes;
  let meridian;

  const months = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  if (date.getUTCHours() > 12) { //At and after 1pm
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

