var env = process.env.NODE_ENV || 'development';
var mongoose = require('mongoose');
global.Promise = mongoose.Promise = require("bluebird");
mongoose.connect('mongodb://localhost/mean-db').then(function() {
  if (env == 'development') {
    var mocks = require('./mocks');
    mongoose.connection.db.dropDatabase().then(function() {
      mocks.generateAuthorAndPosts(3);
      mocks.generateAuthorAndPosts(3);
      mocks.generateAuthorAndPosts(3);
      mocks.generateAdmin()
    });
  }
}, function(error) {
  console.error('failed to connect to MongoDB...', error);
});

module.exports = mongoose.connection;