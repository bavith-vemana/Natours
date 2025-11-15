const mongoose = require('mongoose');
const bookingSchema = new mongoose.Schema({
  tour: {
    type: mongoose.Schema.ObjectId,
    ref: 'tours',
    required: [true, 'Booking must have a tour'],
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'Booking must have a user'],
  },
  price: {
    type: Number,
    required: [true, 'Booking must have a price'],
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  paid: {
    type: Boolean,
    default: true,
  },
});

bookingSchema.pre(/^find/, function (next) {
  this.populate('user').populate({
    path: 'tour', // field in your Tour schema
    // select: 'name', // only include these fields
  });
  next();
});

const bookingModel = mongoose.model('Booking', bookingSchema);

module.exports = bookingModel;
