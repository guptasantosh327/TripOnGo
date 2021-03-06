const Tour = require('../models/tourModel');
// const User = require('../models/userModel');
const Booking = require('../models/bookingModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const User = require('../models/userModel');

exports.getOverview = catchAsync(async (req, res) => {
  const tours = await Tour.find();

  res.status(200).render('overview', {
    title: 'All Tours',
    tours,
  });
});

exports.getTour = catchAsync(async (req, res, next) => {
  const tour = await Tour.findOne({ slug: req.params.slug }).populate({
    path: 'reviews',
    fields: 'review rating user tour',
  });
  if (!tour) {
    return next(new AppError('There is no tour with that name', 400));
  }

  res.status(200).render('tour', {
    title: `${tour.name} Tour`,
    tour,
  });
});

exports.getMyReviews = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user._id).populate({
    path: 'reviews',
    fields: 'review rating tour',
  });
  if (!user.reviews) {
    return next(
      new AppError('You never write a review on tours you visted.', 400)
    );
  }
  res.status(200).render('myReview', {
    title: 'My Review',
    user,
  });
});
exports.getLoginForm = (req, res) => {
  res.status(200).render('login', {
    title: 'Log into your Account',
  });
};

exports.getSignupForm = (req, res) => {
  res.status(200).render('signup', {
    title: 'Sign Up',
  });
};

exports.getAccount = (req, res) => {
  res.status(200).render('account', {
    title: 'My Account',
  });
};

exports.forgotPassword = (req, res, next) => {
  res.status(200).render('forgotpassword', {
    title: 'Forgot Password',
  });
};
exports.resetPassword = (req, res) => {
  const { token } = req.params;
  res.status(200).render('resetpassword', {
    title: 'Reset password',
    token,
  });
};

exports.getMyTours = catchAsync(async (req, res, next) => {
  const userId = req.user.id;
  const bookings = await Booking.find({ user: userId });
  const tourIDs = bookings.map((el) => el.tour);
  const tours = await Tour.find({ _id: { $in: tourIDs } });
  res.status(200).render('overview', {
    title: 'My Tours',
    tours,
  });
});
