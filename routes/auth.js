"use strict";

let express  = require("express")
,   passport = require("passport")
,   crypto   = require("crypto")
,   _        = require("lodash")
,   router   = express.Router();

let User    = require("./api/user")
,   session = require("./api/session");

let EmailService = require("./service/email");

let CustomError = require("./utils/CustomError");

router.get("/session", session.get);
router.post("/session", session.create);
router.delete("/session", session.delete);

/********************************************************
 *                      User Routes                     *
 ********************************************************/
router.route("/user")
/**
 * Global logic for path '/auth/user'.
 */
.all(function(req, res, next) {

  let userId = req.query.id || req.params.id;
  
  if (_.isString(userId)) {
    req.userId = userId;
  }
  
  next();
})
/**
 * Gets a specific user info by id.
 */
.get(function(req, res, next) {
  let userId = req.userId;
  
  if (!_.isString(userId)) {
    return next(new CustomError(400, "User id is not defined."));
  }

  User.get(userId).then(function(user) {
    res.status(200).send(user);
  }).catch(function(err) {
    console.log(err.stack);
    
    next(new CustomError(500, "Internal error."));
  });

})
/**
 * Adds a new user.
 */
.post(function(req, res, next) {
  let rawData;
  
  if (!req.body.user) {
    return next(new CustomError(400, "User info undefined."));
  }
  
  try {
    rawData = JSON.parse(req.body.user);
  } catch (err) {
    console.log(err.stack);
    
    return next(new CustomError(400, "Malformed JSON."));
  }
  
  User.add(rawData).then(function(newUser) {
    req.logIn(newUser, function(err) {
      if (err) {
        reject(err);
      } else {
        res.status(200).json(newUser);
      }
    });
  }).catch(function(err) {
    if (err.status === 422) {
      next(err);
    } else {
      console.log(err.stack);
      
      next(new CustomError(500, "Internal error."));      
    }
  });
  
})
/**
 * Updates a specific user by id.
 */
.put(function(req, res, next) {
  let userId   = req.userId
  ,   newValue = JSON.parse(req.body.user);

  if (!_.isString(userId)) {
    return next(new CustomError(400, "User id is not defined."));
  }
  
  if (!_.isObject(newValue)) {
    return next(new CustomError(400, "New user info not specified!"));
  }
  
  User.update(userId, newValue).then(function(user) {
    res.status(200).json(user);
  }).catch(function(err) {
    console.log(err.stack);
    
    next(new CustomError(500, "Internal error."));
  });
})
/**
 * Deletes a specific user by id.
 */
.delete(function(req, res, next) {
  let userId = req.userId;
  
  if (!_.isString(userId)) {
    return next(new CustomError(400, "User id is not defined."));
  }
  
  User.remove(id).then(function(removedUser) {
    res.status(200).json(removedUser);
  }).catch(function(err) {
    console.log(err.stack);
    
    next(new CustomError(400, "Internal error."));
  });
});


/********************************************************
 *                 Password Reset Routes                *
 ********************************************************/
router.post("/forgot", function(req, res, next) {
  let email = req.body.email
  ,   token = crypto.randomBytes(24).toString("hex");
  
  let newProps = {
    resetToken: token,
    resetExpire: Date.now() + 3600000
  };
  
  User.updateByEmail(email, newProps)
    .then(function(user) {
      if (_.isEmpty(user)) {
        EmailService.sendUnregistered(email).then(() => {
          res.status(200).end();
        });
      } else {
        let link = req.protocol + "://" + req.headers.host + "/#/resetPassword?token=" + token;
        
        EmailService.sendResetPassword(email, link).then(() => {
          res.status(200).end();
        });
      }
    })
    .catch(function(err) {
      console.log(err);
      
      next(new CustomError(400, "Internal error."));
    });
});

router.post("/reset", function(req, res, next) {
  let token = req.query.token
  ,   password = req.body.password;
  
  User.resetPasswordWithToken(token, password)
    .then(function(user) {
      if (_.isEmpty(user)) {
        return next(new CustomError(400, "Password reset token is invalid or has expired."));
      } else {
        return res.status(200).json({message: "Password successfully updated."});
      }
    })
    .catch(function(err) {
      console.log(err);
      
      next(new CustomError(400, "Internal error."));
    });
});


/**********************************************************
*                     Facebook Routes                     *
**********************************************************/

router.get("/facebook", passport.authenticate("facebook", {
  authType: "reauthenticate"
}));

router.get("/facebook/callback", function(req, res, next) {
  passport.authenticate("facebook", function(err, user) {
    if (err) {
      console.log(err);
      return res.end("err");      
    }
    
    req.logIn(user, function (err) {
      if (err) {
        console.log(err);
        res.end("err");
      } else {
        if (user.registerLocally) {
          res.redirect("/");          
        } else {
          res.redirect("/#/completeLocal");
        }
      }
    });
  })(req, res, next);
});


/**********************************************************
*                     Twitter Routes                      *
**********************************************************/
// router.get('/twitter', passport.authenticate("twitter"));
//
// router.get('/twitter/callback', function (req, res, next) {
//   passport.authenticate('twitter', function (err, user) {
//     if (err)
//     res.end(err);
//     req.logIn(user, function (err) {
//       if (err) {
//         console.log(err);
//         res.end(err);
//       }
//       else {
//         res.redirect("/");
//       }
//     });
//   })(req, res, next);
// });
//


/**********************************************************
*                      Google  Routes                     *
**********************************************************/
// router.get('/google', passport.authenticate('google', { scope : ['profile', 'email'] }));
//
// router.get('/google/callback', function (req, res, next) {
//   passport.authenticate('google', function (err, user) {
//     if (err)
//     res.end(err);
//     req.logIn(user, function (err) {
//       if (err) {
//         console.log(err);
//         res.end(err);
//       }
//       else {
//         res.redirect("/");
//       }
//     });
//   })(req, res, next);
// });

module.exports = router;