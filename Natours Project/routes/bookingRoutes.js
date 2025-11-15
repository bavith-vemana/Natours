const bookingController = require('../controllers/bookingController');
const authController = require('../controllers/authController');
const express = require('express');

const bookingRouter = express.Router();

bookingRouter.use(authController.protect, authController.isLoggedIn);

bookingRouter.get(
  '/checkout-session/:tourId',
  bookingController.checkOutSession,
);

bookingRouter.delete('/deleteBooking/:tourId', bookingController.deleteBooking);

module.exports = { bookingRouter };
