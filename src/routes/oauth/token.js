const debug = require('debug')('example:route');
const qs = require('querystring');
const { Joi } = require('koa-joi-router');
const { Request, Response } = require('oauth2-server');
const { oauth } = require('../../lib');

module.exports = [{
  method: ['GET'],
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
    return oauth.token(req, res).then(({ accessToken, accessTokenExpiresAt, refreshToken }) => {
      const { redirect_uri: redirectUri } = ctx.query;
      const params = {
        access_token: accessToken,
        expires_in: accessTokenExpiresAt,
        refresh_token: refreshToken
      };
      ctx.redirect(`${redirectUri}?${qs.encode(params)}`);
    });
  },
  validate: {
    query: {
      grant_type: Joi.string().regex(/^(authorization_code|refresh_token)$/).required().min(4).max(32).description('只允许传入 `code`'),
      client_id: Joi.string().required().min(4).max(40).description('Client ID'),
      client_secret: Joi.string().required().token().description('Client Secret'),
      redirect_uri: Joi.string().required().min(10).max(255).description('Callback URL'),
      code: Joi.string().optional().token().description('Authorization Code (refresh_token时不传)'),
      refresh_token: Joi.string().optional().token().description('Refresh Token (refresh_token时必须)')
    }
  }
},
{
  method: ['POST'],
  path: '/token',
  handler: (ctx) => {
    debug(ctx.body);
    const req = new Request(ctx.request);
    const res = new Response(ctx.response);

    return oauth.token(req, res).then(({ accessToken, accessTokenExpiresAt, refreshToken }) => {
      const { redirect_uri: redirectUri } = ctx.body;
      const params = {
        access_token: accessToken,
        expires_in: accessTokenExpiresAt,
        refresh_token: refreshToken
      };
      ctx.redirect(`${redirectUri}?${qs.encode(params)}`);
    });
  },
  validate: {
    body: {
      grant_type: Joi.string().regex(/^(authorization_code|refresh_token)$/).required().min(4).max(32).description('只允许传入 `code`'),
      client_id: Joi.string().required().min(4).max(40).description('Client ID'),
      client_secret: Joi.string().required().token().description('Client Secret'),
      redirect_uri: Joi.string().required().min(10).max(255).description('Callback URL'),
      code: Joi.string().optional().token().description('Authorization Code (refresh_token时不传)'),
      refresh_token: Joi.string().optional().token().description('Refresh Token (refresh_token时必须)')
    },
    type: 'form'
  }
}];
