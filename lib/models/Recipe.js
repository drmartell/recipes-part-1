const mongoose = require('mongoose');

const ingredientSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  amount: {
    type: String,
    required: true
  },
  measurement: {
    type: String,
    enum : ['teaspoon', 'tablespoon', 'cup', 'ounce', 'grams'],
    required: true
  }
});

const recipeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  ingredients: [ingredientSchema],
  directions: [String],
},
{
  id: false,
  toJSON: { virtuals: true }
},
{
  toObject: { virtuals: true }
});

// Add access to attempts
recipeSchema.virtual('attempts', {
  ref: 'Attempt',
  localField: '_id',
  foreignField: 'recipeId'
});

module.exports = mongoose.model('Recipe', recipeSchema);
