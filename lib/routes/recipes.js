const Recipe = require('../models/Recipe');

module.exports = require('express').Router()
  .post('/', async(req, res) => {
    const body = await Recipe.create(req.body);
    res.send(body);
  })
  .get('/', async(req, res) => {
    const allRecipes = await Recipe.find();
    res.send(allRecipes);
  })
  .get('/:id', async(req, res) => {
    const foundRecipe = await Recipe.findById(req.params.id);
    res.send(foundRecipe);
  })
  .patch('/:id', async(req, res) => {
    const updatedRecipe = await Recipe.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.send(updatedRecipe);
  })
  .delete('/:id', async(req, res) => {
    const deletedRecipe = await Recipe.findByIdAndDelete(req.params.id);
    res.send(deletedRecipe);
  });
