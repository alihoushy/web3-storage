const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

var createError = require('http-errors');
var express = require('express');
var cookieParser = require('cookie-parser');
var morgan = require('morgan');
const fs = require('fs');
const cors = require('cors');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var moralisRouter = require('./routes/moralis');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// create a write stream (in append mode)
var accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' });

// setup the logger
app.use(morgan('combined', { stream: accessLogStream }));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// include before all routes
app.use(cors({
  origin: '*',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  optionsSuccessStatus: 204
}));
app.options('*', cors());

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/moralis', moralisRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // return error
  res.status(err.status || 500).json({ message: err.message, stack: err.stack, file: null });
});

module.exports = app;
