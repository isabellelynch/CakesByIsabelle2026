const express = require('express');
const router = express.Router();
const ctrlCakes  = require('../controllers/cakes');
const ctrlOrders = require('../controllers/orders');

// Only logged-in users (Passport session) can use protected routes
const requireLogin = (req, res, next) => {
  if (req.isAuthenticated()) return next();
  res.status(401).json({ message: 'You must be logged in to do that' });
};

// cakes - anyone can read the menu, only logged-in users can change it
router
  .route('/cakes')
  .get(ctrlCakes.cakesList)
  .post(requireLogin, ctrlCakes.cakesCreate);

router
  .route('/cakes/:cakeid')
  .get(ctrlCakes.cakesReadOne)
  .put(requireLogin, ctrlCakes.cakesUpdateOne)
  .delete(requireLogin, ctrlCakes.cakesDeleteOne);

// orders - always the logged-in user's own orders
router
  .route('/orders')
  .get(requireLogin, ctrlOrders.ordersList)
  .post(requireLogin, ctrlOrders.ordersCreate);

router
  .route('/orders/:orderid')
  .get(requireLogin, ctrlOrders.ordersReadOne)
  .put(requireLogin, ctrlOrders.ordersUpdateOne)
  .delete(requireLogin, ctrlOrders.ordersDeleteOne);

module.exports = router;