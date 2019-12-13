const mongoose = require('mongoose');

const attemptSchema = new mongoose.Schema({
  recipeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Recipe',
    required: true,
  },
  dateOfAttempt: {
    type: Date,
    required: true,
  },
  notes: {
    type: String,
    required: false,
  },
  rating: {
    type: Number,
    min: 0,
    max: 5,
    required: true,
  }
});

module.exports = mongoose.model('Attempt', attemptSchema);
