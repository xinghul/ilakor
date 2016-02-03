+function(undefined) {
  "use strict";

  var request     = require("request")
  ,   ReactCookie = require("react-cookie")
  ,   Promise     = require("bluebird");

  var AppDispatcher = require("../dispatcher/AppDispatcher")
  ,   AuthConstants = require("../constants/AuthConstants");


  var AuthActions = {

    toggleMode: function() {
      AppDispatcher.handleAction({
        actionType: AuthConstants.TOGGLE_MODE
      });
    },

    toggleModal: function() {
      AppDispatcher.handleAction({
        actionType: AuthConstants.TOGGLE_MODAL
      });
    },

    inputUsername: function(username) {
      AppDispatcher.handleAction({
        actionType: AuthConstants.INPUT_USERNAME,
        username: username
      });
    },

    inputEmail: function(email) {
      AppDispatcher.handleAction({
        actionType: AuthConstants.INPUT_EMAIL,
        email: email
      });
    },

    inputPassword: function(password) {
      AppDispatcher.handleAction({
        actionType: AuthConstants.INPUT_PASSWORD,
        password: password
      });
    },

    userLogIn: function(user) {
      var deferred = Promise.defer();

      request.post({
        url: "http://localhost:3001/auth/session",
        form: {
          "email": user.email,
          "password": user.password
        }
      }, function(err, res) {
        if (err) {
          deferred.reject(err);
        } else {
          if (res.statusCode === 200) {
            var response = JSON.parse(res.body)
            ,   newUser  = response.user
            ,   token    = response.token;
            
            // save jwt token into the cookie
            ReactCookie.save("token", token);

            AppDispatcher.handleAction({
              actionType: AuthConstants.RECEIVED_USER,
              user: newUser
            });

            deferred.resolve();
          } else {
            deferred.reject(JSON.parse(res.body));
          }
        }
      });

      return deferred.promise;

    },

    userSignUp: function(user) {
      var deferred = Promise.defer();

      // XXX check if all the fields are non-empty
      request.post({
        url: "http://localhost:3001/auth/users",
        form: {
          "local.email": user.email,
          "local.username": user.username,
          "local.password": user.password
        }
      }, function(err, res) {
        if (err) {
          deferred.reject(err);
        } else {
          if (res.statusCode === 200) {
            var newUser = JSON.parse(res.body);

            AppDispatcher.handleAction({
              actionType: AuthConstants.RECEIVED_USER,
              user: newUser
            });

            deferred.resolve();
          } else {
            deferred.reject(JSON.parse(res.body));
          }
        }
      });

      return deferred.promise;

    },

    logInFromCookie: function() {
      var user = ReactCookie.load("user");

      if (user) {
        AppDispatcher.handleAction({
          actionType: AuthConstants.RECEIVED_USER,
          user: user
        });
      }
    },

    removeUserFromCookie: function() {
      var deferred = Promise.defer();

      request.del({
        url: "http://localhost:3001/auth/session"
      }, function(err, res) {
        if (err) {
          deferred.reject(err);
        } else {
          if (res.statusCode === 200) {
            ReactCookie.remove("user");
            
            AppDispatcher.handleAction({
              actionType: AuthConstants.RECEIVED_USER,
              user: {}
            });

            deferred.resolve();
          } else {
            deferred.reject(res.body);
          }
        }
      });

      return deferred.promise;
    }

  };

  module.exports = AuthActions;

}();
