'use strict';
const Exceptions = require('./../exception');
const jwt = require('jsonwebtoken');
const dayjs = require('dayjs');

module.exports = () => {
  return async function (ctx, next) {
    const headers = ctx.request.headers;
    if (!ctx.request.body.code && !ctx.request.query.code) {
      try {
        const result = jwt.verify(headers.authorization, ctx.app.config.salt);
        ctx.session.openid = result.openid;
        ctx.session.token = headers.authorization;
        ctx.session.today = dayjs().format('YYYY-MM-DD');
      } catch (error) {
        throw Exceptions.AuthException;
      }
    }

    await next();

    if (!ctx.body) {
      ctx.body = {};
    }

    ctx.body.token = ctx.session.token;
  };
};
