const Recipe = require('../models/Recipe');
const Attempt = require('../models/Attempt');

module.exports = require('express').Router()
  .post('/', async(req, res) => {
    const body = await Recipe.create(req.body);
    res.send(body);
  })
  .get('/', async(req, res) => {
    const query = req.query.ingredient ? { 'ingredients.name': req.query.ingredient } : {};
    const foundRecipes = await Recipe.find(query);
    res.send(foundRecipes);
  })
  .get('/:id', async(req, res) => {
    const foundRecipe = await Recipe.findById(req.params.id);
    const foundAttempts = await Attempt.find({ recipeId: req.params.id });
    res.send({ ...foundRecipe.toJSON(), attempts: foundAttempts });
  })
  .patch('/:id', async(req, res) => {
    const updatedRecipe = await Recipe.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.send(updatedRecipe);
  })
  .delete('/:id', async(req, res) => {
    const deletedRecipe = await Recipe.findByIdAndDelete(req.params.id);
    const foundAttempts = await Attempt.find({ recipeId: req.params.id });
    await Attempt.deleteMany({ recipeId: req.params.id });
    res.send({ ...deletedRecipe.toJSON(), attempts: foundAttempts });
  });
