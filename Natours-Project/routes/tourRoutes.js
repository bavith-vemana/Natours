const express = require('express');
const tourRouter = express.Router();
const {
  getAllTours,
  createTour,
  updateTour,
  deleteTour,
  getTour,
  checkID,
  getTourStats,
  monthlyPlan,
  getTourWithin,
  distances,
  updateTourPics,
  resizeTourPics,
} = require('../controllers/tourControllers');
const authController = require('../controllers/authController');
const update = updateTourPics();

const { reviewRouter } = require('./reviewRoutes');

tourRouter.param('id', checkID);

tourRouter.use('/:tourId/review', reviewRouter);

tourRouter
  .route('/')
  .get(getAllTours)
  .post(
    authController.protect,
    authController.accessTo(['admin', 'lead-guide']),
    createTour,
  );

tourRouter.use((req, res, next) => {
  next();
});

tourRouter.route('/stats').get(getTourStats);
tourRouter
  .route('/monthly-plan/:year')
  .get(
    authController.protect,
    authController.accessTo(['admin', 'lead-guide', 'guide']),
    monthlyPlan,
  );

tourRouter.route('/within').get(getTourWithin);
tourRouter.route('/distances').get(distances);

tourRouter
  .route('/:id')
  .get(getTour)
  .delete(
    authController.protect,
    authController.accessTo(['admin', 'lead-guide']),
    deleteTour,
  )
  .patch(
    authController.protect,
    authController.accessTo(['admin', 'lead-guide']),
    update,
    resizeTourPics,
    updateTour,
  );
// api/v1/tours/within?location:[lat,lng]&radius:radius&unit:km

module.exports = { tourRouter };
