# Same

## Making networking easier

Same is a webapp for connecting people at events based on common interests. An admin creates an event, either from scratch, or by importing an existing event from the Meetup API. Once an event is created, guests can attend it, both in person and on the app. Event attendees can then log into an event when they get there, import their profile picture and information from Meetup, and look for people in a crowd of people they don't know that have common interests.

##Technologies Used

* Mongo database
* Express routing
* Node backend scripting
* Meetup API
* AJAX for getting data from the third party API
* EJS Templating

* Sass CSS Preprocessing
* Gulp automation: compile and minify Sass, transpile ES6, minify front-end scripts
* Mocha/Chai testing: API testing

##Unsolved Problems

As of yet, I still cannot get any Javascript to execute in my EJS template for where an event Admin will import an event from meetup. Not even a console.log will display on the front end. The object I'm passing from the backend--the event saved into the db from the user's search is definitely going into the database. Do I need to db.find it again, or can I pass the data to the front end in my db.create for that route controller? This could be an explanation for why the data isn't getting passed to the front end.

##User Stories

https://trello.com/b/yhxcuRLw/same

##The App

Doesn't currently work on Heroku.
https://shrouded-tor-94002.herokuapp.com/