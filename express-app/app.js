var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const { exec } = require('child_process');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var formRouter  = require('./routes/form');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/form', formRouter);

app.post('/form', (req, res) => {
  const x = req.body.x;
  const y = req.body.y;

  const pythonPath = path.resolve(__dirname, '../python-env/env/python.exe');
  const scriptPath = path.resolve(__dirname, '../python-env/src/calculate.py');

  exec(`${pythonPath} ${scriptPath} ${x} ${y}`, (error, stdout, stderr) => {
    if (error) {
      console.error(`Execution error: ${error.message}`);
      return res.status(500).send('Error occurred during calculation');
    }

    if (stderr) {
      console.error(`stderr: ${stderr}`);
      return res.status(500).send('Error occurred during calculation');
    }

    const result = stdout.trim();
    res.render('pages/form', { x: x, y: y, result: result });
  });
});


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
