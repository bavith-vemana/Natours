const mongoose = require('mongoose');
const handlerFactory = require('../controllers/handlerFactory');
const { tourModel } = require('../models/tourModel');
const reviewSchema = new mongoose.Schema(
  {
    review: {
      type: String,
      required: [true, 'Please Provide review'],
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
    },
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    tour: {
      type: mongoose.Schema.ObjectId,
      ref: 'tours',
      required: [true, 'Review must belong to a tour'],
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'Review must belong to a user'],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

reviewSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'user',
    select: 'name photo',
  });

  next();
});
reviewSchema.statics.calculateRatings = async function (tourId) {
  const stats = await this.aggregate([
    { $match: { tour: tourId } },
    {
      $group: {
        _id: '$tour',
        numRatings: { $sum: 1 },
        avgRating: { $avg: '$rating' },
      },
    },
    {
      $project: {
        _id: 1,
        numRatings: 1,
        avgRating: { $round: ['$avgRating', 1] }, // ✅ works perfectly here
      },
    },
  ]);

  return stats;
};

reviewSchema.post('save', async function (doc, next) {
  try {
    const calculatedRatings = await Review.calculateRatings(this.tour);
    const data = {
      ratingsQuantity: calculatedRatings[0].numRatings,
      ratingsAverage: calculatedRatings[0].avgRating,
    };
    const id = calculatedRatings[0]._id;
    const options = { new: true };
    await handlerFactory.findByIdAndUpdate(tourModel, id, data, options);
    next();
  } catch (err) {
    next(err);
  }
});

const Review = mongoose.model('reviews', reviewSchema);

module.exports = Review;
