var express = require('express');
var router = express.Router();

// 追記
var passport = require("passport");
// ここまで

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { user: req.user });
});

// 追記
router.get("/login", function(req,res){
  res.render("login", {user: req.user});
});

router.post("/login", passport.authenticate("local",
  {successRedirect: "/",
  failureRedirect: "/login",
  session: false}));

router.get("/logout", function(req,res){
  req.logout();
  res.redirect("/");
})
//追記ここまで

module.exports = router;
