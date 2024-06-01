const express = require('express');
const tourController = require('../controller/tourController');

const router = express.Router();

router.route('/top-cheap-tours').get(tourController.getTopTours, tourController.getAllTours);
router.route('/tour-stats').get(tourController.getTourStats)
router.route('/monthly-plan/:year').get(tourController.getMonthlyPlan)
router
  .route('/')
  .get(tourController.getAllTours)
  .post(tourController.createTour);
router
  .route('/:id')
  .get(tourController.getTourById)
  .patch(tourController.updatetour)
  .delete(tourController.deleteTour);

module.exports = router;
