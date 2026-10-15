const mongoose = require('mongoose');
const Order = mongoose.model('Order');
const Cake  = mongoose.model('Cake');

// GET /api/orders?email=you@example.com
const ordersList = async (req, res) => {
  if (!req.query.email) {
    return res.status(400).json({ message: 'An email is required, e.g. /api/orders?email=you@example.com' });
  }
  try {
    const orders = await Order.find({ email: req.query.email.toLowerCase() })
      .populate('cake')
      .sort({ orderDate: -1 });
    res.status(200).json(orders);
  } catch (err) {
    res.status(500).json({ message: 'Error retrieving orders', error: err.message });
  }
};

// POST /api/orders   (body: email, cake, deliveryDate)
const ordersCreate = async (req, res) => {
  if (!req.body.email || !req.body.cake || !req.body.deliveryDate) {
    return res.status(400).json({ message: 'email, cake and deliveryDate are all required' });
  }
  try {
    const cake = await Cake.findById(req.body.cake);
    if (!cake) {
      return res.status(404).json({ message: 'Cake not found' });
    }
    const order = await Order.create({
      email: req.body.email,
      cake: cake._id,
      price: cake.price,               // copy the menu price into the order
      deliveryDate: req.body.deliveryDate
    });
    res.status(201).json(order);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// GET /api/orders/:orderid
const ordersReadOne = async (req, res) => {
  try {
    const order = await Order.findById(req.params.orderid).populate('cake');
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.status(200).json(order);
  } catch (err) {
    res.status(500).json({ message: 'Error retrieving order', error: err.message });
  }
};

// PUT /api/orders/:orderid   (body: status and/or deliveryDate)
const ordersUpdateOne = async (req, res) => {
  try {
    const order = await Order.findById(req.params.orderid);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    if (req.body.status) order.status = req.body.status;
    if (req.body.deliveryDate) order.deliveryDate = req.body.deliveryDate;
    const updatedOrder = await order.save();
    res.status(200).json(updatedOrder);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// DELETE /api/orders/:orderid
const ordersDeleteOne = async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.orderid);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.status(204).json(null);
  } catch (err) {
    res.status(500).json({ message: 'Error deleting order', error: err.message });
  }
};

module.exports = { ordersList, ordersCreate, ordersReadOne, ordersUpdateOne, ordersDeleteOne };
