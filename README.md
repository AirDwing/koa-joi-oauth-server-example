# koa-joi-oauth-server-example

An Example of OAuth Provider via Koa Joi Router

## API Doc

文档： <https://oauth2-server.readthedocs.io/>

默认超时时间：

- code 5分钟
- access_token 1小时
- refresh_token 2周

## 鉴权过程

### 1. 发起 authorize 请求

访问应用 `/login` 跳转，参数结构参考：

http://localhost:8080/oauth/authorize?response_type=code&client_id=someClient&redirect_uri=http%3A%2F%2FAPP_DOMAIN%2Foauth2%2Fcallback

http://localhost:8080/oauth/authorize?response_type=code&client_id=someClient&redirect_uri=http%3A%2F%2FAPP_DOMAIN%2Foauth2%2Fcallback&state=11111111111111111111111111111111

#### 2.1 登录

#### 2.2 获得 code 并返回

类似：

```
http://APP_DOMAIN/oauth2/callback?code=9d9c7cbe2a8b2c3b108d68bb078a793c8c2e987d
```

### 2. 发起 token 请求

http://localhost:8080/oauth/token?grant_type=authorization_code&code=93276e3d1aca72ac033c18d05a022349ad612f46&client_id=someClient&redirect_uri=http%3A%2F%2FAPP_DOMAIN%2Foauth2%2Fcallback&client_secret=superSecret
