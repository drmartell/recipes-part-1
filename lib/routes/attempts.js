const Attempt = require('../models/Attempt');

module.exports = require('express').Router()
  .post('/', async(req, res) => {
    const body = await Attempt.create(req.body);
    res.send(body);
  })
  .get('/', async(req, res) => {
    const allAttempts = await Attempt.find();
    res.send(allAttempts);
  })
  .get('/:id', async(req, res) => {
    const foundAttempt = await Attempt.findById(req.params.id).populate('Recipe');
    res.send(foundAttempt);
  })
  .patch('/:id', async(req, res) => {
    const updatedAttempt = await Attempt.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.send(updatedAttempt);
  })
  .delete('/:id', async(req, res) => {
    const deletedAttempt = await Attempt.findByIdAndDelete(req.params.id);
    res.send(deletedAttempt);
  });
