const Recipe = require('../models/Recipe');
const Attempt = require('../models/Attempt');

module.exports = require('express').Router()
  .post('/', async(req, res) => {
    const body = await Recipe.create(req.body);
    res.send(body);
  })
  .get('/', async(req, res) => {
    const allRecipes = await Recipe.find();
    res.send(allRecipes);
  })
  // .get('/:id', async(req, res) => {
  //   const foundRecipe = await Recipe.findById(req.params.id);
  //   foundRecipe.populate('');
  //   res.send(foundRecipe);
  // })
  .patch('/:id', async(req, res) => {
    const updatedRecipe = await Recipe.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.send(updatedRecipe);
  })
  // .delete('/:id', async(req, res) => {
  //   const deletedRecipe = await Recipe.findByIdAndDelete(req.params.id);
  //   res.send(deletedRecipe);
  // })


  .get('/:id', (req, res) => {
    Promise.all([
      Recipe.findById(req.params.id),
      Attempt.find({ recipe: req.params.id })
    ])
      .then(([recipe, attempts]) => {
        res.send({ ...recipe.toJSON(), attempts });
      });
  })
  .delete('/:id', async(req, res) => {
    Promise.all([
      Recipe.findById(req.params.id),
      Attempt.find({ recipe: req.params.id })
    ])
      .then(([recipe, attempts]) => {
        Recipe.findByIdAndDelete(req.params.id);
        Attempt.deleteMany({ recipeId: req.params.id });
        res.send({ ...recipe.toJSON(), attempts });
      });
  });
