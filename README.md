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

## REST API

| Method | URL | Body | Success | Errors |
| --- | --- | --- | --- | --- |
| GET | /api/cakes | – | 200 list | 500 |
| POST | /api/cakes | id, name, desc, price | 201 cake | 400 |
| GET | /api/cakes/:cakeid | – | 200 cake | 404 |
| PUT | /api/cakes/:cakeid | name, desc and/or price | 200 cake | 400, 404 |
| DELETE | /api/cakes/:cakeid | – | 204 | 404 |
| GET | /api/orders?email=… | – | 200 list (cake populated) | 400 |
| POST | /api/orders | email, cake, deliveryDate | 201 order | 400, 404 |
| GET | /api/orders/:orderid | – | 200 order | 404 |
| PUT | /api/orders/:orderid | status and/or deliveryDate | 200 order | 400, 404 |
| DELETE | /api/orders/:orderid | – | 204 | 404 |

Every error response is JSON with a `message`, e.g. `{ "message": "Cake not found" }`.

A ready-made Postman collection is in `postman/CakesByIsabelle.postman_collection.json`
(Postman → Import). Change the `baseUrl` variable to your Render URL to test the live app.
