const fs = require('fs');
const path = require('path');

const keyPath  = path.join(__dirname, '..', 'sslcert', 'key.pem');
const certPath = path.join(__dirname, '..', 'sslcert', 'cert.pem');

const useHttps = process.env.NODE_ENV !== 'production' && fs.existsSync(keyPath) && fs.existsSync(certPath);

module.exports = {
  useHttps,
  key:  useHttps ? fs.readFileSync(keyPath)  : null,
  cert: useHttps ? fs.readFileSync(certPath) : null
};
