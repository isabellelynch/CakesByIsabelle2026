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
  if (!req.body.id || !req.body.name || !req.body.price) {
    return res.status(400).json({ message: 'id, name and price are all required' });
  }
  try {
    const cake = await Cake.create({
      _id: req.body.id,
      name: req.body.name,
      desc: req.body.desc,
      price: req.body.price
    });
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
  try {
    const cake = await Cake.findById(req.params.cakeid);
    if (!cake) {
      return res.status(404).json({ message: 'Cake not found' });
    }
    if (req.body.name) cake.name = req.body.name;
    if (req.body.desc) cake.desc = req.body.desc;
    if (req.body.price) cake.price = req.body.price;
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
