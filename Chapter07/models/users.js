var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var blogSchema = new Schema({
  firstName:  String,
  lastName: String,
  email:   String,
  password: [{ body: String, date: Date }],
  isAdmin: Boolean,
});