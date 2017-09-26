var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var showdown  = require('showdown');
var xssFilter = require('showdown-xss-filter');
var converter = new showdown.Converter({extensions: [xssFilter]});
converter.setOption('requireSpaceBeforeHeadingText', 'true');

function markdownValidator (value) {
  var regex = new RegExp(/^#*\s/);
  return !regex.test(value);
}

var postSchema = new Schema({
  title:  { type: String, index: 'text', required: true, minlength: 5, maxlength: 64 },
  content: { type: String, required: true, validate: [ markdownValidator, 'cannot start post content with a title' ]},
  published: { type: Date, default: Date.now},
  author: {
    _id: Schema.Types.ObjectId,
    firstName: String,
    lastName: String,
    email: String
  }
});

postSchema.virtual('html').get(function () {
  return converter.makeHtml(this.content);
});

postSchema.set('toObject', { getters: true });

module.exports = mongoose.model('post', postSchema);