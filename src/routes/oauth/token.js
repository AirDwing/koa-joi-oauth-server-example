const debug = require('debug')('example:route');
const { Joi } = require('koa-joi-router');

module.exports = [{
  method: 'GET',
  path: '/token',
  handler: (ctx) => {
    debug(ctx.query);
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
