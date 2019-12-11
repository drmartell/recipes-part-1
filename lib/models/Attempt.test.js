require('dotenv').config();
const mongoose = require('mongoose');
const Recipe = require('./Recipe');
const Attempt = require('./Attempt');
const connect = require('../utils/connect');

describe.skip('Attempt model', () => {

  beforeAll(() => connect());

  let recipe;
  let attempt;
  let emptyAttempt;
  beforeEach(async() => {
    await mongoose.connection.dropDatabase();
    recipe = await Recipe.create({ name: 'bread', ingredients: [], directions: [] });
    attempt = await Attempt.create({ recipeId: recipe._id, dateOfAttempt: Date.now(), notes: 'killer bread', rating: 5 });
    emptyAttempt = await Attempt.create({ dateOfAttempt: Date.now(), notes: 'killer bread', rating: 5 });
  });

  afterAll(() => mongoose.connection.close());

  it('has a required recipeId', () => {
    console.log(recipe);
    console.log(attempt);
    delete attempt.recipeId;
    console.log(emptyAttempt);
    // const attempt = new Attempt();
    const { errors } = emptyAttempt.validateSync();
    expect(errors.recipeId.message).toEqual('Path `recipeId` is required.');
  });

  it('has a required dateOfAttempt', () => {
    // const attempt = new Attempt();
    const { errors } = attempt.validateSync();
    expect(errors.dateOfAttempt.message).toEqual('Path `dateOfAttempt` is required.');
  });

  it('has a required rating', () => {
    // const attempt = new Attempt();
    const { errors } = attempt.validateSync();
    expect(errors.rating.message).toEqual('Path `rating` is required.');
  });

  it('has a rating 0 or above', () => {
    // const attempt = new Attempt({
    // rating: -1;
    attempt.rating =  -1;
    //});
    const { errors } = attempt.validateSync();

    expect(errors.rating.message).toEqual('Path `rating` (-1) is less than minimum allowed value (0).');
  });

  it('has a rating 5 or below', () => {
    // const attempt = new Attempt({
    //   rating: 6
    // });
    attempt.rating = 6;
    const { errors } = attempt.validateSync();

    expect(errors.rating.message).toEqual('Path `rating` (6) is more than maximum allowed value (5).');
  });
});
