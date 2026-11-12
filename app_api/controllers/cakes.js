const mongoose = require('mongoose');
const Cake = mongoose.model('Cake');

// GET /api/cakes
const cakesList = async (req, res) => {
  try {
    const cakes = await Cake.find();
    res.status(200).json(cakes);
  } catch (err) {
    res.status(500).json({ message: 'Error retrieving cakes', error: err.message });
  }
};

// POST /api/cakes
const cakesCreate = async (req, res) => {
  const { id, name, desc, price } = req.body || {};
  if (!id || !name || price === undefined || price === '') {
    return res.status(400).json({ message: 'id, name and price are all required' });
  }
  try {
    const cake = await Cake.create({ _id: id, name, desc, price });
    res.status(201).json(cake);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ message: 'A cake with that id already exists' });
    }
    res.status(400).json({ message: err.message });
  }
};

// GET /api/cakes/:cakeid
const cakesReadOne = async (req, res) => {
  try {
    const cake = await Cake.findById(req.params.cakeid);
    if (!cake) {
      return res.status(404).json({ message: 'Cake not found' });
    }
    res.status(200).json(cake);
  } catch (err) {
    res.status(500).json({ message: 'Error retrieving cake', error: err.message });
  }
};

// PUT /api/cakes/:cakeid
const cakesUpdateOne = async (req, res) => {
  const body = req.body || {};
  try {
    const cake = await Cake.findById(req.params.cakeid);
    if (!cake) {
      return res.status(404).json({ message: 'Cake not found' });
    }
    if (body.name) cake.name = body.name;
    if (body.desc !== undefined) cake.desc = body.desc;
    if (body.price !== undefined && body.price !== '') cake.price = body.price;
    const updatedCake = await cake.save();
    res.status(200).json(updatedCake);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// DELETE /api/cakes/:cakeid
const cakesDeleteOne = async (req, res) => {
  try {
    const cake = await Cake.findByIdAndDelete(req.params.cakeid);
    if (!cake) {
      return res.status(404).json({ message: 'Cake not found' });
    }
    res.status(204).json(null);
  } catch (err) {
    res.status(500).json({ message: 'Error deleting cake', error: err.message });
  }
};

module.exports = { cakesList, cakesCreate, cakesReadOne, cakesUpdateOne, cakesDeleteOne };
