const mongoose = require('mongoose');
const Cake  = mongoose.model('Cake');
const Order = mongoose.model('Order');
const User  = mongoose.model('User');

// Home page – list cakes
const index = async (req, res, next) => {
  try {
    const cakes = await Cake.find();
    res.render('index', { title: 'Cakes by Isabelle', active: 'home', cakes });
  } catch (err) { next(err); }
};

// Orders page
const orders = async (req, res, next) => {
  if (!req.session.user) return res.redirect('/login');   // must be logged in

  try {
    const orders = await Order.find({ email: req.session.user.email })
      .populate('cake')
      .sort({ orderDate: -1 });
    res.render('orders', { title: 'My Orders', active: 'orders', orders });
  } catch (err) { next(err); }
};

// Place an order (the "+" button on the menu)
const placeOrder = async (req, res, next) => {
  if (!req.session.user) return res.redirect('/login');   // must be logged in

  try {
    const cake = await Cake.findById(req.body.cakeId);
    if (!cake) return res.redirect('/');

    // ready for collection in 3 days
    const deliveryDate = new Date();
    deliveryDate.setDate(deliveryDate.getDate() + 3);

    await Order.create({
      email: req.session.user.email,
      cake: cake._id,
      price: cake.price,
      deliveryDate: deliveryDate
    });
    res.redirect('/orders');
  } catch (err) { next(err); }
};

const logout = (req, res) => {
  req.session.destroy(() => res.redirect('/'));
};

// Login
const loginPage = (req, res) => {
  res.render('login', { title: 'Log in', active: 'login' });
};

const loginPost = async (req, res, next) => {
  const values = { email: req.body.email };
  const errors = {};
  if (!req.body.email) errors.email = 'Please enter your email';
  if (!req.body.password) errors.password = 'Please enter your password';
  if (errors.email || errors.password) {
    return res.render('login', { title: 'Log in', active: 'login', errors, values });
  }

  try {
    const user = await User.findOne({ email: req.body.email.toLowerCase() });
    if (!user || !(await user.checkPassword(req.body.password))) {
      errors.password = 'Incorrect email or password';
      return res.render('login', { title: 'Log in', active: 'login', errors, values });
    }
    req.session.user = { id: user._id, name: user.name, email: user.email };
    res.redirect('/orders');
  } catch (err) { next(err); }
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

  try {
    await User.create({ name: req.body.name, email: req.body.email, password: req.body.password });
    res.redirect('/login');
  } catch (err) {
    if (err.code === 11000) errors.email = 'That email is already registered';
    else errors.email = err.message;
    res.render('register', { title: 'Register', active: 'register', errors, values });
  }
};

module.exports = { index, orders, placeOrder, loginPage, loginPost, registerPage, registerPost, logout };
