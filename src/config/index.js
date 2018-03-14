module.exports = {
  sso: {
    url: 'http://localhost:1234/login'
  },
  redis: {
    host: '127.0.0.1',
    port: 6379,
    db: 1,
    ttl: 3600
  },
  mysql: {
    connectionLimit: 10,
    host: '127.0.0.1',
    user: 'root',
    password: 'root'
  },
  oauth: {
    allowEmptyState: true,
    allowBearerTokensInQueryString: true,
    // 将超时时间由1小时改为1天
    accessTokenLifetime: 86400
  }
};
