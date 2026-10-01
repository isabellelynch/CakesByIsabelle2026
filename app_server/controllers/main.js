const cakes = require('../data/cakes.json');
const store = require('../data/users');

const isValidEmail = v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
const today = () => new Date().toLocaleDateString('en-IE', { day: 'numeric', month: 'short' });

// ---------- home ----------
const home = (req, res) => {
  res.render('index', { title: 'Home', active: 'home', cakes });
};

// ---------- login ----------
const loginPage = (req, res) => {
  res.render('login', { title: 'Login', active: 'login', errors: {}, values: {} });
};

const login = (req, res) => {
  const email = (req.body.email || '').trim().toLowerCase();
  const password = req.body.password || '';
  const errors = {};

  if (!isValidEmail(email)) errors.email = 'Enter a valid email address.';
  if (!password) errors.password = 'Enter your password.';

  const user = store.users[email];
  if (!Object.keys(errors).length && (!user || user.password !== password)) {
    errors.password = 'Email or password is incorrect.';
  }
  if (Object.keys(errors).length) {
    return res.render('login', { title: 'Login', active: 'login', errors, values: { email } });
  }

  req.session.user = { email, name: user.name };
  res.redirect('/orders');
};

// ---------- register ----------
const registerPage = (req, res) => {
  res.render('register', { title: 'Register', active: 'register', errors: {}, values: {} });
};

const register = (req, res) => {
  const name = (req.body.name || '').trim();
  const email = (req.body.email || '').trim().toLowerCase();
  const password = req.body.password || '';
  const errors = {};

  if (name.length < 2) errors.name = 'Enter your full name.';
  if (!isValidEmail(email)) errors.email = 'Enter a valid email address.';
  else if (store.users[email]) errors.email = 'An account with this email already exists.';
  if (password.length < 8) errors.password = 'Use at least 8 characters.';

  if (Object.keys(errors).length) {
    return res.render('register', { title: 'Register', active: 'register', errors, values: { name, email } });
  }

  store.users[email] = { name, password };
  store.orders[email] = [];
  req.session.user = { email, name };
  res.redirect('/orders');
};

const logout = (req, res) => {
  req.session.destroy(() => res.redirect('/'));
};

// ---------- orders ----------
const ordersPage = (req, res) => {
  const user = req.session.user;
  res.render('orders', {
    title: 'My Orders',
    active: 'orders',
    orders: user ? (store.orders[user.email] || []) : []
  });
};

const addOrder = (req, res) => {
  const cake = cakes.find(c => c.id === req.body.cakeId);
  if (!cake) return res.redirect('/');

  const user = req.session.user;
  if (!user) {
    return res.render('login', {
      title: 'Login', active: 'login', errors: {}, values: {},
      note: `Log in (or create an account) to order the ${cake.name}.`
    });
  }

  (store.orders[user.email] ||= []).unshift({
    id: 'o' + Math.floor(1000 + Math.random() * 9000),
    cake: cake.name,
    date: today(),
    status: 'baking',
    price: cake.price
  });
  res.redirect('/orders');
};

module.exports = { home, loginPage, login, registerPage, register, logout, ordersPage, addOrder };