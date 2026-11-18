# Cakes by Isabelle

A web app for a small made-to-order bakery. Customers can browse the weekly cake menu, register, log in, place orders and track their own orders.

The project is built on the full MEAN stack: MongoDB Atlas, Express, Angular and Node.js. The Express app serves the Pug pages and the REST API, and the cake menu is an Angular component built into the same app, so everything runs from one address (port 3000 locally).

## Live site

| | URL |
|---|---|
| App | https://cakesbyisabelle.onrender.com |
| API | https://cakesbyisabelle.onrender.com/api/cakes |

> The site runs on Render's free plan, which sleeps after 15 minutes without visitors. The first load after that can take about a minute.

## Features

- **Menu (Angular):** the home page menu is an Angular component. Its `CakeData` service sends an HTTP GET to `/api/cakes` and shows each cake as a responsive Bootstrap card, with prices formatted by a custom `price` pipe.
- **Register and log in (Passport.js):** login uses Passport's LocalStrategy. Passwords are hashed with bcrypt, and a new account is logged in straight away.
- **Sessions:** Passport keeps users logged in through `express-session`. Sessions are stored in MongoDB Atlas (`connect-mongo`), so users stay logged in when the server restarts.
- **HTTPS:** locally the app runs on HTTPS with a self-signed certificate. On Render, HTTPS is provided by Render. The session cookie is `httpOnly`, `sameSite` and `secure` over HTTPS.
- **My Orders:** the data screen shows only the logged-in customer's orders, newest first, with a colour-coded status (pending, baking, ready, delivered, cancelled).
- **Place an order:** the **+** button on a menu card creates an order. It copies the cake's current price and sets collection for three days later.
- **REST API:** JSON endpoints with full CRUD for cakes and orders, plus validation and error messages. The Express page controllers call this API rather than the database directly. Order routes and any changes to the menu require a login.
- **Responsive design:** a mobile-first layout with a collapsing navbar, a grid that goes from 1 to 3 columns, and forms that narrow as the screen widens.

## Tech stack

| Layer | Technology |
|---|---|
| Runtime | Node.js (>= 20) |
| Web framework | Express 5 |
| Templates | Pug |
| Front-end component | Angular |
| UI | Bootstrap 5.3, Google Fonts (Fraunces and Work Sans) |
| Database | MongoDB Atlas, via Mongoose |
| Authentication | Passport.js (passport-local), bcrypt.js |
| Sessions | express-session, stored in Atlas with connect-mongo |
| API calls from Express | axios |
| Config | dotenv |
| Hosting | Render |

## Run it locally

**Requirements:** Node.js 20 or newer, a MongoDB Atlas cluster, and OpenSSL (included with Git for Windows).

```bash
git clone https://github.com/isabellelynch/CakesByIsabelle2026.git
cd CakesByIsabelle2026
npm install
cp .env.example .env
```

### HTTPS certificate

Create a self-signed certificate for `localhost` in a `sslcert` folder. The folder is git-ignored, so the private key is never pushed to GitHub.

```bash
mkdir sslcert
openssl req -x509 -newkey rsa:2048 -nodes -keyout sslcert/key.pem -out sslcert/cert.pem -days 365 -subj "/CN=localhost" -addext "subjectAltName=DNS:localhost"
```

On Windows, run this in Command Prompt using Git's copy of OpenSSL (`"C:\Program Files\Git\usr\bin\openssl.exe"`). In Git Bash, write `-subj "//CN=localhost"` instead.

Then start the app:

```bash
npm start
```

Open https://localhost:3000. Because the certificate is self-signed, the browser shows a warning the first time: choose **Advanced → Proceed**. Without the `sslcert` folder the app still runs, on plain http://localhost:3000.

### Environment variables

| Variable | What it is |
|---|---|
| `MONGODB_URI` | Your Atlas connection string, including the database name, e.g. `mongodb+srv://USER:PASSWORD@cluster.../myapp` |
| `SESSION_SECRET` | Any long random string, used to sign the session cookie |
| `NODE_ENV` | Set to `production` on Render only. Leave it out locally. |

`.env` is git-ignored, so the database password is never pushed to GitHub. On Render, the same values are set under **Environment**.

### Rebuilding the Angular component

The Angular source is in `cakes-public`. After changing it, rebuild it and copy the build into the Express app:

```bash
cd cakes-public
npm install
npx ng build --output-path build --output-hashing none
cd ..
cp cakes-public/build/browser/main.js cakes-public/build/browser/styles.css app_public/build/
```

`index.pug` loads `/build/main.js`, and the `<app-home-list>` tag is where Angular draws the menu.

## Project structure

The app follows the MVC pattern from the Loc8r labs. A route passes each request to a controller. Page controllers get their data from the REST API, the API controllers use the Mongoose models and a Pug view returns the finished page.

```
app.js                  Express setup, sessions, Passport, routers, error handler
bin/www                 Starts the server (HTTPS locally, HTTP behind Render)
config/
  passport.js           Passport LocalStrategy, serializeUser/deserializeUser
  ssl.js                Loads the local certificate if there is one
app_server/
  api.js                axios client the page controllers use to call the API
  controllers/main.js   Page controllers (menu, login, register, orders)
  routes/index.js       Page routes
  views/                layout, index, login, register, orders, error + mixins/icons
app_api/
  controllers/          cakes.js, orders.js
  models/               db.js (Atlas connection), cake.js, order.js, user.js
  routes/index.js       API routes, mounted at /api, with login checks
app_public/build/       Built Angular component served by Express
cakes-public/           Angular source (HomeList component, CakeData service, price pipe)
public/                 Stylesheets, scripts, Bootstrap
postman/                Postman test collection
```

## Pages

| Method | URL | What it does | Login needed |
|---|---|---|---|
| GET | `/` | Home page and cake menu (Angular) | No |
| GET / POST | `/register` | Registration form / create account and log in | No |
| GET / POST | `/login` | Login form / log in with Passport | No |
| GET | `/orders` | My Orders | Yes |
| POST | `/orders` | Place an order | Yes |
| POST | `/logout` | Log out | Yes |

## API

All responses are JSON. Errors return a `message` field, e.g. `{ "message": "Cake not found" }`. A request to a protected route without a login returns `401` with `{ "message": "You must be logged in to do that" }`.

| Method | URL | Action | Login needed | Success | Errors |
|---|---|---|---|---|---|
| GET | `/api/cakes` | List all cakes | No | 200 | 500 |
| POST | `/api/cakes` | Add a cake | Yes | 201 | 400, 401 |
| GET | `/api/cakes/:cakeid` | Read one cake | No | 200 | 404 |
| PUT | `/api/cakes/:cakeid` | Update a cake | Yes | 200 | 400, 401, 404 |
| DELETE | `/api/cakes/:cakeid` | Delete a cake | Yes | 204 | 401, 404 |
| GET | `/api/orders` | List the logged-in customer's orders, newest first | Yes | 200 | 401 |
| POST | `/api/orders` | Place an order for the logged-in customer | Yes | 201 | 400, 401, 404 |
| GET | `/api/orders/:orderid` | Read one of your orders (with the cake populated) | Yes | 200 | 401, 404 |
| PUT | `/api/orders/:orderid` | Update status or delivery date | Yes | 200 | 400, 401, 404 |
| DELETE | `/api/orders/:orderid` | Cancel or delete one of your orders | Yes | 204 | 401, 404 |

Customers can only read, change or delete their own orders. The email always comes from the login session, never from the request.

POST and PUT bodies are sent as `x-www-form-urlencoded`.

## Testing with Postman

The `postman/CakesByIsabelle.postman_collection.json` collection has 17 requests covering login, the cake and order endpoints, and the error cases.

1. In Postman, click **Import** and select the collection file.
2. In the collection's **Variables** tab, set `email` and `password` to a real account. Use the **Current value** column so the password isn't saved in the file.
3. The `baseUrl` variable points at the Render site. To test locally, change it to `https://localhost:3000` and turn off **Settings → General → SSL certificate verification**, because the local certificate is self-signed.
4. Open the collection's **⋯** menu, choose **Run collection**, then click **Run**.

The collection first logs out and checks that protected routes return 401, then tries a wrong password and logs in. Postman keeps the session cookie, so the order tests run as that user. "Place order" saves the new order's id, and the tests after it read, update and then delete that same order, so running the collection leaves the database as it was. It ends by logging out and checking the API refuses again.

## Data model

| Collection | Fields |
|---|---|
| `cakes` | `_id` (short id, e.g. `c1`), `name`, `desc`, `price` |
| `orders` | `_id` (order number), `email`, `cake` (ref to Cake), `price`, `status`, `orderDate`, `deliveryDate` |
| `users` | `name`, `email` (unique), `password` (bcrypt hash), `createdAt`, `updatedAt` |
| `sessions` | Login sessions, created and managed by connect-mongo |

Each order stores its own price, so a past order keeps the price paid even if the menu price changes later.

## Author

Isabelle Lynch (T00264026)
