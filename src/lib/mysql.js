const debug = require('debug')('example:mysql');
const { pool, format } = require('@dwing/mysql');
const { mysql: mysqlOptions } = require('../config');

exports.query = async (sql) => { // , times = 0
  const client = await pool(mysqlOptions);
  debug(sql);
  const result = await client.query(sql);
  return result;
};

exports.format = format;
