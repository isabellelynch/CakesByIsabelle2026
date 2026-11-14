const mongoose = require('mongoose');
const Order = mongoose.model('Order');
const Cake  = mongoose.model('Cake');

// GET /api/orders  - the logged-in user's orders, newest first
const ordersList = async (req, res) => {
  try {
    const orders = await Order.find({ email: req.user.email })
      .populate('cake')
      .sort({ orderDate: -1 });
    res.status(200).json(orders);
  } catch (err) {
    res.status(500).json({ message: 'Error retrieving orders', error: err.message });
  }
};

// POST /api/orders   (body: email, cake, deliveryDate)
const ordersCreate = async (req, res) => {
<<<<<<< HEAD
  const { cake: cakeId, deliveryDate } = req.body || {};
  const email = req.user.email;
  if (!cakeId || !deliveryDate) {
    return res.status(400).json({ message: 'cake and deliveryDate are both required' });
=======
  const { email, cake: cakeId, deliveryDate } = req.body || {};
  if (!email || !cakeId || !deliveryDate) {
    return res.status(400).json({ message: 'email, cake and deliveryDate are all required' });
>>>>>>> 88b44e1faa9bd83b706a65e32102f45fa8cd3ffa
  }
  try {
    const cake = await Cake.findById(cakeId);
    if (!cake) {
      return res.status(404).json({ message: 'Cake not found' });
    }
    const order = await Order.create({
<<<<<<< HEAD
      email: email,
      cake: cake._id,
      price: cake.price,               // copy the menu price into the order
      deliveryDate: deliveryDate
=======
      email,
      cake: cake._id,
      price: cake.price,               // copy the menu price into the order
      deliveryDate
>>>>>>> 88b44e1faa9bd83b706a65e32102f45fa8cd3ffa
    });
    res.status(201).json(order);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// GET /api/orders/:orderid
const ordersReadOne = async (req, res) => {
  try {
    const order = await Order.findOne({ _id: req.params.orderid, email: req.user.email }).populate('cake');
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
  const body = req.body || {};
  try {
    const order = await Order.findOne({ _id: req.params.orderid, email: req.user.email });
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    if (body.status) order.status = body.status;
    if (body.deliveryDate) order.deliveryDate = body.deliveryDate;
    const updatedOrder = await order.save();
    res.status(200).json(updatedOrder);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// DELETE /api/orders/:orderid
const ordersDeleteOne = async (req, res) => {
  try {
    const order = await Order.findOneAndDelete({ _id: req.params.orderid, email: req.user.email });
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.status(204).json(null);
  } catch (err) {
    res.status(500).json({ message: 'Error deleting order', error: err.message });
  }
};

module.exports = { ordersList, ordersCreate, ordersReadOne, ordersUpdateOne, ordersDeleteOne };
