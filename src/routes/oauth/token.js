const debug = require('debug')('example:route');
const { Joi } = require('koa-joi-router');
const { Request, Response } = require('oauth2-server');
const { oauth } = require('../../lib');

module.exports = [{
  method: ['GET', 'POST'],
  path: '/token',
  handler: (ctx) => {
    debug(ctx.query);
    const req = new Request(ctx.request);
    const res = new Response(ctx.response);
    if (ctx.request.method === 'GET') {
      req.method = 'POST';
      req.headers['content-type'] = 'application/x-www-form-urlencoded';
      req.headers['transfer-encoding'] = 'gzip, chunked';
      req.headers['content-length'] = '1024';
      req.body = ctx.query;
    }
    return oauth.token(req, res).then((data) => {
      debug(data);
    });
    // const { grant_type: grantType } = ctx.query;
    // if (grantType === 'authorization_code') {
    //   // Authorization Code
    // } else {
    //   // Refresh Token
    // }
  },
  validate: {
    query: {
      grant_type: Joi.string().regex(/^(authorization_code|refresh_token)$/).required().min(4).max(32).description('只允许传入 `code`'),
      client_id: Joi.string().required().min(4).max(40).description('Client ID'),
      redirect_uri: Joi.string().required().min(10).max(255).description('Callback URL'),
      code: Joi.string().optional().token().description('Authorization Code (refresh_token时不传)'),
      refresh_token: Joi.string().optional().token().description('Refresh Token (refresh_token时必须)'),
      client_secret: Joi.string().optional().token().description('Client Secret')
    },
    output: {
      200: {
        body: {
          access_token: Joi.string().token().description('Access Token'),
          expires_in: Joi.number().integer().default(3600).description('超时时间'),
          refresh_token: Joi.string().token().description('Refresh Token')
        }
      }
    }
  }
}];
