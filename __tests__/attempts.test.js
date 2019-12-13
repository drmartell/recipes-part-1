require('dotenv').config();

const request = require('supertest');
const app = require('../lib/app');
const connect = require('../lib/utils/connect');
const mongoose = require('mongoose');
const Attempt = require('../lib/models/Attempt');
const Recipe = require('../lib/models/Recipe');

describe('attempt routes', () => {
  beforeAll(() => connect());

  let recipe;
  let attempt;
  beforeEach(async() => {
    await mongoose.connection.dropDatabase();
    recipe = await Recipe.create({ name: 'bread', ingredients: [], directions: [] });
    attempt = { recipeId: recipe._id, dateOfAttempt: Date.now(), notes: 'killer bread', rating: 5 };
  });

  afterAll(() => mongoose.connection.close());

  it('creates an attempt', () => request(app)
    .post('/api/v1/attempts')
    .send(attempt)
    .then(res => {
      expect(res.body).toEqual(expect.objectContaining({
        _id: expect.any(String),
        recipeId: recipe._id.toString(),
        notes: 'killer bread',
        rating: 5,
        __v: 0
      })
      );
    }));

  it('gets all attempts', async() => {
    const attempts = await Attempt.create([
      attempt,
      { ...attempt, rating: 4 },
      { ...attempt, rating: 3 },
      { ...attempt, rating: 2 },
    ]);

    return request(app)
      .get('/api/v1/attempts')
      .then(res => {
        attempts.forEach(attempt => {
          expect(res.body).toContainEqual(JSON.parse(JSON.stringify({ 
            _id: attempt._id.toString(),
            recipeId: attempt.recipeId,
            dateOfAttempt: attempt.dateOfAttempt,
            day: attempt.day,
            month: attempt.month,
            year: attempt.year,
            notes: attempt.notes,
            rating: attempt.rating,
            __v: 0
          })));
        });
      });
  });

  it('gets an attempt by id', async() => {
    const attempt = await Attempt.create({
      recipeId: recipe._id,
      dateOfAttempt: Date.now(),
      notes: 'It went well',
      rating: 4
    });

    return request(app)
      .get(`/api/v1/attempts/${attempt._id}`)
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.any(String),
          recipeId: recipe._id.toString(),
          dateOfAttempt: expect.any(String),
          day: attempt.day,
          month: attempt.month,
          year: attempt.year,
          notes: 'It went well',
          rating: 4,
          __v: 0
        });
      });
  });

  it('updates an attempt by id', async() => {
    const attempt = await Attempt.create({
      recipeId: recipe._id,
      dateOfAttempt: Date.now(),
      notes: 'It went well',
      rating: 4
    });

    return request(app)
      .patch(`/api/v1/attempts/${attempt._id}`)
      .send({ rating: 5 })
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.any(String),
          recipeId: recipe._id.toString(),
          dateOfAttempt: expect.any(String),
          day: attempt.day,
          month: attempt.month,
          year: attempt.year,
          notes: 'It went well',
          rating: 5,
          __v: 0
        });
      });
  });

  it('deletes an attempt by id', async() => {
    const attempt = await Attempt.create({
      recipeId: recipe._id,
      dateOfAttempt: Date.now(),
      notes: 'It went well',
      rating: 4
    });

    return request(app)
      .delete(`/api/v1/attempts/${attempt._id}`)
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.any(String),
          recipeId: recipe._id.toString(),
          dateOfAttempt: expect.any(String),
          day: attempt.day,
          month: attempt.month,
          year: attempt.year,
          notes: 'It went well',
          rating: 4,
          __v: 0
        });
      });
  });
});
