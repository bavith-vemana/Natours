const Review = require('../models/reviewModel');
const AppError = require('../utils/appError');
const handlerFactory = require('../controllers/handlerFactory');

exports.getUserReviews = async (req, res, next) => {
  try {
    const userId = String(req.userDetails._id);
    const reviews = await Review.find({ user: userId }).populate({
      path: 'tour',
      select: 'name imageCover',
      options: { autopopulate: false },
    });
    if (reviews.length == 0) {
      return next(new AppError('No reviews found for this user', 500));
    }

    res.status(200).json({
      status: 'Success',
      Reviews: reviews,
    });
  } catch (err) {
    next(new AppError(err.message, 500));
  }
};

exports.getSingleReviews = async (req, res, next) => {
  try {
    let query = {};
    let allReviews;
    if (req.userDetails) {
      query.user = String(req.userDetails._id);
    }
    if (req.params.tourId) {
      query.tour = req.params.tourId;
    }
    if (req.params.reviewId) {
      query._id = req.params.reviewId;
      allReviews = await Review.findById(req.params.reviewId);
      if (!allReviews) {
        return next(new AppError('Please enter valid review Id', 400));
      }
      //query.user
      if (allReviews.user._id != query.user) {
        return next(new AppError('No reviews for this User', 400));
      }
      if (allReviews.tour != query.tour) {
        return next(new AppError('No reviews for this tour', 400));
      }
    } else {
      //allReviews = await handlerFactory.getAllDocs();
      allReviews = await Review.find();
    }
    res.status(200).json({
      status: 'Success',
      Reviews: allReviews,
    });
  } catch (err) {
    next(new AppError(err.message, 500));
  }
};

exports.getAllReviews = async (req, res, next) => {
  try {
    const query = {
      user: String(req.userDetails._id),
      tour: req.params.tourId,
    };
    const reviews = await Review.find(query);
    if (reviews.length == 0) {
      return next(new AppError('No reviews found', 500));
    }

    res.status(200).json({
      status: 'Success',
      Reviews: reviews,
    });
  } catch (err) {
    next(new AppError(err.message, 500));
  }
};

exports.createReviews = async (req, res, next) => {
  try {
    if (!req.body) {
      next(new AppError('please provide Data', 500));
    }
    if (!req.body.user) {
      req.body.user = String(req.userDetails._id);
    }
    if (!req.body.tour) {
      req.body.tour = req.params.tourId;
    }
    const { user, tour } = req.body;
    const filter = { user, tour };
    const isExist = await handlerFactory.getDocs(Review, filter);
    if (isExist != 0) {
      return next(new AppError('Your Review already exists', 400));
    }
    const allReviews = await handlerFactory.createDocs(Review, req.body);
    res.status(200).json({
      status: 'Success',
      data: allReviews,
    });
  } catch (err) {
    next(err);
  }
};

exports.updateReview = async (req, res, next) => {
  try {
    let query = {};
    let allReviews;
    if (req.userDetails) {
      query.user = String(req.userDetails._id);
    }
    if (req.params.tourId) {
      query.tour = req.params.tourId;
    }
    if (req.params.reviewId) {
      query._id = req.params.reviewId;
      allReviews = await handlerFactory.findByIdAndUpdate(
        Review,
        req.params.reviewId,
        req.body,
      );
      //allReviews = await Review.findByIdAndUpdate(req.params.reviewId);
      //query.user
      if (allReviews.user._id != query.user) {
        return next(new AppError('No reviews for this User', 400));
      }
      if (allReviews.tour != query.tour) {
        return next(new AppError('No reviews for this tour', 400));
      }
    } else {
      return next(new AppError('No review Id', 400));
    }
    res.status(200).json({
      status: 'Success',
      Reviews: allReviews,
    });
  } catch (err) {
    next(err);
  }
};

exports.deleteReview = async (req, res, next) => {
  try {
    let query = {};
    let allReviews;
    if (req.userDetails) {
      query.user = String(req.userDetails._id);
    }
    if (req.params.tourId) {
      query.tour = req.params.tourId;
    }
    if (req.params.reviewId) {
      query._id = req.params.reviewId;
      allReviews = await handlerFactory.deleteById(Review, req.params.reviewId);
      if (allReviews.user._id != query.user) {
        return next(new AppError('No reviews for this User', 400));
      }
      if (allReviews.tour != query.tour) {
        return next(new AppError('No reviews for this tour', 400));
      }
    } else {
      return next(new AppError('No review Id', 400));
    }
    res.status(200).json({
      status: 'Success',
      Reviews: allReviews,
    });
  } catch (err) {
    next(err);
  }
};
