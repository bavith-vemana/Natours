const { tourModel } = require('../models/tourModel');
const axios = require('axios');
const AppError = require('../utils/appError');
const bookingModel = require('../models/bookingModel');

exports.getMyTours = async (req, res, next) => {
  try {
    const bookings = await bookingModel.find({ user: req.userDetails._id });
    const tours = bookings.map((b) => b.tour);

    res.status(200).render('overview', {
      title: 'My Bookings',
      tours,
    });
  } catch (err) {
    res.status(200).render('error');
  }
};

exports.getOverview = async (req, res) => {
  // get data
  const response = await axios.get(`${process.env.BASE_URL}/api/v1/tours`);
  const tours = response.data.data;

  // build templete

  // render the templete using data
  res.status(200).render('overview', {
    title: 'All tours',
    tours,
  });
};

exports.getTour = async (req, res, next) => {
  try {
    const response = await axios.get(
      `${process.env.BASE_URL}/api/v1/tours/${req.params.tourId}`,
    );
    const tourData = response.data.data;

    if (!tourData || tourData.length == 0) {
      res.status(200).render('error');
      // next(new AppError('Tour Not Found', 404));
    }
    res.status(200).render('tour', {
      title: tourData.name + ' tour',
      tourData,
    });
  } catch (err) {
    res.status(200).render('error');
    // next(new AppError(err.message, 400));
  }
};

exports.getLoginForm = async (req, res, next) => {
  try {
    res.status(200).render('login', {
      title: 'Login Page',
    });
  } catch (err) {
    res.status(200).render('error');
    // next(err);
  }
};

exports.getAccountPage = async (req, res, next) => {
  try {
    res
      .status(200)
      .render('account', ((title = 'Your Account'), (user = req.userDetails)));
  } catch (err) {}
};

exports.resetPasswordPage = async (req, res, next) => {
  try {
    res.status(200).render('resetPassword', {
      title: 'Reset Password',
      token: req.params.resetToken,
    });
  } catch (error) {
    res.status(200).render('error');
  }
};

exports.getForgetPasswordPage = async (req, res, next) => {
  try {
    res.status(200).render('forgetPasswordPage', {
      title: 'Forget Password',
    });
  } catch (error) {
    res.status(200).render('error');
  }
};
