var express = require('express');
var router = express.Router();

// 追記
var passport = require("passport");
// ここまで

/* GET home page. */
router.get('/', function(req, res, next) {
  console.log(req.user)
  res.render('index', { user : req.user });
});

// 追記
router.get("/login", function(req,res){
  res.render("login", {user: req.user});
});

router.post("/login", passport.authenticate("local",
  {successRedirect: "/",
  failureRedirect: "/login",
  session: true}));

router.post("/signUp", function(req,res){
  console.log(req);
  connection.query("insert into login", {name: req.username, password: req.password}, function(error, response){
    if(error) throw error;
    console.log(response);
    res.render("login", {user:req.user});
  });
  

});

router.get("/logout", function(req,res){
  req.logout();
  res.redirect("/");
})
//追記ここまで

module.exports = router;
