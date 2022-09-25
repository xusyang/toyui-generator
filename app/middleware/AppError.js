'use strict';

module.exports = () => {
  return async function(ctx, next) {
    try {
      await next();
    } catch (err) {
      // 所有的异常都在 app 上触发一个 error 事件，框架会记录一条错误日志
      ctx.app.emit('error', err);
      console.log('err: ', err);

      // const status = err.status || 500;
      // 生产环境时 500 错误的详细错误内容不返回给客户端，因为可能包含敏感信息
      // const error = status === 500 && ctx.app.config.env === 'prod'
      //   ? 'Internal Server Error'
      //   : err.message;

      // 从 error 对象上读出各个属性，设置到响应中
      if (err.err_code === -401) {
        // 授权失败
        ctx.body = {
          err_code: -401,
          err_msg: '请重新授权',
        };
      } else if (/3\d{4}/.test(err.err_code)) {
        // 3XXXX：表示接口参数不合法
        ctx.body = {
          err_code: err.err_code,
          err_msg: err.err_msg,
          data: err.data,
        };
      } else {
        // 参数不合法
        if (err.message === 'Validation Failed') {
          ctx.body = {
            err_code: -20000,
            err_msg: '参数不合法',
            data: err.errors,
          };
        } else {
          // ctx.body = {
          //   err_code: -50000,
          //   err_msg: '系统错误',
          // };
          ctx.body = {
            err_code: -401,
            err_msg: '请重新授权',
          };
        }
      }
      ctx.status = 200;
    }
  };
};
