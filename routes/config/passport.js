+function(undefined) {
"use strict";

let mongoose = require("mongoose")
,   _        = require("lodash")
,   passport = require("passport");

let FB = require("fb");

let LocalStrategy    = require("passport-local").Strategy
,   FacebookStrategy = require("passport-facebook").Strategy
,   TwitterStrategy  = require("passport-twitter").Strategy
,   GoogleStrategy   = require("passport-google-oauth").OAuth2Strategy;

let configAuth   = require("./auth")
,   UserUtil     = require("../utils/UserUtil")
,   EmailService = require("../service/email")
,   User         = mongoose.model("User");

module.exports = {
  
  /**
   * Configures passport setting for the application.
   * 
   * @param  {Application} app the express application.
   */
  configure: function(app) {
    
    // Serialize sessions
    passport.serializeUser(function(user, done) {
      done(null, user.id);
    });

    passport.deserializeUser(function(id, done) {
      User.findOne({ _id: id }, function(err, user) {
        done(err, user);
      });
    });

    /**********************************************************
    *                      Local Strategy                     *
    **********************************************************/

    /**
     * Local strategy definition.
     * Uses email as username field when validating.
     */
    passport.use(new LocalStrategy({
      usernameField: "email",
      passwordField: "password"
    }, function(email, password, done) {
      console.log(email, password);

      process.nextTick(function () {
        
        // convert email to lower case
        User.findOne({ email: email.toLowerCase() }, function(err, user) {
          if (err) {
            done(err);
          } else if (!user || !user.authenticate(password)) {
            done(null, null, {
              message: "Your email and password combination is invalid."
            });
          } else {
            done(null, user);
          }
        });
      });
    }));

    /**********************************************************
    *                    Facebook Strategy                    *
    **********************************************************/
    passport.use(new FacebookStrategy({

      // pull in our app id and secret from our auth.js file
      clientID         : configAuth.facebookAuth.clientID,
      clientSecret     : configAuth.facebookAuth.clientSecret,
      callbackURL      : configAuth.facebookAuth.callbackURL,
      passReqToCallback: true,
      profileFields    : ["id", "emails", "photos", "name"],
      scope            : ["email"]
    }, function (req, token, refreshToken, profile, done) {

      process.nextTick(function () {
        // check if the user has logged in
        if (!req.user) {
          
          // find the user in the database based on their facebook id
          User.findOne({ "facebook.id" : profile.id }, function (err, user) {

            // if there is an error, stop everything and return that
            // ie an error connecting to the database
            if (err) {
              return done(err);            
            }

            // if the user is found, then log them in
            if (user) {
              user.facebook.token = token;
              
              user.save(function(err) {
                if (err) {
                  return done(err);
                }
                
                return done(null, user); // user found, return that user                
              });
              
            } else {
              // if there is no user found with that facebook id, create them
              let newUser = new User();

              // set all of the facebook information in our user model
              newUser.facebook.id       = profile.id;
              newUser.facebook.token    = token;
              newUser.facebook.fullname = 
                profile.name.givenName + ' ' + profile.name.familyName;
              newUser.facebook.nickname = profile.name.givenName;
              
              // create a user with facebook email
              newUser.email    = profile.emails[0].value;
              newUser.username = newUser.facebook.nickname;
              newUser.photo    = profile.photos[0].value;
              
              // save our user to the database
              newUser.save()
              .then(function() {
                return EmailService.sendFacebookRegister(newUser.email);
              })
              .then(function() {
                return done(null, newUser);
              })
              .catch(function(err) {
                return done(err);
              });
                
            }

          });
        } else {
          let user = req.user
          ,   newUser = new User();
          
          if (_.isEmpty(user.email)) {
            return done(new Error("User needs to log in using email."))
          }
          
          // preserve the local username, email and password
          newUser.username = user.username;
          newUser.password = user.password;
          newUser.email    = user.email;
          
          // update the photo if not exist
          newUser.photo = user.photo || profile.photos[0].value;

          newUser.facebook.id       = profile.id;
          newUser.facebook.token    = token;
          newUser.facebook.fullname = 
            profile.name.givenName + ' ' + profile.name.familyName;
          newUser.facebook.nickname = profile.name.givenName;
          
          UserUtil.facebook.remove(profile.id)
          .then(function() {
            return UserUtil.local.remove(user._id);
          })
          .then(newUser.save)
          .then(function() {
            done(null, newUser);
          })
          .catch(function(err) {
            done(err);
          });
          
        }

        
      });
    }));

    /**********************************************************
    *                     Twitter Strategy                    *
    **********************************************************/
    passport.use(new TwitterStrategy({

      consumerKey     : configAuth.twitterAuth.consumerKey,
      consumerSecret  : configAuth.twitterAuth.consumerSecret,
      callbackURL     : configAuth.twitterAuth.callbackURL

    },
    function (token, tokenSecret, profile, done) {
      // make the code asynchronous
      // User.findOne won't fire until we have all our data back from Twitter
      process.nextTick(function() {

        User.findOne({ "twitter.id" : profile.id }, function (err, user) {

          // if there is an error, stop everything and return that
          // ie an error connecting to the database
          if (err) {
            return done(err);            
          }

          // if the user is found then log them in
          if (user) {
            return done(null, user); // user found, return that user
          } else {
            // if there is no user, create them
            let newUser                 = new User();

            // set all of the user data that we need
            newUser.twitter.id          = profile.id;
            newUser.twitter.token       = token;
            newUser.twitter.username    = profile.displayName;
            newUser.photo       = profile.photos[0].value;

            // save our user into the database
            newUser.save(function(err) {
              if (err) {
                throw err;
              }
              
              return done(null, newUser);
            });
          }
        });
      });
    }));


    /**********************************************************
    *                      Google Strategy                    *
    **********************************************************/
    passport.use(new GoogleStrategy({

      clientID        : configAuth.googleAuth.clientID,
      clientSecret    : configAuth.googleAuth.clientSecret,
      callbackURL     : configAuth.googleAuth.callbackURL,

    },
    function (token, refreshToken, profile, done) {

      // make the code asynchronous
      // User.findOne won't fire until we have all our data back from Google
      process.nextTick(function() {
        // try to find the user based on their google id
        User.findOne({ "google.id" : profile.id }, function (err, user) {
          if (err) {
            return done(err);            
          }

          if (user) {

            // if a user is found, log them in
            return done(null, user);
          } else {
            // if the user isnt in our database, create a new user
            let newUser              = new User();

            // set all of the relevant information
            newUser.google.id        = profile.id;
            newUser.google.token     = token;
            newUser.email     = profile.emails[0].value; // pull the first email
            newUser.google.fullname  = profile.displayName;
            newUser.google.nickname  = profile.name.givenName;
            newUser.photo     = profile._json.picture;

            // save the user
            newUser.save(function(err) {
              if (err) {
                throw err;                
              }
              
              return done(null, newUser);
            });
          }
        });
      });
    }));
    
    app.use(passport.initialize());
    
    app.use(passport.session());
  }
};

}();
