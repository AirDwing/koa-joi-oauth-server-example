const debug = require('debug')('example:route');
const qs = require('querystring');
const { Joi } = require('koa-joi-router');
const { Request, Response } = require('oauth2-server');
const { oauth, authorize: authorizeOptions } = require('../../lib');
const { sso: { url: SSO_URL } } = require('../../config');

module.exports = [{
  method: 'GET',
  path: '/authorize',
  handler: (ctx) => {
    // 无 Session， 通过 State 字段传递用户信息
    // const { state = '' } = ctx.query;
    // if (state === '') {
    //   ctx.redirect(`${SSO_URL}?${qs.encode(ctx.query)}`);
    //   return undefined;
    // }
    // Temp
    debug(ctx.query);
    const req = new Request(ctx.request);
    const res = new Response(ctx.response);
    return oauth.authorize(req, res, authorizeOptions).then(({ authorizationCode, redirectUri }) => {
      ctx.redirect(`${redirectUri}?code=${authorizationCode}`);
    });
  },
  validate: {
    query: {
      response_type: Joi.string().regex(/^code$/).required().min(4).max(32).description('只允许传入 `code`'),
      client_id: Joi.string().required().min(4).max(40).description('Client ID'),
      redirect_uri: Joi.string().required().min(10).max(255).description('Callback URL'),
      scope: Joi.string().optional().description('scope 可选，用英文小写逗号分隔'),
      state: Joi.string().optional().description('state 将原封不动传出')
    }
  }
}];
// }, {
//   method: 'POST',
//   path: '/authorize'
// }];

