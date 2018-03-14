const Koa = require('koa');
const debug = require('debug')('example:server');
const { error } = require('./lib');

const app = new Koa();
app.use(error());

['oauth'].forEach((mod) => {
  // eslint-disable-next-line global-require,import/no-dynamic-require
  const routes = require(`./routes/${mod}`);
  app.use(routes.middleware());
});
app.listen(8080);
debug('Server started at http://localhost:8080/');
