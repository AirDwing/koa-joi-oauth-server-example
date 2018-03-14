const debug = require('debug')('example:model');
const db = require('./mock');

exports.getClient = (id, secret) => {
  debug(`Looking up client ${id}:${secret}`);
  const lookupMethod = secret === null
    ? client => client.id === id
    : client => client.id === id && client.secret === secret;

  return db.clients.find(lookupMethod);
};

exports.saveAuthorizationCode = (code, client, user) => {
  debug(code);
  Object.assign(code, {
    user,
    client: {
      id: client.id
    }
  });
  db.authCodes.push(code);
  return code;
};

exports.getAccessToken = (bearerToken) => {
  const tokens = db.tokens.filter(token => token.accessToken === bearerToken);

  return tokens.length ? tokens[0] : false;
};

exports.saveToken = (token, client, user) => {
  debug(token);
  Object.assign(token, {
    user,
    client: {
      id: client.id
    }
  });
  db.tokens.push(token);
  return token;
};
