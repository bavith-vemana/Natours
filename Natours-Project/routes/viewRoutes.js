const express = require('express');
const viewRouter = express.Router();
const viewController = require('../controllers/viewController');
const authController = require('../controllers/authController');
const bookingController = require('../controllers/bookingController');
// const
viewRouter.get('/resetPassword/:resetToken', viewController.resetPasswordPage);
viewRouter.get('/login', viewController.getLoginForm);
viewRouter.get('/login/forgetPassword', viewController.getForgetPasswordPage);
viewRouter.get('/signup', viewController.getSignupForm);

viewRouter.get(
  '/account',
  authController.protect,
  viewController.getAccountPage,
);
viewRouter.use(authController.isLoggedIn);

viewRouter.get('/myTours', authController.protect, viewController.getMyTours);

viewRouter.get(
  '/myReviews',
  authController.protect,
  viewController.getMyReviews,
);

viewRouter.get(
  '/create-review',
  authController.protect,
  viewController.getCreateReview,
);

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

viewRouter.get(
  '/manage-tours',
  authController.protect,
  authController.accessTo(['admin']),
  viewController.getManageTours,
);

viewRouter.get(
  '/update-tour/:tourId',
  authController.protect,
  authController.accessTo(['admin']),
  viewController.getUpdateTour,
);

module.exports = { viewRouter };
