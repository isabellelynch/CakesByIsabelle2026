const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/main');

router.get('/', ctrl.home);
router.get('/login', ctrl.loginPage);
router.post('/login', ctrl.login);
router.get('/register', ctrl.registerPage);
router.post('/register', ctrl.register);
router.post('/logout', ctrl.logout);
router.get('/orders', ctrl.ordersPage);
router.post('/orders', ctrl.addOrder);

module.exports = router;