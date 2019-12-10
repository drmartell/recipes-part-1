const express = require('express');
const app = express();
const Recipe = require('./models/Recipe');

app.use(express.json());

app.post('/api/v1/recipes', (req, res) => {
  Recipe
    .create(req.body)
    .then(recipe => res.send(recipe));
});

app.get('/api/v1/recipes', (req, res) => {
  Recipe
    .find()
    .select({ name: true })
    .then(recipes => res.send(recipes));
});

app.get('/api/v1/recipes/:id', (req, res) => {
  Recipe
    .findById(req.params.id)
    .then(recipe => res.send(recipe));
});

app.patch('/api/v1/recipes/:id', (req, res) => {
  Recipe
    .findByIdAndUpdate(req.params.id, req.body, { new: true })
    .then(recipe => res.send(recipe));
});

app.delete('/api/v1/recipes/:id', (req, res) => {
  Recipe
    .findByIdAndDelete(req.params.id)
    .then(recipe => res.send(recipe));
});

module.exports = app;
