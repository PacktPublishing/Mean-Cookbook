var bcrypt = require('bcrypt');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({
  firstName:  String,
  lastName: String,
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  role: String,
  posts: [{ type: Schema.Types.ObjectId, ref: 'post' }]
});

userSchema.pre('save', function(next) {
  var user = this;
  if (!user.isModified('password')) return next();

  bcrypt.genSalt(function(error, salt) {
    if (error) return next(error);

    bcrypt.hash(user.password, salt, function(error, hash) {
      if (error) return next(error);

      user.password = hash;
      next();
    });
  });
});

userSchema.methods.comparePassword = function(testPassword, callback) {
  bcrypt.compare(testPassword, this.password, function(error, isMatch) {
    if (error) return callback(error);
    callback(null, isMatch);
  });
};

module.exports = mongoose.model('user', userSchema);