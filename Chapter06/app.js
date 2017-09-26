var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var api = require('./routes/api');
// var angular = require('./routes/angular');
var auth = require('./middleware/auth');
var jwt = require('jwt-express');

var app = express();
var env = process.env.NODE_ENV || 'development';

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('short'));
app.use(auth.logger(logger));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser(process.env.cookieSecret));
app.use(jwt.init(process.env.jwtSecret, {
  cookieOptions: {httpOnly: false}
}));

if (env == 'production') {
  app.use(session({
    secret: process.env.cookieSecret,
    resave: false,
    saveUninitialized: true,
    name: 'express-project-session',
    cookie: {
      secure: true,
      httpOnly: true,
      domain: 'localhost',
      expires: new Date(Date.now() + 60 * 60 * 1000)
    }
  }));
  var helmet = require('helmet');
  app.use(helmet());
} else {
  app.use(session({
    secret: process.env.cookieSecret,
    resave: false,
    saveUninitialized: true
  }));
}

app.get('/crash', function(req, res) {
  this.does.not.exist;
  process.exit(1);
});

// app.use('/', angular);
app.use('/api', api);
app.use(function(req, res) {
  var error = new Error('Not Found');
  res.status(404).json({
    status: 404,
    message: error.message,
    name: error.name
  });
});

module.exports = app;