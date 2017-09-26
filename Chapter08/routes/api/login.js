var express = require('express');
var router = express.Router();
var JSONAPISerializer = require('jsonapi-serializer').Serializer;
var JSONAPIError = require('jsonapi-serializer').Error;
var Users = require('../../models/users');

var serializer = new JSONAPISerializer('users', {
  attributes: ['firstName', 'lastName', 'email', 'role'],
  keyForAttribute: 'camelCase'
});

var authError = function(message) {
  return new JSONAPIError({
    status: 401,
    title: 'Invalid Authorization Parameters',
    detail: message
  });
};

var login = function(req, res, next) {
  var username = req.body.username;
  var password = req.body.password;

  if (username && password) {
    Users.findOne({ email: username }, function(error, user) {
      if (error || !user) return res.status(401).json(authError('Invalid username or password for user authentication.'));

      user.comparePassword(password, function(error, match) {
        if (error) return res.status(401).json(authError('Invalid username or password for user authentication.'));
        if (match) {
          req.session.user = user;
          next();
        } else {
          res.status(401).json(authError('Invalid username or password for user authentication.'));
        }
      });
    });
  } else {
    res.status(401).json(authError('Must provide username or password for user authentication.'));
  }
};

router.post('/', login, function(req, res, next) {
  req.session.save(function (error) {
    if (error) return res.status(401).json(authError('Unable to create session'));
    var user = serializer.serialize(req.session.user);
    var userJSON = user.data.attributes;
    userJSON.exp = new Date().getTime() + 60;
    var jwt = res.jwt(userJSON);
    res.json(jwt.token);
  });
});

module.exports = router;