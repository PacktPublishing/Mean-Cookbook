var express = require('express');
var router = express.Router();
var restFactory = require('../../middleware/rest');
var Users = require('../../models/users');
var JSONAPISerializer = require('jsonapi-serializer').Serializer;
var JSONAPIError = require('jsonapi-serializer').Error;
var _clone = require('lodash/clone');

var serialize = {
  transform: function(user) {
    return user.toObject();
  },
  id: '_id',
  attributes: ['firstName', 'lastName', 'email', 'role', 'posts'],
  posts: {
    ref: true
  }
};

var deserialize = {
  keyForAttribute: 'dash-case'
};

var populatedSerialize = _clone(serialize);
populatedSerialize.posts = {
  ref: '_id',
  attributes: ['title', 'content', 'html', 'published']
};
var populatedSerializer = new JSONAPISerializer('users', populatedSerialize);

module.exports = restFactory('users', Users, serialize, deserialize, {
  load: function(req, id, callback) {
    var query = Users.findById(id);
    query.populate('posts');
    query.exec(function(error, item) {
      if (error) return callback(new JSONAPIError({
        status: 400,
        title: error.name || 'Database Request Failed',
        detail: error.message || 'Unable to handle requested database operation.'
      }));

      if (!item) return callback(new JSONAPIError({
        status: 404,
        title: 'Not found',
        detail: 'Resource ' + id + ' does not exist.'
      }));

      callback(null, item);
    });
  },

  read: function(req, res) {
    res.json(populatedSerializer.serialize(req['users']));
  }
});