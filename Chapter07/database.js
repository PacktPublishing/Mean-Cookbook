var Post = require('./models/posts');
var env = process.env.NODE_ENV || 'development';

var mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
mongoose.connect('mongodb://localhost/mean-db');

var generateMock = function(model, count, generateFake) {
  console.log("purging all " + model.modelName + "...");
  Post.remove({}, function(err) {
    let mocks = [];
    for (var i=0; i < count; i++) {
      mocks.push(generateFake());
    }

    Post.create(mocks, function (err) {
      if (err) return console.error('Failed to create mock ' + model.modelName);
      console.log(count + " mock " + model.modelName + " created");
    });
  });
};

var mongo = mongoose.connection;
var db = mongo.db;
mongo.on('error', console.error.bind(console, 'failed to connect to mongodb:'));
mongo.once('open', function() {
  if (env == 'development') {
    var faker = require('faker');
    generateMock(Post, 30, function() {
      return {
        title: faker.lorem.words(),
        content: faker.lorem.sentences(),
        published: faker.date.past()
      }
    });
  }
});

module.exports = db;