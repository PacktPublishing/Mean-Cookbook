var faker = require('faker');
var Post = require('./models/posts');
var User = require('./models/users');

var makePost = function() {
  var markdown = faker.lorem.sentences();
  markdown += "## " + faker.lorem.sentence() + "\n";
  markdown += "[" + faker.lorem.words() + "](" +  faker.internet.url() + ")\n";

  return new Post({
    title: faker.lorem.words(),
    content: markdown,
    published: faker.date.past(),
  });
};

var makeUser = function() {
  return new User({
    firstName: faker.name.firstName(),
    lastName: faker.name.lastName(),
    email: faker.internet.email(),
    password: faker.internet.password(),
    role: 'author'
  });
};

module.exports = {
  generateAuthorAndPosts: function(postCount) {
    var user = makeUser();

    let posts = [];
    for (var i=0; i < postCount; i++) {
      var post = makePost();
      post.author = user;
      posts.push(post);
    }

    user.posts = posts;
    user.save().then(function(user) {
      console.log('created new author: ' + user.email);
      return Post.insertMany(posts).then(function() {
        console.log('created ' + postCount + ' new posts');
      }).catch(function(error) {
        throw error;
      });
    }).catch(function(error) {
      throw error;
    });
  },

  generateAdmin: function() {
    var admin = new User({
      firstName:  faker.name.firstName(),
      lastName: faker.name.lastName(),
      email: 'nmcclay@nickmcclay.com',
      password: 'Secret',
      role: 'admin'
    });

    return admin.save().then(function(user) {
      console.log("created new admin: " + user.email);
    }).catch(function(error) {
      throw error;
    });
  }
};