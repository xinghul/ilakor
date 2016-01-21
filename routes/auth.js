+function(undefined) {
"use strict";

var express  = require("express")
,   passport = require("passport")
,   router   = express.Router();

var user    = require("./api/user")
,   session = require("./api/session");

router.post("/users", user.create);
router.get("/users/:userId", user.get);
router.get("/users", user.getAll);

router.get("/session", session.get);
router.post("/session", session.create);
router.delete("/session", session.delete);

// =====================================
// Facebook routes =====================
// =====================================
// router.get('/facebook', passport.authenticate('facebook', {
//   scope: "email",
//   display: "popup"
// }));
//
// router.get('/facebook/callback', function (req, res, next) {
//   passport.authenticate('facebook', function (err, user) {
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
// // =====================================
// // Twitter routes ======================
// // =====================================
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
// // =====================================
// // Google routes =======================
// // =====================================
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

}();
