const mongoose = require('mongoose'),
	bcrypt = require('bcryptjs'),
	Schema = mongoose.Schema;

// USERS SCHEMA
const UserSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    require: true,
    select: false
  }
});

// HASH USER PASSWORD BEFORE SAVE
UserSchema.pre('save', function(next)  {
  const user = this;
  // bycrypt.hash(user.password, null, null, function(err, hash) {
  //   if (err) throw err;
  //   user.password = hash;
  //   next();
  // })
  bcrypt.genSalt(10, function(err, salt) {
    bcrypt.hash(user.password, salt, function(err, hash) {
      // Store hash in your password DB.
      if (err) throw err;
      user.password = hash;
      next();
    });
  });
});

// PASSWORD COMPARISON METHOD
UserSchema.methods.comparePassword = function(password) {
  return bcrypt.compareSync(password, this.password);
}


UserSchema.methods.usernameExist = function(username, cb){
  return this.model('User').findOne({ username }, 
    function(err, user){
      if(err) throw err;

      cb(user)
    });
}

// SESSION SCHEMA
const FileSchema = new Schema({
  owner: {
    type: String,
    required:  true,
  },
  fileid: {
    type: String,
    required: true
  },
  fileurl: {
    type: String,
    required:  true,
  },
  is_removed: {
    type: Boolean,
    default: false,
  }
});

module.exports = {
  User: mongoose.model('User', UserSchema),
  File: mongoose.model('File', FileSchema),
};




// var schema = kittySchema = new Schema(..);
//
// schema.method('meow', function () {
//   console.log('meeeeeoooooooooooow');
// })
