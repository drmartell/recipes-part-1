const mongoose = require('mongoose');

const attemptSchema = new mongoose.Schema({
  recipeId: {
    type: String,
    required: true
  },
  dateOfEvent: {
    type: Date,
    required: true
  },
  notes: {
    type: String,
    required: false
  },
  rating: {
    type: Number,
    min: 0,
    max: 10,
    required: false
  }
});

module.exports = mongoose.model('Attempt', attemptSchema);
