require('dotenv').config();

const request = require('supertest');
const app = require('../lib/app');
const connect = require('../lib/utils/connect');
const mongoose = require('mongoose');
const Recipe = require('../lib/models/Recipe');
const Attempt = require('../lib/models/Attempt');

describe.skip('recipes routes', () => {
  beforeAll(() => {
    connect();
  });

  beforeEach(() => {
    return mongoose.connection.dropDatabase();
  });

  afterAll(() => {
    return mongoose.connection.close();
  });

  it('creates a recipe', () => {
    return request(app)
      .post('/api/v1/recipes')
      .send({
        name: 'cookies',
        ingredients: [
          {
            name: 'butter',
            amount: 4,
            measurement: 'pounds'
          },
          {
            name: 'sugar',
            amount: 10,
            measurement: 'ounces'
          }
        ],
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
          ingredients: [
            {
              _id: expect.any(String),
              name: 'butter',
              amount: 4,
              measurement: 'pounds'
            },
            {
              _id: expect.any(String),
              name: 'sugar',
              amount: 10,
              measurement: 'ounces'
            }
          ],
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
    const recipes = JSON.parse(JSON.stringify(await Recipe.create([
      { name: 'cookies', ingredients: [{ name: 'sugar', amount: 10, measurement: 'pounds' }], directions: ['have fun'] },
      { name: 'cake', ingredients: [{ name: 'butter', amount: 10, measurement: 'ounces' }], directions: ['have fun'] },
      { name: 'pie', ingredients: [{ name: 'fear', amount: 10, measurement: 'iotas' }], directions: ['have fun'] }
    ])));

    return request(app)
      .get('/api/v1/recipes')
      .then(res => {
        recipes.forEach(recipe => {
          expect(res.body).toContainEqual({
            _id: recipe._id.toString(),
            name: recipe.name,
            ingredients: recipe.ingredients,
            directions: recipe.directions,
            __v: 0
          });
        });
      });
  });

  it('gets a recipe by id', async() => {
    const recipe = await Recipe.create({
      name: 'cookies',
      ingredients: [
        {
          name: 'butter',
          amount: 4,
          measurement: 'pounds'
        },
        {
          name: 'sugar',
          amount: 10,
          measurement: 'ounces'
        }
      ],
      directions: [
        'preheat oven to 375',
        'mix ingredients',
        'put dough on cookie sheet',
        'bake for 10 minutes'
      ],
    });

    return request(app)
      .get(`/api/v1/recipes/${recipe._id}`)
      .then(recipe => {
        expect(recipe.body).toEqual({
          _id: expect.any(String),
          name: 'cookies',
          ingredients: [
            {
              _id: expect.any(String),
              name: 'butter',
              amount: 4,
              measurement: 'pounds'
            },
            {
              _id: expect.any(String),
              name: 'sugar',
              amount: 10,
              measurement: 'ounces'
            }
          ],
          directions: [
            'preheat oven to 375',
            'mix ingredients',
            'put dough on cookie sheet',
            'bake for 10 minutes'
          ],
          attempts: [],
          __v: 0
        });
      });
  });

  it('updates a recipe by id', async() => {
    const recipe = await Recipe.create({
      name: 'cookies',
      ingredients: [
        {
          name: 'butter',
          amount: 4,
          measurement: 'pounds'
        },
        {
          name: 'sugar',
          amount: 10,
          measurement: 'ounces'
        }
      ],
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
          ingredients: [
            {
              _id: expect.any(String),
              name: 'butter',
              amount: 4,
              measurement: 'pounds'
            },
            {
              _id: expect.any(String),
              name: 'sugar',
              amount: 10,
              measurement: 'ounces'
            }
          ],
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
      ingredients: [
        {
          name: 'butter',
          amount: 4,
          measurement: 'pounds'
        },
        {
          name: 'sugar',
          amount: 10,
          measurement: 'ounces'
        }
      ],
      directions: [
        'preheat oven to 375',
        'mix ingredients',
        'put dough on cookie sheet',
        'bake for 10 minutes'
      ]
    });

    await Attempt.create({
      recipeId: recipe._id,
      dateOfAttempt: 'today',
      notes: 'yum',
      rating: 5
    });

    return request(app)
      .delete(`/api/v1/recipes/${recipe._id}`)
      .then(deletedRecipe => {
        expect(deletedRecipe.body).toEqual({
          _id: recipe._id.toString(),
          name: 'cookies',
          ingredients: [
            {
              _id: expect.any(String),
              name: 'butter',
              amount: 4,
              measurement: 'pounds'
            },
            {
              _id: expect.any(String),
              name: 'sugar',
              amount: 10,
              measurement: 'ounces'
            }
          ],
          directions: [
            'preheat oven to 375',
            'mix ingredients',
            'put dough on cookie sheet',
            'bake for 10 minutes'
          ],
          attempts: {
            n: 1,
            deletedCount: 1,
            ok: 1
          },
          __v: 0
        });
      });
  });

  it('can find recipes containing a specific ingredient', async() => {
    await Recipe.create({
      name: 'cookies',
      ingredients: [
        {
          name: 'butter',
          amount: 4,
          measurement: 'pounds'
        },
        {
          name: 'sugar',
          amount: 10,
          measurement: 'ounces'
        }
      ],
      directions: [
        'preheat oven to 375',
        'mix ingredients',
        'put dough on cookie sheet',
        'bake for 10 minutes'
      ]
    });

    const cookiesFlour = await Recipe.create({
      name: 'cookies',
      ingredients: [
        {
          name: 'butter',
          amount: 4,
          measurement: 'pounds'
        },
        {
          name: 'sugar',
          amount: 10,
          measurement: 'ounces'
        },
        {
          name: 'flour',
          amount: 1,
          measurement: 'cup'
        }
      ],
      directions: [
        'preheat oven to 375',
        'mix ingredients',
        'put dough on cookie sheet',
        'bake for 10 minutes'
      ]
    });

    return request(app)
      .get('/api/v1/recipes/?ingredient=flour')
      .then(res => {
        expect(res.body).toEqual([{
          _id: cookiesFlour._id.toString(),
          name: 'cookies',
          ingredients: [
            {
              _id: expect.any(String),
              name: 'butter',
              amount: 4,
              measurement: 'pounds'
            },
            {
              _id: expect.any(String),
              name: 'sugar',
              amount: 10,
              measurement: 'ounces'
            },
            {
              _id: expect.any(String),
              name: 'flour',
              amount: 1,
              measurement: 'cup'
            }
          ],
          directions: [
            'preheat oven to 375',
            'mix ingredients',
            'put dough on cookie sheet',
            'bake for 10 minutes'
          ],
          __v: 0
        }]);
      });
  });
});
