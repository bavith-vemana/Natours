const express = require('express');
const viewRouter = express.Router();
const viewController = require('../controllers/viewController');
const authController = require('../controllers/authController');
const bookingController = require('../controllers/bookingController');
// const

viewRouter.get('/resetPassword/:resetToken', viewController.resetPasswordPage);
viewRouter.get('/login', viewController.getLoginForm);
viewRouter.get('/login/forgetPassword', viewController.getForgetPasswordPage);

viewRouter.get(
  '/account',
  authController.protect,
  viewController.getAccountPage,
);
viewRouter.use(authController.isLoggedIn);

viewRouter.get('/myTours', authController.protect, viewController.getMyTours);

viewRouter.get(
  '/',
  bookingController.createBookings,
  viewController.getOverview,
);

viewRouter.get(
  '/tour/:tourId',
  bookingController.isBooked,
  viewController.getTour,
);

module.exports = { viewRouter };
