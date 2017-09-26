var restFactory = require('../../middleware/rest');

var posts = [{
  id: "123",
  title: string = "My First Blog Post",
  content: string = "... brevity is the soul of wit...",
  published: new Date(),
  author: {
    id: "1",
    firstName: "Nicholas",
    lastName: "McClay",
    email: "nmcclay@nickmcclay.com"
  }
}];

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

module.exports = restFactory('posts', posts, serialize, deserialize);