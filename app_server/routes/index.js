const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.render('index', { title: 'Cakes By Isabelle', active: 'home' });
});

router.get('/login', (req, res) => {
  res.render('login', { title: 'Login', active: 'login' });
});

router.post('/login', (req, res) => {
  // check req.body.email / req.body.password here
  // on failure, re-render with a message instead of toggling #loginNote:
  res.render('login', { title: 'Login', active: 'login', error: 'Invalid details' });
});

router.get('/register', (req, res) => {
  res.render('register', { title: 'Register', active: 'register' });
});

router.get('/orders', (req, res) => {
  const orders = []; // get these from your data source / DB
  res.render('orders', { title: 'Orders', active: 'orders', orders });
});

router.post('/register', (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password || password.length < 8) {
    return res.render('register', { title: 'Register', active: 'register', error: 'Please fill in all fields (password 8+ characters).' });
  }
  // save the user here once you have a database
  res.redirect('/login');
});

module.exports = router;

