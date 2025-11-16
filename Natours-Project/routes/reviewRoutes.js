const { getAllReviews } = require('../controllers/reviewController');
const reviewController = require('../controllers/reviewController');
const authController = require('../controllers/authController');
const express = require('express');

const reviewRouter = express.Router({ mergeParams: true });

reviewRouter.use(authController.protect);

reviewRouter.get('/my-reviews', reviewController.getUserReviews);
reviewRouter
  .route('/')
  .post(authController.accessTo(), reviewController.createReviews)
  .get(authController.accessTo(), reviewController.getAllReviews);
reviewRouter
  .route('/:reviewId')
  .get(authController.accessTo(), reviewController.getSingleReviews)
  .patch(authController.accessTo(), reviewController.updateReview)
  .delete(authController.accessTo(), reviewController.deleteReview);

module.exports = { reviewRouter };
