const axios = require('axios');
const https = require('https');
const ssl = require('../config/ssl');

const port = process.env.PORT || 3000;

const api = axios.create({
  baseURL: `${ssl.useHttps ? 'https' : 'http'}://localhost:${port}/api`,
  httpsAgent: ssl.useHttps ? new https.Agent({ ca: ssl.cert }) : undefined,
  validateStatus: () => true 
});

module.exports = api;