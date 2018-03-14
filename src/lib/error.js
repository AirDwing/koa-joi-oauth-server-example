const debug = require('debug')('example:error');
const { UnauthorizedRequestError } = require('oauth2-server');

const errorHandler = (ctx, err) => {
  debug(err.message);
  let name;
  if (err.isJoi) {
    const { path } = Array.isArray(err.details) ? err.details[0] : err.details;
    ctx.status = 400;
    switch (path) {
      case 'response_type': {
        name = 'unsupported_response_type';
        break;
      }
      default: {
        name = 'invalid_argument';
      }
    }
  } else if (err instanceof UnauthorizedRequestError) {
    ctx.status = 401;
    name = 'unauthorized_request';
  } else {
    ctx.status = 500;
    name = 'unkown_error';
  }

  ctx.body = {
    code: ctx.status,
    name
  };
};

module.exports = () => async (ctx, next) => {
  try {
    // ignore favicon.ico
    if (ctx.request.url === '/favicon.ico') {
      return await next();
    }
    await next();
  } catch (e) {
    errorHandler(ctx, e);
  }
  return undefined;
};
