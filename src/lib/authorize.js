const debug = require('debug')('example:authorize');
const { UnauthorizedRequestError } = require('oauth2-server');
const redis = require('./redis');

module.exports = {
  authenticateHandler: {
    handle: (ctx) => {
      const { token = '' } = ctx.query;
      return redis.get(`auth:${token}`).then((user) => {
        if (user === null) {
          throw new UnauthorizedRequestError();
        }
        debug(user);
        return JSON.parse(user);
      });
    }
  }
};
