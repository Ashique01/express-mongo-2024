const mongoose = require('mongoose');
const { default: slugify } = require('slugify');
const validator = require('validator')

const tourSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A tour must have a name'],
    unique: true,
    maxLength: [40, ' A tour name must have less or equal than 40 characters'],
    mainLength: [10, ' A tour name must have more or equal than 10 characters'],
    validate: [validator.isAlpha, ' Tour name must only contain characters'],
  },
  duration: {
    type: Number,
    required: [true, 'A tour must have a duration'],
    minLength: [1, 'A tour must have a duration of at least 1 day'],
  },
  maxGroupSize: {
    type: Number,
    required: [true, 'A tour must have a group size'],
  },
  difficulty: {
    type: String,
    required: [true, 'A tour must have a difficulty'],
    enum: {
      values: ['easy', 'medium', 'difficult'],
      message: 'Difficulty is either: easy, medium, difficult',
    },
  },
  ratingsAverage: {
    type: Number,
    default: 4.5,
  },
  ratingsQuantity: {
    type: Number,
    default: 0,
  },
  price: {
    type: Number,
    required: [true, 'A tour must have a price'],
    minLength: [100, 'A tour must have a price of at least 100'],
  },
  priceDiscount: {
    type: Number,
    validate: {
      validator: function (val) {
        return val < this.price;
      },
      message: 'Discount price ({VALUE}) should be below regular price',
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
    required: [true, 'A tour must have a cover image'],
  },
  images: [String],
  createdAt: {
    type: Date,
    default: Date.now(),
    select: false,
  },
  startDates: [Date],
  slug: String,
  secretTour: {
    type: Boolean,
    default: false,
  },
});



tourModel = mongoose.model('Tours', tourSchema);
module.exports = tourModel;
