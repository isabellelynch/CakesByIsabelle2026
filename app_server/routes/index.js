const express = require('express');
const router = express.Router();
const ctrlMain = require('../controllers/main');

router.get('/',          ctrlMain.index);
router.get('/orders',    ctrlMain.orders);
router.post('/orders',   ctrlMain.placeOrder);
router.get('/login',     ctrlMain.loginPage);
router.post('/login',    ctrlMain.loginPost);
router.get('/register',  ctrlMain.registerPage);
router.post('/register', ctrlMain.registerPost);
router.post('/logout',   ctrlMain.logout);

module.exports = router;
