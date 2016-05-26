+function(undefined) {
"use strict";

let mongoose = require("mongoose")
,   _        = require("underscore")
,   passport = require("passport");

let FB = require("fb");

let LocalStrategy    = require("passport-local").Strategy
,   FacebookStrategy = require("passport-facebook").Strategy
,   TwitterStrategy  = require("passport-twitter").Strategy
,   GoogleStrategy   = require("passport-google-oauth").OAuth2Strategy;

let configAuth = require("./auth")
,   UserUtil   = require("../utils/UserUtil")
,   User       = mongoose.model("User");

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
        User.findOne({ "local.email": email.toLowerCase() }, function(err, user) {
          if (err) {
            done(err);
          } else if (!user) {
            done(null, null, {
              message: "Email is not registered."
            });
          } else if (!user.authenticate(password)) {
            done(null, null, {
              message: "Password is incorrect."
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
      scope            : ["email", "user_posts"]
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
              newUser.facebook.email    = profile.emails[0].value;
              newUser.facebook.photo    = profile.photos[0].value;
              
              // FB.setAccessToken(token);
              // 
              // 
              // FB.api("/" + profile.id + "/feed", function (res) {
              //   if(!res || res.error) {
              //    console.log(!res ? 'error occurred' : res.error);
              //    return;
              //   }
              //   
              //   console.dir(res);
              // });
              // 
              // FB.api("/me/feed", function (res) {
              //   if(!res || res.error) {
              //    console.log(!res ? 'error occurred' : res.error);
              //    return;
              //   }
              //   
              //   console.dir(res);
              // });

              // save our user to the database
              newUser.save(function (err) {
                if (err) {
                  throw err;                
                }

                // if successful, return the new user
                return done(null, newUser);
              });
            }

          });
        } else {
          let user = req.user
          ,   newUser = new User();
          
          if (_.isEmpty(user.local)) {
            return done(new Error("User needs to log in using email."))
          }
          
          newUser.local = user.local;

          newUser.facebook.id       = profile.id;
          newUser.facebook.token    = token;
          newUser.facebook.fullname = 
            profile.name.givenName + ' ' + profile.name.familyName;
          newUser.facebook.nickname = profile.name.givenName;
          newUser.facebook.email    = profile.emails[0].value;
          newUser.facebook.photo    = profile.photos[0].value;

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
            newUser.twitter.photo       = profile.photos[0].value;

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
            newUser.google.email     = profile.emails[0].value; // pull the first email
            newUser.google.fullname  = profile.displayName;
            newUser.google.nickname  = profile.name.givenName;
            newUser.google.photo     = profile._json.picture;

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
