var restFactory = require('../../middleware/rest');
var Posts = require('../../models/posts');
var _pick = require('lodash/pick');

var serialize = {
  transform: function(post) {
    return post.toObject();
  },
  id: '_id',
  typeForAttribute: function(attribute) {
    if (attribute === 'author') return 'users';
  },
  attributes: ['title', 'content', 'published', 'author', 'html'],
  author: {
    ref: '_id',
    attributes: ['firstName', 'lastName', 'email']
  }
};

var deserialize = {
  keyForAttribute: 'dash-case'
};

module.exports = restFactory('posts', Posts, serialize, deserialize, {

  middleware: function(req, res, next) {
    req.query = _pick(req.query, ['_size', '_page', '_search', 'title', 'published']);
    if (req.query.published) {
      try {
        req.query.published = JSON.parse(req.query.published);
      } catch(error) {
        console.error('unable to parse published date format');
      }
    }
    next();
  }

});