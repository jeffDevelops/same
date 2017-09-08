/*jshint esversion: 6 */
const express = require('express'),
      app = express(),
      mongoose = require('mongoose'),
      port    = process.env.PORT || 3000,
      bodyParser = require('body-parser'),
      path = require('path'),
      ejs     = require('ejs'),
      request = require('request'),
      passport = require('passport'),
      session = require('express-session'),
      flash = require('connect-flash'),
      morgan = require('morgan'),
      cookieParser = require('cookie-parser'),
      methodOverride = require('method-override');

const keys = require('./keys.js');

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/same');

app.use(morgan('dev'));
app.use(cookieParser());

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use(methodOverride('_method'));

//Serve static assets from public directory
app.use(express.static('dist/public'));

app.use(session({ secret: 'I don\'t know what this is.' }));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

require('./config/passport')(passport);

app.use(function(req, res, next) {
  res.locals.currentUser = req.user;
  next();
});

var routes = require('./config/routes');
app.use(routes);



//ADMIN MEETUP STEP 2 
app.get('/admin/meetup', function(req, res) {
  res.render('admin/meetup');
});

//ADMIN MEETUP SEARCH
// app.post('/admin/meetup/search', function(req, response) {
//   let search = req.body.searchterm;
//   let URL = `https://api.meetup.com/find/events/?text=${search}&key=${keys.meetupAPIKey}`;
//   request(URL, function(err, res, body) {
//     if (err) {
//       console.log(err);
//       return;
//     }  
//     response.render(JSON.parse(body)); //Pass this to ejs and have a ball looping through thumbnails
//   });
// });
//ADMIN MEETUP SEARCH RESULT
app.get('/admin/meetup/:search', function(req, res) {
  let search = req.query.searchterm;
  console.log('search: ' + search);
  let URL = `https://api.meetup.com/find/events/?text=${search}&key=${keys.meetupAPIKey}`;
  request(URL, function(error, response, body) {
    if (error) {
      console.log(error);
      return;
    }
    body = JSON.parse(body);
    console.log(body);
    res.json('admin/result', body);
  });
});

app.listen(port, function() {
  console.log('Same app served on ' + port);
});
