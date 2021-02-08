var createError = require('http-errors');
var express = require('express');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser')

var ticketsRouter = require('./routes/tickets');

var app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json())
app.use(cookieParser());

app.use('/tickets', ticketsRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // return the error message
  res.json({
    error: {
      message: err.message,
      code: err.status
    }
  })
});

module.exports = app;
