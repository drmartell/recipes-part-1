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

//Virtuals day, month, year
attemptSchema.virtual('day')
  .get(function() { return this.dateOfAttempt.getDate(); })
  .set(function(day) { this.dateOfAttempt.setDate(day); });

attemptSchema.virtual('month')
  .get(function() { return this.dateOfAttempt.getMonth() + 1; })
  .set(function(month) { this.dateOfAttempt.setMonth(month - 1); });

attemptSchema.virtual('year')
  .get(function() { return this.dateOfAttempt.getFullYear(); })
  .set(function(year) { this.dateOfAttempt.setYear(year); });

module.exports = mongoose.model('Attempt', attemptSchema);
