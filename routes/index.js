var express = require('express');
var router = express.Router();
var domain = require('express-domain-middleware');
var bcrypt = require("bcrypt");
router.use(domain);

// bcrypt設定
const saltRounds = 10; // ストレッチング回数

// 追記
var mysql = require("/usr/local/lib/node_modules/mysql");
var connection = mysql.createConnection({
    host:"localhost",
    database:"rakutenapplication",
    user:"dbuser",
    password:"gladcubeogr"
});
var passport = require("passport");
// ここまで

/* GET home page. */
router.get('/', function(req, res, next) {
  console.log(req.user)
  res.render('index', { user : req.user });
});

// 追記
router.get("/login", function(req,res){
  res.render("login", {user: req.user, expressFlash: req.flash('failure')});
});



router.post("/login", passport.authenticate("local",
  {successRedirect: "/mainApplication",
  failureRedirect: "/login",
  failureFlash: 'Invalid username or password.',
  session: true}));

router.post("/signUp", function(req,res){
  console.log(req.body.username);
  connection.query("insert into login set ?", {name: req.body.username, password: bcrypt.hashSync(req.body.password, saltRounds)}, function(error, response){
    console.log("mysqling")
    if(error) {
      req.flash('notUniqueName', 'そのusernameは既に使われています。');
      res.render("login", {user: req.user, expressFlash: req.flash('notUniqueName')});
    }
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
