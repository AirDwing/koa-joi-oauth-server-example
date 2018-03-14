module.exports = {
  clients: [{
    id: 'someClient',
    secret: 'superSecret',
    name: 'Sample client application',
    accessTokenLifetime: 3600, // If omitted, server default will be used
    refreshTokenLifetime: 604800, // ^
    redirectUris: ['http://APP_DOMAIN/oauth2/callback'],
    grants: ['authorization_code', 'refresh_token'],
    validScopes: ['account']
  }],
  users: [{
    id: 1,
    name: 'AzureDiamond',
    username: 'foo@example.com',
    password: 'hunter2'
  }],
  tokens: [],
  authCodes: []
};
