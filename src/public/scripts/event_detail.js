$(document).ready(function() {
  var $editBtn = $('#edit_event_button');
  var $deleteBtn = $('#delete_event_button');
  var $back = $('#confirm_back_button');
  var $modal = $('.confirm');
  var event = $('#event_data').data();


  $editBtn.click(function() {
    console.log('Edit!');
    console.log(event);
    var modal = '' +
      '<div class="confirm edit">' + 
      '<div class="container-fluid">' +

        '<a class="back_button back" href="/events/' + event.id + '"><i class="fa fa-chevron-left" aria-hidden="true"></i></a>' +

        '<div class="col-xs-2"></div>' +

        '<div class="col-xs-8">' +
          '<form action="/events/' + event.id + '?_method=PUT" method="POST">' +
            '<h3>Edit Event Details</h3>' +
            '<div class="form-group">' +
              '<label for="eventName">Event Name</label>' +
              '<input id="eventName" class="form-control" type="text" value="' + event.name + '" name="name">' +
            '</div>' +
            '<div class="form-group">' +
              '<label for="eventOrg">Organization Name</label>' +
              '<input id="eventOrg" class="form-control" type="text" value="' + event.org + '" name="organization">' +
            '</div>' +
            '<div class="form-group">' +
              '<label for="eventTime">Event Time</label>' +
              '<input id="eventTime" class="form-control" type="text" value="'+ event.time + '" name="time">' +
            '</div>' +
            '<div class="form-group">' +
              '<label for="eventAddress">Event Address</label>' +
              '<input id="eventAddress" class="form-control" type="text" value="' + event.address + '" name="address">' +
            '</div>' +
            '<div class="form-group">' +
              '<label for="eventCity">City</label>' +
              '<input id="eventCity" class="form-control" type="text" value="' + event.city + '" name="city">' +
            '</div>' +
            '<div class="form-group col-xs-6 state">' +
              '<label for="eventState">State</label>' +
              '<input id="eventState" class="form-control" type="text" value="' + event.state + '" name="state">' +
            '</div>' +
            '<div class="form-group col-xs-6 zip">' +
              '<label for="eventZip">Zipcode</label>' +
              '<input id="eventZip"  class="form-control" type="text" value="' +  event.zip + '" name="zip">' +
            '</div>' +
            '<div class="form-group">' +
              '<label for="eventDescription">Event Description</label>' +
              '<textarea id="eventDescription" class="form-control" name="description">' +
                event.description +
              '</textarea>' +
            '</div>' +
            '<div class="form-group">' +
              '<label for="eventCode">Event Code</label>' +
              '<input id="eventCode" placeholder="Your guests will use this code to check into your event." name="code" class="form-control" type="text" value="' + event.code+ '" required/>' +
            '</div>' +
            '<input type="submit" value="Save Changes" />' +
          '</form>' +
        '</div>' +
        '<div class="col-xs-2"></div>' +
      '</div>' +
    '</div>';
    $('body').append(modal);
    $('.confirm.edit').css('display', 'block');
    $('body').css('overflow', 'hidden');
    $('.back_button').click(function() {
      console.log('Clicked!');
      $('body').remove($('.confirm'));
    });
  });

  $deleteBtn.click(function() {
    console.log('Delete!');
    $modal.css('display', 'block');
  });

  $back.click(function() {
    $modal.css('display', 'none');
  });

});