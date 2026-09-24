
  // ---------- mock data ----------
  const CAKES = [
    { id: 'c1', name: 'Rosewater Vanilla', desc: 'Vanilla sponge, rosewater cream, sugared petals.', price: 32 },
    { id: 'c2', name: 'Salted Caramel Stack', desc: 'Brown butter layers with a soft caramel drip.', price: 36 },
    { id: 'c3', name: 'Chocolate Hazelnut', desc: 'Dark cocoa sponge, toasted hazelnut praline.', price: 34 },
    { id: 'c4', name: 'Strawberry Cream', desc: 'Fresh strawberries folded through vanilla cream.', price: 30 },
    { id: 'c5', name: 'Pistachio Rose', desc: 'Pistachio sponge, honey-rose buttercream.', price: 38 },
    { id: 'c6', name: 'Classic Red Velvet', desc: 'Cocoa sponge, tangy cream cheese frosting.', price: 33 },
  ];

  function cakeIcon() {
    return `<svg viewBox="0 0 88 88" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <ellipse cx="44" cy="74" rx="30" ry="5" fill="var(--pink-blush)"/>
      <rect x="18" y="46" width="52" height="22" rx="5" fill="var(--brown-soft)"/>
      <rect x="24" y="26" width="40" height="22" rx="5" fill="var(--pink)"/>
      <path d="M24 48c3-4 6 4 9 0s6 4 9 0 6 4 9 0 6 4 9 0" stroke="var(--pink-blush)" stroke-width="2.5" fill="none" stroke-linecap="round"/>
      <circle cx="44" cy="18" r="5" fill="#C24B67"/>
      <path d="M44 13c0-5 4-8 6-9" stroke="var(--brown-mid)" stroke-width="2" fill="none" stroke-linecap="round"/>
    </svg>`;
  }

  function orderIcon() {
    return `<svg viewBox="0 0 52 52" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <rect x="8" y="26" width="36" height="18" rx="4" fill="var(--brown-soft)"/>
      <rect x="12" y="14" width="28" height="14" rx="4" fill="var(--pink)"/>
      <circle cx="26" cy="9" r="3.4" fill="#C24B67"/>
    </svg>`;
  }

  function renderMenu() {
    const grid = document.getElementById('cakeGrid');
    grid.innerHTML = CAKES.map(c => `
      <div class="cake-card">
        <div class="cake-icon-wrap">${cakeIcon()}</div>
        <h3>${c.name}</h3>
        <div class="desc">${c.desc}</div>
        <div class="add-row">
          <span class="price-tag">€${c.price}</span>
          <button class="add-btn" aria-label="Add ${c.name} to order" onclick="addOrder('${c.id}')">+</button>
        </div>
      </div>
    `).join('');
  }

  // ---------- storage helpers (per-browser demo data) ----------
  const LS_USERS = 'cc_users';
  const LS_SESSION = 'cc_session';
  const LS_ORDERS = 'cc_orders';

  function readJSON(key, fallback) {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch (e) { return fallback; }
  }
  function writeJSON(key, val) {
    try { localStorage.setItem(key, JSON.stringify(val)); } catch (e) {}
  }

  function getUsers() { return readJSON(LS_USERS, {}); }
  function getSession() { return readJSON(LS_SESSION, null); }
  function getOrders() { return readJSON(LS_ORDERS, {}); }

  function seedOrdersFor(email) {
    const all = getOrders();
    if (!all[email]) {
      all[email] = [
        { id: 'o1001', cake: 'Salted Caramel Stack', date: 'Sep 12', status: 'delivered', price: 36 },
        { id: 'o1002', cake: 'Pistachio Rose', date: 'Sep 15', status: 'baking', price: 38 },
      ];
      writeJSON(LS_ORDERS, all);
    }
  }

  function addOrder(cakeId) {
    const session = getSession();
    const cake = CAKES.find(c => c.id === cakeId);
    if (!session) {
      go('login');
      showNote('loginNote', `Log in (or create an account) to order the ${cake.name}.`);
      return;
    }
    const all = getOrders();
    const list = all[session.email] || [];
    list.unshift({
      id: 'o' + Math.floor(1000 + Math.random() * 9000),
      cake: cake.name,
      date: 'Today',
      status: 'baking',
      price: cake.price
    });
    all[session.email] = list;
    writeJSON(LS_ORDERS, all);
    go('orders');
  }

  // ---------- validation ----------
  function setError(id, msg) { document.getElementById(id).textContent = msg || ''; }
  function isValidEmail(v) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v); }

  function handleRegister(e) {
    e.preventDefault();
    const name = document.getElementById('regName').value.trim();
    const email = document.getElementById('regEmail').value.trim().toLowerCase();
    const password = document.getElementById('regPassword').value;
    let ok = true;

    setError('regNameError', ''); setError('regEmailError', ''); setError('regPasswordError', '');

    if (name.length < 2) { setError('regNameError', 'Enter your full name.'); ok = false; }
    if (!isValidEmail(email)) { setError('regEmailError', 'Enter a valid email address.'); ok = false; }
    if (password.length < 8) { setError('regPasswordError', 'Use at least 8 characters.'); ok = false; }
    if (!ok) return false;

    const users = getUsers();
    if (users[email]) {
      setError('regEmailError', 'An account with this email already exists.');
      return false;
    }
    users[email] = { name, password };
    writeJSON(LS_USERS, users);
    seedOrdersFor(email);
    writeJSON(LS_SESSION, { email, name });
    updateSessionUI();
    go('orders');
    return false;
  }

  function handleLogin(e) {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value.trim().toLowerCase();
    const password = document.getElementById('loginPassword').value;
    let ok = true;

    setError('loginEmailError', ''); setError('loginPasswordError', '');
    document.getElementById('loginNote').style.display = 'none';

    if (!isValidEmail(email)) { setError('loginEmailError', 'Enter a valid email address.'); ok = false; }
    if (password.length < 1) { setError('loginPasswordError', 'Enter your password.'); ok = false; }
    if (!ok) return false;

    const users = getUsers();
    const user = users[email];
    if (!user || user.password !== password) {
      setError('loginPasswordError', 'Email or password is incorrect.');
      return false;
    }
    seedOrdersFor(email);
    writeJSON(LS_SESSION, { email, name: user.name });
    updateSessionUI();
    go('orders');
    return false;
  }

  function signOut() {
    localStorage.removeItem(LS_SESSION);
    updateSessionUI();
    go('home');
  }

  function showNote(id, msg) {
    const el = document.getElementById(id);
    el.textContent = msg;
    el.style.display = 'block';
  }

  // ---------- orders screen ----------
  function renderOrders() {
    const session = getSession();
    const loggedOut = document.getElementById('ordersLoggedOut');
    const loggedIn = document.getElementById('ordersLoggedIn');

    if (!session) {
      loggedOut.style.display = 'block';
      loggedIn.style.display = 'none';
      return;
    }
    loggedOut.style.display = 'none';
    loggedIn.style.display = 'block';

    document.getElementById('ordersSubtitle').textContent = `Signed in as ${session.name}`;
    const all = getOrders();
    const list = all[session.email] || [];
    const listEl = document.getElementById('ordersList');

    if (list.length === 0) {
      listEl.innerHTML = `
        <div class="empty-state">
          ${orderIcon()}
          <h3>No orders yet</h3>
          <p>Head to the menu and pick something for the weekend.</p>
        </div>`;
      return;
    }

    const statusLabel = { baking: 'Baking', ready: 'Ready for pickup', delivered: 'Delivered' };
    const statusClass = { baking: 'status-baking', ready: 'status-ready', delivered: 'status-delivered' };

    listEl.innerHTML = list.map(o => `
      <div class="order-card">
        <div class="icon">${orderIcon()}</div>
        <div class="order-info">
          <h3>${o.cake}</h3>
          <div class="meta">Order #${o.id} · ${o.date}</div>
        </div>
        <span class="status-pill ${statusClass[o.status]}">${statusLabel[o.status]}</span>
        <div class="order-price">€${o.price}</div>
      </div>
    `).join('');
  }

  // ---------- session UI ----------
  function updateSessionUI() {
    const session = getSession();
    const label = document.getElementById('sessionLabel');
    const signOutBtn = document.getElementById('signOutBtn');
    if (session) {
      label.textContent = `Hi, ${session.name.split(' ')[0]}`;
      signOutBtn.style.display = 'inline-block';
    } else {
      label.textContent = 'Not signed in';
      signOutBtn.style.display = 'none';
    }
  }

  // ---------- routing ----------
  const ROUTES = ['home', 'login', 'register', 'orders'];

  function go(route) {
    if(route == null || route == undefined) return;
    if (!ROUTES.includes(route)) route = 'home';
    ROUTES.forEach(r => {
      document.getElementById('screen-' + r).classList.toggle('active', r === route);
    });
    document.querySelectorAll('nav.tabs button').forEach(btn => {
      if (btn.dataset.route === route) btn.setAttribute('aria-current', 'page');
      else btn.removeAttribute('aria-current');
    });
    document.getElementById('loginNote').style.display = 'none';
    if (route === 'orders') renderOrders();
    window.location.hash = route;
    window.scrollTo({ top: 0, behavior: 'instant' });
  }

  window.addEventListener('hashchange', () => {
    const r = window.location.hash.replace('#', '');
    go(r || 'home');
  });

  // ---------- init ----------
  renderMenu();
  updateSessionUI();
  const initial = window.location.hash.replace('#', '') || 'home';
  go(initial);