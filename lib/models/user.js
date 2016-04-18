"use strict";

let mongoose = require("mongoose")
/// XXX might use crypto instead
,   bcrypt   = require('bcrypt-nodejs');

let UserSchema = new mongoose.Schema({

  local: {
    email   : { 
      type: String, 
      lowercase: true,
      trim: true 
    },
    username: String,
    password: String
  },

  facebook: {
    id      : String,
    token   : String,
    email   : String,
    fullname: String,
    nickname: String,
    photo   : String
  },

  twitter: {
    id      : String,
    token   : String,
    username: String,
    photo   : String
  },

  google: {
    id      : String,
    token   : String,
    email   : String,
    fullname: String,
    nickname: String,
    photo   : String
  },

  isAdmin: Boolean

});

// UserSchema
//   .virtual("infoLocal")
//   .get(function () {
//     return {
//       "_id": this._id,
//       "username": this.local.username,
//       "isAdmin": this.isAdmin
//     }
//   });
//   
// UserSchema
//   .virtual("infoFacebook")
//   .get(function () {
//     return {
//       "_id": this._id,
//       "username": this.facebook.nickname,
//       "isAdmin": this.isAdmin
//     }
//   });
//   
// UserSchema
//   .virtual("infoGoogle")
//   .get(function () {
//     return {
//       "_id": this._id,
//       "username": this.google.nickname,
//       "isAdmin": this.isAdmin
//     }
//   });
//   
// UserSchema
//   .virtual("infoTwitter")
//   .get(function () {
//     return {
//       "_id": this._id,
//       "username": this.twitter.username,
//       "isAdmin": this.isAdmin
//     }
//   });

UserSchema.path("local.email").validate(function(email) {
  let emailRegex = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
  return emailRegex.test(email);
}, "The specified email is invalid.");

UserSchema.path("local.email").validate(function(email, respond) {
  mongoose.models["User"].findOne({ "local.email": email }, function(err, user) {
    if (err) {
      throw err;
    }
    if (user) {
      return respond(false);
    }
    respond(true);
  });
}, "The specified email is already in use.");

UserSchema.path("local.username").validate(function(username, respond) {
  mongoose.models["User"].findOne({ "local.username": username }, function(err, user) {
    if (err) {
      throw err;
    }
    if (user) {
      return respond(false);
    }
    respond(true);
  });
}, "The specified username is already in use.");

let encryptPassword = function(password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

UserSchema.pre("save", function(next) {
  if (this.isNew) {
    if ([null, undefined].indexOf(this.local.password) === -1) {
      this.local.password = encryptPassword(this.local.password);
    }
  }

  next();
});

UserSchema.methods.authenticate = function(plainText) {
  return bcrypt.compareSync(plainText, this.local.password);
};

mongoose.model("User", UserSchema);
