// const { Router } = require('express');
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
  .get('/:id', (req, res) => Recipe
    .findById(req.params.id)
    .then(recipe => res.send(recipe))
  )
  .patch('/:id', (req, res) => Recipe
    .findByIdAndUpdate(req.params.id, req.body, { new: true })
    .then(recipe => res.send(recipe))
  )
  .delete('/:id', (req, res) => Recipe
    .findByIdAndDelete(req.params.id)
    .then(recipe => res.send(recipe))
  );
