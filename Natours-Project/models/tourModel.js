//creating schema
const mongoose = require('mongoose');
const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'please provide tour name'],
      unique: true,
      trim: true,
    },
    duration: {
      type: Number,
      required: [true, 'please provide duration'],
    },
    maxGroupSize: {
      type: Number,
      required: [true, 'please provide group size'],
    },
    difficulty: {
      type: String,
      enum: {
        values: ['easy', 'medium', 'difficult'],
        message: 'difficulty should be in easy,medium & difficult',
      },
      required: [true, 'please provide difficulty'],
    },
    ratingsAverage: {
      type: Number,
      min: [1, 'rating should be greater than 1'],
      max: [5, 'rating should be less than 5'],
      default: 4.5,
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: [true, 'please provide tour price'],
    },
    priceDiscount: {
      type: Number,
      validate: {
        validator: function (val) {
          return val <= this.price;
        },
        message: 'Invalid Discount',
      },
    },
    summary: {
      type: String,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    imageCover: {
      type: String,
      required: [true, 'please provide cover image'],
    },
    images: [String],
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    startDates: {
      type: [Date],
      validate: {
        validator: function (arr) {
          return arr.length >= 1;
        },
        message: 'atlest one start date',
      },
    },
    startLocation: {
      type: {
        type: String,
        default: 'Point',
        enum: ['Point'],
      },
      coordinates: [Number],
      address: String,
      description: String,
    },
    locations: [
      {
        type: {
          type: String,
          default: 'Point',
          enum: ['Point'],
        },
        coordinates: [Number],
        address: String,
        description: String,
        day: Number,
      },
    ],
    guides: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
      },
    ],
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

tourSchema.index({ startLocation: '2dsphere' });

//virtuals
tourSchema.virtual('durationWeeks').get(function () {
  return this.duration / 7;
});

tourSchema.virtual('Reviews', {
  ref: 'reviews', // ✅ must match mongoose.model('reviews', reviewSchema)
  foreignField: 'tour',
  localField: '_id',
});

tourSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'guides', // field in your Tour schema
    select: '_id name email role photo', // only include these fields
  });
  next();
});



//model
const tourModel = mongoose.model('tours', tourSchema);

module.exports = { tourModel };
