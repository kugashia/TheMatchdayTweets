var createError = require('http-errors');
var express = require('express');
var path = require('path');
let q = require('q');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const cors = require('cors');

//DB Config
require('./config/db');


//var indexRouter = require('./routes/index.js');
//var usersRouter = require('./routes/users.js');
//var tweetsRouter = require('./routes/tweets.js');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(require('./routes/index'));
app.use(require('./routes/users.js'));
app.use(require('./routes/tweets.js'));

app.listen(3400, function(){
  console.log('App listning on port 3400!');
})

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

module.exports = app;
