var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var postSchema = new Schema({
  title:  { type: String, index: 'text' },
  content: String,
  published: { type: Date, default: Date.now }
});

module.exports = mongoose.model('post', postSchema);