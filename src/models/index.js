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
  Object.assign(code, {
    user,
    client: {
      id: client.id
    }
  });
  db.authCodes.push(code);
  return code;
};

exports.getAccessToken = () => { };
