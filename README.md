# Cakes by Isabelle

A web app for a small made-to-order bakery. Customers can browse the weekly cake menu, register, log in, place orders and track their own orders.

The project is built on the MEAN stack. This first half (50% submission, October 2026) covers the Node.js and Express back end, Pug views, MongoDB Atlas and a REST API. The Angular front end comes in part 2.

## Live site

| | URL |
|---|---|
| App | https://cakesbyisabelle.onrender.com |
| API | https://cakesbyisabelle.onrender.com/api/cakes |

> The site runs on Render's free plan, which sleeps after 15 minutes without visitors. The first load after that can take about a minute.

## Features

- **Menu:** the home page lists the current cakes from the database as responsive Bootstrap cards.
- **Register and log in:** passwords are hashed with bcrypt, and users stay logged in through an `express-session` session.
- **My Orders:** the data screen shows only the logged-in customer's orders, newest first, with a colour-coded status (pending, baking, ready, delivered, cancelled).
- **Place an order:** the **+** button on a menu card creates an order. It copies the cake's current price and sets collection for three days later.
- **REST API:** JSON endpoints with full CRUD for cakes and orders, plus validation and error messages.
- **Responsive design:** a mobile-first layout with a collapsing navbar, a grid that goes from 1 to 3 columns, and forms that narrow as the screen widens.

## Tech stack

| Layer | Technology |
|---|---|
| Runtime | Node.js (>= 20) |
| Web framework | Express 5 |
| Templates | Pug |
| UI | Bootstrap 5.3, Font Awesome 4.7, Google Fonts (Fraunces and Work Sans) |
| Database | MongoDB Atlas, via Mongoose |
| Sessions | express-session |
| Password hashing | bcrypt.js |
| Config | dotenv |
| Hosting | Render |

## Run it locally

**Requirements:** Node.js 20 or newer and a MongoDB Atlas cluster.

```bash
git clone https://github.com/isabellelynch/CakesByIsabelle2026.git
cd CakesByIsabelle2026
npm install
cp .env.example .env      # then fill in the values below
npm start
```

Then open http://localhost:3000.

### Environment variables

| Variable | What it is |
|---|---|
| `MONGODB_URI` | Your Atlas connection string, including the database name, e.g. `mongodb+srv://USER:PASSWORD@cluster.../myapp` |
| `SESSION_SECRET` | Any long random string, used to sign the session cookie |

`.env` is git-ignored, so the database password is never pushed to GitHub. On Render, the same two values are set under **Environment**.

## Project structure

The app follows the MVC pattern from the Loc8r labs. A route passes each request to a controller, the controller gets data through the Mongoose models, and a Pug view returns the finished page.

```
app.js                  Express setup, sessions, routers, error handler
bin/www                 Starts the server on process.env.PORT
app_server/
  controllers/main.js   Page controllers (menu, login, register, orders)
  routes/index.js       Page routes
  views/                layout, index, login, register, orders, error + mixins/icons
app_api/
  controllers/          cakes.js, orders.js
  models/               db.js (Atlas connection), cake.js, order.js, user.js
  routes/index.js       API routes, mounted at /api
public/                 Stylesheets, scripts, Bootstrap
postman/                Postman test collection
```

## Pages

| Method | URL | What it does | Login needed |
|---|---|---|---|
| GET | `/` | Home page and cake menu | No |
| GET / POST | `/register` | Registration form / create account | No |
| GET / POST | `/login` | Login form / log in | No |
| GET | `/orders` | My Orders | Yes |
| POST | `/orders` | Place an order | Yes |
| POST | `/logout` | Log out | Yes |

## API

All responses are JSON. Errors return a `message` field, e.g. `{ "message": "Cake not found" }`.

| Method | URL | Action | Success | Errors |
|---|---|---|---|---|
| GET | `/api/cakes` | List all cakes | 200 | 500 |
| POST | `/api/cakes` | Add a cake | 201 | 400 |
| GET | `/api/cakes/:cakeid` | Read one cake | 200 | 404 |
| PUT | `/api/cakes/:cakeid` | Update a cake | 200 | 400, 404 |
| DELETE | `/api/cakes/:cakeid` | Delete a cake | 204 | 404 |
| GET | `/api/orders?email=` | List one customer's orders, newest first | 200 | 400 |
| POST | `/api/orders` | Place an order | 201 | 400, 404 |
| GET | `/api/orders/:orderid` | Read one order (with the cake populated) | 200 | 404 |
| PUT | `/api/orders/:orderid` | Update status or delivery date | 200 | 400, 404 |
| DELETE | `/api/orders/:orderid` | Cancel or delete an order | 204 | 404 |

POST and PUT bodies are sent as `x-www-form-urlencoded`.

## Testing with Postman

The `postman/CakesByIsabelle.postman_collection.json` collection has 10 tests covering the cake and order endpoints, including the error cases.

1. In Postman, click **Import** and select the collection file.
2. The `baseUrl` variable points at the Render site. To test locally, change it to `http://localhost:3000` in the collection's **Variables** tab.
3. Open the collection's **⋯** menu, choose **Run collection**, then click **Run**.

The "Place order" test saves the new order's id. The tests after it read, update and then delete that same order, so running the collection leaves the database as it was.

## Data model

| Collection | Fields |
|---|---|
| `cakes` | `_id` (short id, e.g. `c1`), `name`, `desc`, `price` |
| `orders` | `_id` (order number), `email`, `cake` (ref to Cake), `price`, `status`, `orderDate`, `deliveryDate` |
| `users` | `name`, `email` (unique), `password` (bcrypt hash), `createdAt`, `updatedAt` |

Each order stores its own price, so a past order keeps the price paid even if the menu price changes later.

## Coming in part 2

- Call the API from the Express controllers instead of using Mongoose directly
- Build the My Orders screen as an Angular component that uses the API
- Move login and registration to Passport.js and run the app over HTTPS
- Deploy the final version to Render

## Author

Isabelle Lynch (T00264026)
