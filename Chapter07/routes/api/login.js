var express = require('express');
var router = express.Router();
var JSONAPISerializer = require('jsonapi-serializer').Serializer;
var JSONAPIError = require('jsonapi-serializer').Error;

var users = [{
  id: "1",
  firstName: "Nicholas",
  lastName: "McClay",
  email: "nmcclay@nickmcclay.com",
  password: 'Secret',
  role: 'admin'
}];

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
    var match = users.find(function(user) {
      return user.email === username && user.password === password;
    });
    if (match) {
      req.session.user = match;
      next();
    } else {
      res.status(401).json(authError('Invalid username or password for user authentication.'));
    }
  } else {
    res.status(401).json(authError('Must provide username or password for user authentication.'));
  }
};

router.post('/', login, function(req, res, next) {
  req.session.save(function (err) {
    var user = serializer.serialize(req.session.user);
    var userJSON = user.data.attributes;
    userJSON.exp = new Date().getTime() + 60;
    var jwt = res.jwt(userJSON);
    res.json(jwt.token);
  });
});

module.exports = router;