"use strict";

let mongoose = require("mongoose")
,   _        = require("lodash")
,   bcrypt   = require('bcrypt-nodejs');

let UserSchema = new mongoose.Schema({

  email   : { 
    type: String, 
    lowercase: true,
    trim: true 
  },
  username: String,
  password: String,
  photo: String,
  registerLocally: {
    type: Boolean,
    default: false
  },

  facebook: {
    id      : String,
    token   : String,
    fullname: String,
    nickname: String
  },

  twitter: {
    id      : String,
    token   : String,
    username: String
  },

  google: {
    id      : String,
    token   : String,
    fullname: String,
    nickname: String
  },
  
  resetToken: {
    type: String,
    required: false
  },
  resetExpire: {
    type: Date,
    required: false
  },

  isAdmin: {
    type: Boolean,
    default: false
  }

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

// UserSchema.path("email").validate(function(email) {
//   let emailRegex = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
//   return emailRegex.test(email);
// }, "The specified email is invalid.");
// 
// UserSchema.path("email").validate(function(email, respond) {
//   mongoose.models["User"].findOne({ email: email }, function(err, user) {
//     if (err) {
//       throw err;
//     }
//     if (user && !user.registerLocally) {
//       return respond(false);
//     }
//     respond(true);
//   });
// }, "The specified email is already in use.");
// 
// UserSchema.path("local.username").validate(function(username, respond) {
//   mongoose.models["User"].findOne({ "local.username": username }, function(err, user) {
//     if (err) {
//       throw err;
//     }
//     if (user) {
//       return respond(false);
//     }
//     respond(true);
//   });
// }, "The specified username is already in use.");

let encryptPassword = function(password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

UserSchema.pre("save", function(next) {

  // use this hack to check if the password is encrypted
  if (!_.isEmpty(this.password) && this.password.length !== 60) {
    this.password = encryptPassword(this.password);
    
    this.registerLocally = true;
  }

  next();
});

UserSchema.methods.authenticate = function(plainText) {
  return bcrypt.compareSync(plainText, this.password);
};

mongoose.model("User", UserSchema);
