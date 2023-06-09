var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var showDBRouter = require('./routes/showDB');
var queryRouter = require('./routes/query');
var editRowRouter = require('./routes/editRow');
var deleteRowRouter = require('./routes/deleteRow');
var addRowRouter = require('./routes/addRow');
var sendQueryRouter = require('./routes/sendQuery');



var app = express();

const { Pool } = require("pg");
const dotenv = require("dotenv");
pool = null
dotenv.config();
const connectDb = async () => {
  try {
    pool = new Pool({
      user: process.env.PGUSER,
      host: process.env.PGHOST,
      database: process.env.PGDATABASE,
      password: process.env.PGPASSWORD,
      port: process.env.PGPORT,
      ssl: {
        rejectUnauthorized: false,
        sslmode: 'require'
      }
    });

    await pool.connect()
  } catch (error) {
    console.log(error)
  }
}

connectDb()

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/showDB', showDBRouter);
app.use('/query', queryRouter);
app.use('/editRow', editRowRouter);
app.use('/deleteRow', deleteRowRouter);
app.use('/addRow', addRowRouter);
app.use('/sendQuery', sendQueryRouter);

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
