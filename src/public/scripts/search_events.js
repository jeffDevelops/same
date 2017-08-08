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
      url: '/events/new/meetup',
      data: serializedStuff
    }).done(function(data) {
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
      for (let i = 0; i < results.length; i++) {
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
        url = results[i].link;
        var time = results[i].time;
        let prettyDate = prettifyDate(time);
        let event = new Event(name, org, prettyDate, address, city, state, zip, url);
        events.push(event);
      }
      events.forEach(function(entry) {
        var html = 
          '<div class="row entry" data-event-id="' + event._id + '">' +
            '<div class="col-xs-12">' +
              '<div class="card">' + 
                '<div class="card-block">' +
                  '<a class="clickable" href="' + entry.url + '">' +
                    '<h4 class="card-title">' + entry.name.substr(0, 60) + '...' + '</h4>' +
                    '<h6 class="card-subtitle mb-2 text-muted">' + entry.org + '</h6>' +
                  '</a>' +
                  '<p class="card-text">' + entry.time + '</p>' +
                  '<p class="card-text">' + entry.address + '</p>' + 
                  '<p class="card-text">' + entry.city + ' ' + entry.state + ' ' + entry.zip + '</p>' +
                '</div>' +
                '<button class="import_button btn">Import This Event</button>' +
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

  $('#search_results').on('click', '.import_button', function() {
    var id = $(this).parents('.entry').data('event-id');
    console.log('id', id);
  });
});

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

