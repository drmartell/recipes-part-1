const mongoose = require('mongoose');
const Attempt = require('./Attempt');

describe.skip('Attempt model', () => {
  it('has a required name', () => {
    const attempt = new Attempt();
    const { errors } = attempt.validateSync();

    expect(errors.name.message).toEqual('Path `name` is required.');
  });

  it('has name, ingredients, and directions fields', () => {
    const attempt = new Attempt({
      name: 'Cookies',
      ingredients: [{ name: 'flour', amount: '1', measurement: 'tablespoon' }],
      directions: [
        'preheat oven to 375',
        'mix ingredients',
        'put dough on cookie sheet',
        'bake for 10 minutes'
      ]
    });

    expect(attempt.toJSON()).toEqual({
      _id: expect.any(mongoose.Types.ObjectId),
      name: 'Cookies',
      ingredients: [{ _id: expect.any(mongoose.Types.ObjectId), name: 'flour', amount: '1', measurement: 'tablespoon' }],
      directions: [
        'preheat oven to 375',
        'mix ingredients',
        'put dough on cookie sheet',
        'bake for 10 minutes'
      ]
    });
  });
});

// const attemptSchema = new mongoose.Schema({
//   attemptId: {
//     type: String,
//     required: true
//   },
//   dateOfEvent: {
//     type: Date,
//     required: true
//   },
//   notes: {
//     type: String,
//     required: false
//   },
//   rating: {
//     type: Number,
//     min: 0,
//     max: 10,
//     required: false
//   }
// });
