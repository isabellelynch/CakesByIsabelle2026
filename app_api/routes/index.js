const express = require('express');
const router = express.Router();
const ctrlCakes  = require('../controllers/cakes');
const ctrlOrders = require('../controllers/orders');

// cakes
router
  .route('/cakes')
  .get(ctrlCakes.cakesList)
  .post(ctrlCakes.cakesCreate);

router
  .route('/cakes/:cakeid')
  .get(ctrlCakes.cakesReadOne)
  .put(ctrlCakes.cakesUpdateOne)
  .delete(ctrlCakes.cakesDeleteOne);

// orders
router
  .route('/orders')
  .get(ctrlOrders.ordersList)
  .post(ctrlOrders.ordersCreate);

router
  .route('/orders/:orderid')
  .get(ctrlOrders.ordersReadOne)
  .put(ctrlOrders.ordersUpdateOne)
  .delete(ctrlOrders.ordersDeleteOne);

module.exports = router;
