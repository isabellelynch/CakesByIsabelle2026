const mongoose = require('mongoose');
const passport = require('passport');
const api = require('../api');
const User = mongoose.model('User');

// Pass the browser's session cookie on to the API, so the API knows who is logged in
const withCookie = (req) => ({ headers: { cookie: req.headers.cookie || '' } });

// Home page – list cakes (from GET /api/cakes)
const index = async (req, res, next) => {
  try {
    const response = await api.get('/cakes');
    if (response.status !== 200) {
      return next(new Error(response.data.message || 'Could not load the menu'));
    }
    res.render('index', { title: 'Cakes by Isabelle', active: 'home', cakes: response.data });
  } catch (err) { next(err); }
};

// Orders page (from GET /api/orders)
const orders = async (req, res, next) => {
  if (!req.isAuthenticated()) return res.redirect('/login');   // must be logged in

  try {
    const response = await api.get('/orders', withCookie(req));
    if (response.status !== 200) {
      return next(new Error(response.data.message || 'Could not load your orders'));
    }
    // JSON sends dates as text, so turn them back into Date objects for the view
    const orders = response.data.map(o => ({
      ...o,
      orderDate: new Date(o.orderDate),
      deliveryDate: new Date(o.deliveryDate)
    }));
    res.render('orders', { title: 'My Orders', active: 'orders', orders });
  } catch (err) { next(err); }
};

// Place an order (the "+" button on the menu) – POST /api/orders
const placeOrder = async (req, res, next) => {
  if (!req.isAuthenticated()) return res.redirect('/login');   // must be logged in

  // ready for collection in 3 days
  const deliveryDate = new Date();
  deliveryDate.setDate(deliveryDate.getDate() + 3);

  try {
    const response = await api.post('/orders',
      { cake: req.body.cakeId, deliveryDate },
      withCookie(req));
    if (response.status === 404) return res.redirect('/');   // cake not on the menu
    if (response.status !== 201) {
      return next(new Error(response.data.message || 'Could not place your order'));
    }
    res.redirect('/orders');
  } catch (err) { next(err); }
};

const logout = (req, res, next) => {
  req.logout(err => {
    if (err) return next(err);
    req.session.destroy(() => res.redirect('/'));
  });
};

// Login
const loginPage = (req, res) => {
  res.render('login', { title: 'Log in', active: 'login' });
};

const loginPost = (req, res, next) => {
  const values = { email: req.body.email };
  const errors = {};
  if (!req.body.email) errors.email = 'Please enter your email';
  if (!req.body.password) errors.password = 'Please enter your password';
  if (errors.email || errors.password) {
    return res.render('login', { title: 'Log in', active: 'login', errors, values });
  }

  // Passport checks the email and password using the LocalStrategy in config/passport.js
  passport.authenticate('local', (err, user, info) => {
    if (err) return next(err);
    if (!user) {
      errors.password = info ? info.message : 'Incorrect email or password';
      return res.render('login', { title: 'Log in', active: 'login', errors, values });
    }
    req.login(user, err => {
      if (err) return next(err);
      res.redirect('/orders');
    });
  })(req, res, next);
};

// Register
const registerPage = (req, res) => {
  res.render('register', { title: 'Register', active: 'register' });
};

const registerPost = async (req, res, next) => {
  const values = { name: req.body.name, email: req.body.email };
  const errors = {};
  if (!req.body.name) errors.name = 'Please enter your name';
  if (!req.body.email) errors.email = 'Please enter your email';
  if (!req.body.password || req.body.password.length < 8) errors.password = 'Password must be at least 8 characters';
  if (errors.name || errors.email || errors.password) {
    return res.render('register', { title: 'Register', active: 'register', errors, values });
  }

  let user;
  try {
    user = await User.create({ name: req.body.name, email: req.body.email, password: req.body.password });
  } catch (err) {
    if (err.code === 11000) errors.email = 'That email is already registered';
    else errors.email = err.message;
    return res.render('register', { title: 'Register', active: 'register', errors, values });
  }

  // Log the new user straight in with Passport
  req.login(user, err => {
    if (err) return next(err);
    res.redirect('/orders');
  });
};

module.exports = { index, orders, placeOrder, loginPage, loginPost, registerPage, registerPost, logout };