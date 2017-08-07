/* jshint esversion: 6 */
$(document).ready(function() {
  /* Login / Register Logic */

  $('.register_link').on('click', toggleForm);

    function toggleForm() {
      event.preventDefault();
      if ($(this).hasClass('login_link')) {
        $(this).text('Not registered? Sign up here!');
        $(this).prop('disabled', true);
        $(this).addClass('register_link');
        $(this).removeClass('login_link');
        $('#register').fadeOut('slow', function() {
          $('#login').fadeIn('slow', function() {
             $('#toggle_forms').prop('disabled', false);
          });
        });
      } else {
        $(this).text('Already have an account? Login here!');
        $(this).prop('disabled', true);
        $(this).addClass('login_link');
        $(this).removeClass('register_link');
        $('#login').fadeOut('slow', function() {
          $('#register').fadeIn('slow', function() {
             $('#toggle_forms').prop('disabled', false);
          });
        });
      }
    }
});
