const Tour = require('../model/tourModel');
const APIfeatures = require('../utils/APIfeatures');
const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');

exports.getTopTours = (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-ratingsAverage,price';
  req.query.fields =
    'name,duration,difficulty,ratingsAverage,price,description';
  console.log(req.query);
  next();
};
exports.getAllTours = catchAsync(async (req, res,next) => {
  console.log(req.query);
  console.log(Tour.find());
  const features = new APIfeatures(Tour.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();
  const tours = await features.query;
  console.log(tours);
  res.status(200).json({
    status: ' success',
    result: tours.length,
    data: {
      tours,
    },
  });
});

exports.getTourById = catchAsync(async (req, res,next) => {
  const tour = await Tour.findById(req.params.id);
  if(!tour){
    return next(new AppError(`No tour found with that ID}`,404)  )
  }
  res.status(200).json({
    status: ' success',
    data: {
      tour,
    },
  });
});

exports.createTour = catchAsync(async (req, res,next) => {
  const newTour = await Tour.create(req.body);
  res.status(201).json({
    status: 'success',
    data: {
      tour: newTour,
    },
  });
});

exports.updatetour = catchAsync(async (req, res,next) => {
  const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if(!tour){
    return next(new AppError(`No tour found with that ID}`,404)  )
  }
  res.status(200).json({
    status: 'success',
    data: {
      tour: tour,
    },
  });
});

exports.deleteTour = catchAsync(async (req, res,next) => {
  const tour = await Tour.findByIdAndDelete(req.params.id);
  if(!tour){
    return next(new AppError(`No tour found with that ID}`,404)  )
  }
  res.status(204).json({
    status: 'success',
    message: 'tour deleted successfully',
    data: null,
  });
});

exports.getTourStats = catchAsync(async (req, res, next) => {
  const stats = await Tour.aggregate([
    {
      $match: { ratingsAverage: { $gte: 4.5 } },
    },
    {
      $group: {
        _id: { $toUpper: '$difficulty' },
        numTours: { $sum: 1 },
        numRatings: { $sum: '$ratingsQuantity' },
        avgRating: { $avg: '$ratingsAverage' },
        avgPrice: { $avg: '$price' },
        minPrice: { $min: '$price' },
        maxPrice: { $max: '$price' },
      },
    },
    {
      $sort: { avgPrice: 1 },
    },
    // {  $match: { _id: { $ne: 'EASY' } } },
  ]);
  res.status(200).json({ status: 'success', data: { stats } });
});

exports.getMonthlyPlan = catchAsync(async (req, res, next) => {
  const year = req.params.year * 1;
  const plans = await Tour.aggregate([
    {
      $unwind: '$startDates',
    },
    {
      $match: {
        startDates: {
          $gte: new Date(`${year}-01-01`),
          $lte: new Date(`${year}-12-31`),
        },
      },
    },
    {
      $group: {
        _id: { $month: '$startDates' },
        numToursStats: { $sum: 1 },
        tours: { $push: '$name' },
      },
    },
    {
      $addFields: {
        month: '$_id',
      },
    },
    {
      $project: {
        _id: 0,
      },
    },
    {
      $sort: {
        numToursStats: -1,
      },
    },
  ]);

  res.status(200).json({
    status: 'success',
    data: {
      plans,
    },
  });
});
