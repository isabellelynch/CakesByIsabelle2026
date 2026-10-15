# Cakes by Isabelle

A small-bakery web app built with the MEAN stack (MongoDB Atlas, Express, Angular – coming in part 2 – and Node).
Customers browse the weekly menu, register, log in, place orders and see their own orders.

## Run it locally

1. `npm install`
2. Copy `.env.example` to `.env` and fill in your Atlas connection string and a session secret.
3. `npm start` and open http://localhost:3000

## Structure (MVC)

```
app.js                 Express setup, sessions, mounts /api and the page routes
app_api/
  models/              db.js (Atlas connection), cake.js, order.js, user.js
  controllers/         cakes.js, orders.js  – REST API, JSON responses
  routes/index.js      /api/cakes, /api/orders
app_server/
  controllers/main.js  page controllers
  routes/index.js      /, /orders, /login, /register, /logout
  views/               Pug templates (layout, index, login, register, orders, error)
public/                Bootstrap 5, Font Awesome, style.css
```