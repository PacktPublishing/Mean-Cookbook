var restFactory = require('../../middleware/rest');
var Posts = require('../../models/posts');
var _pick = require('lodash/pick');

var serialize = {
  attributes: ['title', 'content', 'published', 'author'],

  author: {
    ref: function (user, author) {
      return author.id;
    },
    attributes: ['firstName', 'lastName', 'email']
  }
};

var deserialize = {
  keyForAttribute: 'dash-case'
};

module.exports = restFactory('posts', Posts, serialize, deserialize, function(req, res, next) {
  req.query = _pick(req.query, ['_size', '_page', '_search', 'title', 'published']);
  if (req.query.published) {
    try {
      req.query.published = JSON.parse(req.query.published);
    } catch(error) {
      console.error('unable to parse published date format');
    }
  }
  next();
});