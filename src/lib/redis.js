const redis = require('@dwing/redis');

const { redis: redisOptions } = require('../config');

const client = redis(redisOptions);

module.exports = client;
