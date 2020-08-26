const AppError = require('../utils/appError');

const handleCastErrorDB = (err) => {
  const message = `Inavlid ${err.path}:${err.value}`;
  return new AppError(message, 400);
};

const handleMongoError = (err) => {
  const message = `The email id ${err.keyValue.email} is already exits! please try another one`;
  return new AppError(message, 400);
};

const handleValidationError = (err) => {
  const errors = Object.values(err.errors).map((el) => el.properties.message);
  const message = `Invalid Input: ${errors.join('. ')}`;
  return new AppError(message, 400);
};
//normal way of assigning funcion
function handleJWTTokenError() {
  return new AppError('Invalid Token !Please login again', 401);
}
//No need to return if you have single line of code ES6
const handleTokenExpiredError = () =>
  new AppError('Token has been expired!Please login again');

const sendErrorDev = (err, req, res) => {
  if (req.originalUrl.startsWith('/api')) {
    return res.status(err.statusCode).json({
      status: err.status,
      error: err,
      stack: err.stack,
      message: err.message,
    });
  }
  res.status(err.statusCode).render('error', {
    title: 'Something went Wrong',
    msg: err.message,
  });
};

const sendErrorProd = (err, req, res) => {
  if (req.originalUrl.startsWith('/api')) {
    if (err.isOperational) {
      return res.status(err.statusCode).json({
        title: 'Something went Wrong',
        message: err.message,
      });
    }
    console.error('Error!!!!!!');
    return res.status(err.statusCode).render('error', {
      title: 'Something went Wrong',
      msg: err.message,
    });
  }
  if (err.isOperational) {
    return res.status(err.statusCode).render('error', {
      title: 'Something went Wrong',
      msg: err.message,
    });
  }
  console.error('Error!!!!!!');
  res.status(err.statusCode).render('error', {
    title: 'Something went Wrong',
    msg: 'Pleasse try again',
  });
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'production') {
    // console.log('im in producion ');
    let error = { ...err };
    error.message = err.message;
    if (err.name === 'CastError') error = handleCastErrorDB(error);
    if (err.name === 'MongoError') error = handleMongoError(error);
    if (err.name === 'ValidationError') error = handleValidationError(error);
    if (err.name === 'JsonWebTokenError') error = handleJWTTokenError();
    if (err.name === 'TokenExpiredError') error = handleTokenExpiredError();

    sendErrorProd(error, req, res);
  } else if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, req, res);
  }
};
