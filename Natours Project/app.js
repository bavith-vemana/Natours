const express = require('express');
const AppError = require('./utils/appError');
const errorController = require('./controllers/errorController');
const fs = require('fs');
const app = express();
const path = require('path');

const morgan = require('morgan');
const { execPath } = require('process');
const { tourRouter } = require('./routes/tourRoutes');
const { userRouter } = require('./routes/userRoutes');
const { reviewRouter } = require('./routes/reviewRoutes');
const { viewRouter } = require('./routes/viewRoutes');
const { bookingRouter } = require('./routes/bookingRoutes');
const rateLimit = require('express-rate-limit');
const { time } = require('console');
const cookieParser = require('cookie-parser');

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  // console.log(req.cookies);

  // console.log('middle ware-1');
  next();
});
const options = {
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many request from this IP! Please Try Again',
};
const limiter = rateLimit(options);

app.use('/', viewRouter);

app.use('/api', limiter);

app.use('/api/v1/tours', tourRouter);

app.use('/api/v1/users', userRouter);

app.use('/api/v1/reviews', reviewRouter);

app.use('/api/v1/bookings', bookingRouter);
app.get('/.well-known/appspecific/com.chrome.devtools.json', (req, res) => {
  res.status(204).send(); // 204 = No Content
});

app.all(/.*/, (req, res, next) => {
  const err = new AppError(
    `Can't find ${req.originalUrl} on this server!`,
    404,
  );
  next(err);
});

app.use(errorController);

module.exports = { app };
