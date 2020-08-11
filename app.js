const path = require('path');
const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const cookieParser = require('cookie-parser');
const compression = require('compression');
const cors = require('cors');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const tourRoute = require('./routes/tourRoutes');
const userRoute = require('./routes/userRoutes');
const reviewRoute = require('./routes/reviewRoutes');
const bookingRoute = require('./routes/bookingRoutes');
const viewRoute = require('./routes/viewRoutes');

//Express starts from here

const app = express();
// To enbale proxy trsut in production mode
app.enable('trust proxy');

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// 1) MIDDLEWARE
app.use(cors());
app.options('*', cors());
app.use(express.static(path.join(__dirname, 'public')));
app.use(helmet());

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'To many request from the IP !Please try again after 1 hr',
});
app.use('/api', limiter);

//Middleware to read data from the body
app.use(express.json());
app.use(cookieParser());
app.use(mongoSanitize());

app.use(xss());

app.use(
  hpp({
    whitelist: [
      'duration',
      'ratingsAverage',
      'ratingsQuantity',
      'maxGroupSize',
      'price',
    ],
  })
);

app.use(compression());

//  3) ROUTE
app.use('/', viewRoute);
app.use('/api/v1/tours', tourRoute);
app.use('/api/v1/users', userRoute);
app.use('/api/v1/reviews', reviewRoute);
app.use('/api/v1/bookings', bookingRoute);

app.all('*', (req, res, next) => {
  // console.log(req.cookies);
  next(
    new AppError(
      `cannot load ${req.originalUrl} becz its not part of server`,
      404
    )
  );
});

app.use(globalErrorHandler);

module.exports = app;
