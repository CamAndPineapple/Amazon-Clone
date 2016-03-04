var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
var crypto = require('crypto');
var Schema = mongoose.Schema;

var UserSchema = Schema({
  email: { type: String, unique: true, lowercase: true},
  password: String,

  profile: {
    name: { type: String, default: ''},
    picture: { type: String, default: ''}
  },

  address: String,
  history: [{
    date: Date,
    paid: { type: Number, default: 0},
    item: { type: Schema.Types.ObjectId, ref: 'Product'}
  }]
});


// Hash the password before storing to DB via 'pre' middleware
UserSchema.pre('save', function(next) {
  var user = this; /* now 'user' will refer to Instiated user */
  if (!user.isModified('password')) return next();
  // hash the password using clear-text and salt
  bcrypt.genSalt(10, function(err, salt) {
    if (err) return next(err);
    // if hash successful - save user's password as it
    bcrypt.hash(user.password, salt, null, function(err, hash) {
      if (err) return next(err);
      user.password = hash;
      next();
    }); /* 3rd param - null - is just a progress indicator */
  });
});

// Compare the password in DB with the one user entered
/* methods is just a way of creating your own method */
UserSchema.methods.comparePassword = function(password) {
  return bcrypt.compareSync(password, this.password);
}

UserSchema.methods.gravatar = function(size) {
  if (!this.size) size = 200;
  if (!this.email) return 'https://gravatar.com/avatar/?s' + size + '&d=retro';
  var md5 = crypto.createHash('md5').update(this.email).digest('hex');
  return 'https://gravatar.com/avatar/' + md5 + '?s=' + size + '&d=retro';
}

// mongoose.model is a contructor compiled from the Schema
// first arg is the singular name of the collection
// Mongoose automatically looks fo plural version of model name
module.exports = mongoose.model('User', UserSchema);
