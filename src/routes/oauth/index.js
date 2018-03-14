const router = require('koa-joi-router');

const arr = [].concat(
  require('./authorize'),
  require('./token')
);

const routes = router();
routes.prefix('/oauth');
routes.route(arr);

module.exports = routes;
