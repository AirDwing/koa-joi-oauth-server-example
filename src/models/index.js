const debug = require('debug')('example:model');
const { JSONparse } = require('@dwing/common');
const redis = require('../lib/redis');
const { format, query } = require('../lib/mysql');
// const { redis } = require('../lib');

exports.getClient = (id, secret) => {
  debug(`Looking up client ${id}:${secret}`);
  let sql = format('SELECT * FROM #APP_TABLE# WHERE `key` = ?', [id]);
  if (secret !== null) {
    sql += format(' AND `secret` = ?', [secret]);
  }
  sql += ' LIMIT 1';
  return query(sql).then(([client = false]) => {
    if (client === false) {
      return false;
    }
    return {
      id: client.key,
      secret: client.secret,
      name: client.name,
      accessTokenLifetime: 3600, // If omitted, server default will be used
      refreshTokenLifetime: 604800, // ^
      redirectUris: [client.callback_url],
      grants: ['authorization_code', 'refresh_token'],
      validScopes: ['account']
    };
  });
};


exports.getAuthorizationCode = (code) => {
  debug('getAuthorizationCode', code);
  return redis.get(`oauth:code:${code}`).then((result) => {
    debug('getAuthorizationCode', result);
    if (result === null) {
      return false;
    }
    const data = JSONparse(result);
    if (data.expiresAt) {
      Object.assign(data, {
        expiresAt: new Date(data.expiresAt)
      });
    }
    return data;
  });
};

exports.getRefreshToken = (refreshToken) => {
  debug('getRefreshToken', refreshToken);
  return redis.get(`oauth:refresh_token:${refreshToken}`).then((result) => {
    debug('getRefreshToken', result);
    if (result === null) {
      return false;
    }
    const data = JSONparse(result);
    if (data.accessTokenExpiresAt) {
      Object.assign(data, {
        accessTokenExpiresAt: new Date(data.accessTokenExpiresAt)
      });
    }
    if (data.refreshTokenExpiresAt) {
      Object.assign(data, {
        refreshTokenExpiresAt: new Date(data.refreshTokenExpiresAt)
      });
    }
    return data;
  });
};


exports.revokeAuthorizationCode = (code) => {
  debug('revokeAuthorizationCode', code);
  // 使用后删除
  // return redis.del(`oauth:code:${code.authorizationCode}`).then(() => true);
  return true;
};

exports.revokeToken = (token) => {
  debug('revokeToken', token);
  // 使用后删除
  // return Promise.all([
  //   redis.del(`oauth:token:${token.accessToken}`),
  //   redis.del(`oauth:refresh_token:${token.refreshToken}`)
  // ]).then(() => true);
  return true;
};

exports.saveAuthorizationCode = (code, client, user) => {
  debug('saveAuthorizationCode', code);
  Object.assign(code, {
    user,
    client: {
      id: client.id
    }
  });
  // 添加到配置 authorizationCode 有效期
  return redis.setex(`oauth:code:${code.authorizationCode}`, 600, JSON.stringify(code)).then(() => code);
};

exports.saveToken = (token, client, user) => {
  debug('saveToken', token);
  Object.assign(token, {
    user,
    client: {
      id: client.id
    }
  });
  // 添加到配置 authorizationCode 有效期
  return Promise.all([
    redis.setex(`oauth:token:${token.accessToken}`, 86400, JSON.stringify(token)),
    redis.setex(`oauth:refresh_token:${token.refreshToken}`, 86400 * 14, JSON.stringify(token))
  ]).then(() => token);
};
