var createError = require('http-errors');
var express = require('express');
var path = require('path');
var logger = require('morgan');
// var cookieParser = require('cookie-parser');
// const session = require('express-session');
// const FileStore = require('session-file-store')(session);
const passport = require('passport');
// const authenticate = require('./authenticate');
const config = require('./config')

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
const campsiteRouter = require('./routes/campsiteRouter');
const promotionRouter = require('./routes/promotionRouter');
const partnerRouter = require('./routes/partnerRouter');
const uploadRouter = require('./routes/uploadRouter');

const mongoose = require('mongoose');


// const url = 'mongodb://localhost:27017/nucampsite';
const url = config.mongoUrl;
const connect = mongoose.connect(url, {
  useCreateIndex: true,
  useFindAndModify: false,
  useNewUrlParser: true,
  useUnifiedTopology: true
});

connect.then(() => console.log('Connected correctly to server'),
  err => console.log(err)
);

var app = express();
app.all('*',(req,res,next)=>{
  if(req.secure){
    return next();
  }else{
    console.log(`Redirecting to: https://${req.hostname}:${app.get('secPort')}${req.url}`);
    res.redirect(301,`https://${req.hostname}:${app.get('secPort')}${req.url}`);
  }
})

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// app.use(cookieParser('12345-67890-09876-54321'));



// function auth(req, res, next) {
//   console.log(req.session);

//   if (!req.session.user) {
//       const authHeader = req.headers.authorization;
//       if (!authHeader) {
//           const err = new Error('You are not authenticated!');
//           res.setHeader('WWW-Authenticate', 'Basic');
//           err.status = 401;
//           return next(err);
//       }

//       const auth = Buffer.from(authHeader.split(' ')[1], 'base64').toString().split(':');
//       const user = auth[0];
//       const pass = auth[1];
//       if (user === 'admin' && pass === 'password') {
//           req.session.user = 'admin';
//           return next(); // authorized
//       } else {
//           const err = new Error('You are not authenticated!');
//           res.setHeader('WWW-Authenticate', 'Basic');
//           err.status = 401;
//           return next(err);
//       }
//   } else {
//       if (req.session.user === 'admin') {
//           return next();
//       } else {
//           const err = new Error('You are not authenticated!');
//           err.status = 401;
//           return next(err);
//       }
//   }
// };

// function auth(req, res, next) {
//     if (!req.signedCookies.user) {
//         const authHeader = req.headers.authorization;
//         if (!authHeader) {
//             const err = new Error('You are not authenticated!');
//             res.setHeader('WWW-Authenticate', 'Basic');
//             err.status = 401;
//             return next(err);
//         }

//         const auth = Buffer.from(authHeader.split(' ')[1], 'base64').toString().split(':');
//         const user = auth[0];
//         const pass = auth[1];
//         if (user === 'admin' && pass === 'password') {
//             res.cookie('user', 'admin', {signed: true});
//             return next(); // authorized
//         } else {
//             const err = new Error('You are not authenticated!');
//             res.setHeader('WWW-Authenticate', 'Basic');
//             err.status = 401;
//             return next(err);
//         }
//     } else {
//         if (req.signedCookies.user === 'admin') {
//             return next();
//         } else {
//             const err = new Error('You are not authenticated!');
//             err.status = 401;
//             return next(err);
//         }
//     }
// };

// function auth(req, res, next) {
//   console.log(req.session);

//   if (!req.session.user) {
//     const err = new Error('You are not authenticated!');
//     err.status = 401;
//     return next(err);
//   } else {
//     if (req.session.user === 'authenticated') {
//       return next();
//     } else {
//       const err = new Error('You are not authenticated!');
//       err.status = 401;
//       return next(err);
//     }
//   }
// };
// app.use(session({
//   name: 'session-id',
//   secret: '12345-67890-09876-54321',
//   saveUninitialized: false,
//   resave: false,
//   store: new FileStore()
// }));

app.use(passport.initialize());
// app.use(passport.session());


// function auth(req, res, next) {
//   console.log(req.user);

//   if (!req.user) {
//       const err = new Error('You are not authenticated!');                    
//       err.status = 401;
//       return next(err);
//   } else {
//       return next();
//   }
// }
// app.use(auth);

app.use('/', indexRouter);
app.use('/users', usersRouter);

app.use(express.static(path.join(__dirname, 'public')));

app.use('/campsites', campsiteRouter);
app.use('/promotions', promotionRouter);
app.use('/partners', partnerRouter);
app.use('/imageUpload',uploadRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
