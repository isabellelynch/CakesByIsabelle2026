const Cake  = require('../models/cake');
const Order = require('../models/order');
const User  = require('../models/user');

// Home page – list cakes
const index = async (req, res, next) => {
  try {
    const cakes = await Cake.find();
    res.render('index', { title: 'Cakes by Isabelle', cakes });
  } catch (err) { next(err); }
};

// Orders page
const orders = async (req, res, next) => {
  if (!req.session.user) return res.redirect('/login');   // must be logged in

  try {
    const orders = await Order.find({ email: req.session.user.email })
      .populate('cake')
      .sort({ orderDate: -1 });
    res.render('orders', { title: 'My Orders', orders });
  } catch (err) { next(err); }
};

const logout = (req, res) => {
  req.session.destroy(() => res.redirect('/'));
};

// Login
const loginPage = (req, res) => {
  res.render('login', { title: 'Log in' });
};

const loginPost = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email.toLowerCase() });
    if (!user || !(await user.checkPassword(req.body.password))) {
      return res.render('login', { title: 'Log in', error: 'Incorrect email or password' });
    }
    req.session.user = { id: user._id, name: user.name, email: user.email };
    res.redirect('/orders');
  } catch (err) { next(err); }
};

// Register
const registerPage = (req, res) => {
  res.render('register', { title: 'Register' });
};

const registerPost = async (req, res, next) => {
  try {
    await User.create({ name: req.body.name, email: req.body.email, password: req.body.password });
    res.redirect('/login');
  } catch (err) {
    const error = err.code === 11000 ? 'That email is already registered' : err.message;
    res.render('register', { title: 'Register', error });
  }
};

module.exports = { index, orders, loginPage, loginPost, registerPage, registerPost, logout };