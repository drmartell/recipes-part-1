require('dotenv').config();

const request = require('supertest');
const app = require('../lib/app');
const connect = require('../lib/utils/connect');
const mongoose = require('mongoose');
const Recipe = require('../lib/models/Recipe');

describe('app routes', () => {
  beforeAll(() => connect());

  beforeEach(() => mongoose.connection.dropDatabase());

  afterAll(() => mongoose.connection.close());

  it('creates a recipe', () => {
    return request(app)
      .post('/api/v1/recipes')
      .send({
        name: 'cookies',
        ingredients: [{ name: 'flour', amount: '1', measurement: 'tablespoon' }],
        directions: [
          'preheat oven to 375',
          'mix ingredients',
          'put dough on cookie sheet',
          'bake for 10 minutes'
        ]
      })
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.any(String),
          name: 'cookies',
          ingredients: [{ _id: expect.any(String), name: 'flour', amount: '1', measurement: 'tablespoon' }],
          directions: [
            'preheat oven to 375',
            'mix ingredients',
            'put dough on cookie sheet',
            'bake for 10 minutes'
          ],
          __v: 0
        });
      });
  });

  it('gets all recipes', async() => {
    const recipes = await Recipe.create([
      { name: 'cookies', ingredients: [], directions: [] },
      { name: 'cake', ingredients: [], directions: [] },
      { name: 'pie', ingredients: [], directions: [] }
    ]);
    
    const recipesObj = {};
    recipes.forEach(recipe =>
      recipesObj[recipe._id.toString()] = { ...recipe.toJSON(), _id: recipe._id.toString() });
    
    return request(app)
      .get('/api/v1/recipes')
      .then(res => {
        const resObj = {};
        res.body.forEach(recipe => resObj[recipe._id] = recipe);
        expect(recipesObj).toEqual(resObj);
      });
  });

  it('gets a recipe by id', async() => {
    const recipe = await Recipe.create({
      name: 'cookies',
      ingredients: [{ name: 'flour', amount: '1', measurement: 'tablespoon' }],
      directions: [
        'preheat oven to 375',
        'mix ingredients',
        'put dough on cookie sheet',
        'bake for 10 minutes'
      ],
    });

    return request(app)
      .get(`/api/v1/recipes/${recipe._id}`)
      .then(res => {
        expect(res.body).toEqual({
          _id: recipe._id.toString(),
          name: 'cookies',
          ingredients: [{ _id: expect.any(String), name: 'flour', amount: '1', measurement: 'tablespoon' }],
          directions: [
            'preheat oven to 375',
            'mix ingredients',
            'put dough on cookie sheet',
            'bake for 10 minutes'
          ],
          attempts: expect.any(Object),
          __v: 0
        });
      });
  });

  it('updates a recipe by id', async() => {
    const recipe = await Recipe.create({
      name: 'cookies',
      ingredients: [],
      directions: [
        'preheat oven to 375',
        'mix ingredients',
        'put dough on cookie sheet',
        'bake for 10 minutes'
      ],
    });

    return request(app)
      .patch(`/api/v1/recipes/${recipe._id}`)
      .send({ name: 'good cookies' })
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.any(String),
          name: 'good cookies',
          ingredients: [],
          directions: [
            'preheat oven to 375',
            'mix ingredients',
            'put dough on cookie sheet',
            'bake for 10 minutes'
          ],
          __v: 0
        });
      });
  });

  it('deletes a recipe by id', async() => {
    const recipe = await Recipe.create({
      name: 'cookies',
      ingredients: [],
      directions: [
        'preheat oven to 375',
        'mix ingredients',
        'put dough on cookie sheet',
        'bake for 10 minutes'
      ],
      attempts: [],
    });

    return request(app)
      .delete(`/api/v1/recipes/${recipe._id}`)
      .then(res => {
        expect(res.body).toEqual({
          _id: recipe._id.toString(),
          name: 'cookies',
          ingredients: [],
          directions: [
            'preheat oven to 375',
            'mix ingredients',
            'put dough on cookie sheet',
            'bake for 10 minutes'
          ],
          attempts: expect.any(Object),
          __v: 0
        });
      });
  });
});
