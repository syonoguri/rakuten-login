var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var http = require("http")
var flash = require('express-flash');
var bcrypt = require("bcrypt")

// app.jsから追記したもの(ログイン実装時１)
var passport = require("passport");
var LocalStrategy = require("passport-local").Strategy;
var session = require("express-session");
var mysql = require("/usr/local/lib/node_modules/mysql");
var connection = mysql.createConnection({
    host:"localhost",
    database:"rakutenapplication",
    user:"dbuser",
    password:"gladcubeogr"
});

// 追記ここまで（ログイン実装時１）

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var mainApplicationRouter = require('./routes/mainApplication')


var app = express();

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'views')));

// app.jsから追記したもの（ログイン実装時２）
app.use(session({ resave:false, saveUninitialized:false, secret: "passport login"}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy({
  usernameField: "username",
  passwordField: "password",
  passReqToCallback: true,
  session: true,
}, function(req, username, password, done){
  process.nextTick(function(){
    console.log("nowlogining")
    connection.query("select * from login;",function(err,users){
      if(err) {return done(err);}
      for(i=0; i<users.length; i++){
        if(users[i].name == username && users[i].password == bcrypt.hashSync(password, saltRounds)){
          console.log("success!");
          return done(null, username);
        }
      }
      req.flash('failure', 'ログイン失敗、ユーザー名またはパスワードが誤りです。');
      return done(null, false);
    // if(username === "test" && password === "test"){
    //   console.log("login!");
    //   return done(null,username)
    // } else {
    //   console.log("login error")
    //   return done(null, false, {message: "パスワードが正しくありません"})
    })
  });
}));
passport.serializeUser(function(user,done){
  console.log("serializeUser");
  done(null,user);
});

passport.deserializeUser(function(user,done){
  console.log("deserializeUser");
  done(null,user);
});
// 追記ここまで（ログイン実装時２）

app.use(flash());
app.use('/', indexRouter);
app.use("/mainApplication", mainApplicationRouter);
app.use('/users', usersRouter);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});


var server = http.createServer(app);
server.listen(3000);
module.exports = app;
