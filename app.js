var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const cors = require('cors');
var mongoDB = require('./config/db')

//DB Config
require('./config/db');


mongoDB.connectToDB();

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(require('./routes/index'));
app.use(require('./routes/twitter').router);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
  res.render(path.join(__dirname, '../views/error.ejs'));
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

port = 3200;

const server = app.listen(port, () => {
  console.log(`listening: http://127.0.0.1:${port}`);
});

let io = require('socket.io')(server);
require('./models/io').io(io)

module.exports = app;
