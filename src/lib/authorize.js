const debug = require('debug')('example:authorize');
const { UnauthorizedRequestError } = require('oauth2-server');
const redis = require('./redis');

module.exports = {
  authenticateHandler: {
    handle: (ctx) => {
      const { state = '' } = ctx.query;
      return redis.get(`auth:${state}`).then((user) => {
        if (user === null) {
          throw new UnauthorizedRequestError();
        }
        debug(user);
        return JSON.parse(user);
      });
    }
  }
};
