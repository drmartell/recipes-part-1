const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  directions: [String]
});

module.exports = mongoose.model('Recipe', schema);
