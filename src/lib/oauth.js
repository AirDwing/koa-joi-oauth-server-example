const OAuthServer = require('oauth2-server');
const { oauth } = require('../config');
const model = require('../models');

module.exports = new OAuthServer({
  model,
  ...oauth
});
