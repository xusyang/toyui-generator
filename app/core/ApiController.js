'use strict';

const Controller = require('egg').Controller;

class ApiControllerController extends Controller {
  constructor(options) {
    super(options);
    this.openid = this.ctx.session.openid;
  }

  success({ data = null, err_code = 0, err_msg = 'success' } = {}) {
    this.ctx.body = {
      err_code,
      err_msg,
      data,
    };

    if (!this.ctx.body.data) {
      delete this.ctx.body.data;
    }
  }

  failed({ data = null, err_code = -1, err_msg = 'failed' } = {}) {
    this.ctx.body = {
      err_code,
      err_msg,
      data,
    };

    if (!this.ctx.body.data) {
      delete this.ctx.body.data;
    }
  }


  rawBody(body) {
    this.ctx.body = body;
  }

}

module.exports = ApiControllerController;
