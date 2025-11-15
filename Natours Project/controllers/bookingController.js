const AppError = require('../utils/appError');
const bookingModel = require('../models/bookingModel');
const handlerFactory = require('../controllers/handlerFactory');
// ❗ remove hardcoded key after testing
const secretKey =
  'sk_test_51SOy6m2OxkrAauVzox1IWPXg3URUNK3KCePw8stewAju2XUZLEqYmjP2sUYn1RhHsoHJxyJUb2A3jETnnKlHY2u80045Z4i8tB';
const stripe = require('stripe')(secretKey);
const { tourModel } = require('../models/tourModel');

exports.checkOutSession = async (req, res, next) => {
  try {
    const tour = await tourModel.findById(req.params.tourId);

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],

      success_url: `${req.protocol}://${req.get('host')}/?tour=${req.params.tourId}&user=${req.userDetails._id}&price=${tour.price}`,
      cancel_url: `${req.protocol}://${req.get('host')}/`,

      customer_email: req.userDetails.email,
      client_reference_id: req.params.tourId,

      line_items: [
        {
          price_data: {
            currency: 'usd',
            unit_amount: tour.price * 100,
            product_data: {
              name: `${tour.name} Tour`,
              description: tour.summary,
              images: [
                'https://images.unsplash.com/photo-1507525428034-b723cf961d3e',
              ],
            },
          },
          quantity: 1,
        },
      ],
    });

    res.status(200).json({
      status: 'success',
      session,
    });
  } catch (err) {
    next(new AppError(err.message, 500));
  }
};

exports.createBookings = async (req, res, next) => {
  try {
    const { tour, user, price } = req.query;
    if (!tour || !user || !price) {
      return next();
    }
    await handlerFactory.createDocs(bookingModel, {
      tour: tour,
      user: user,
      price: price,
    });
    res.redirect(req.originalUrl.split('?')[0]);
  } catch (err) {
    next(new AppError(err, 500));
  }
};

exports.isBooked = async (req, res, next) => {
  try {
    // If no logged-in user → not booked
    if (!res.locals.user) {
      res.locals.isBooked = false;
      return next();
    }

    const userId = res.locals.user._id.toString();
    const tourId = req.params.tourId;

    // Find booking
    const bookingExists = await bookingModel.findOne({
      tour: tourId,
      user: userId,
    });

    res.locals.isBooked = Boolean(bookingExists);
    return next();
  } catch (err) {
    return next(next(new AppError(err, 500)));
  }
};

exports.deleteBooking = async (req, res, next) => {
  try {
    const userId = res.locals.user._id.toString();
    const tourId = req.params.tourId;
    const deletedBooking = await bookingModel.findOneAndDelete({
      tour: tourId,
      user: userId,
    });
    if (!deletedBooking) {
      res.status(400).json({
        status: 'failed',
        message: 'Data not found!',
      });
    } else {
      res.status(200).json({
        status: 'sucess',
        deletedBooking: deletedBooking,
      });
      res.locals.isBooked = false;
    }
  } catch (err) {
    next(new AppError(err, 500));
  }
};
