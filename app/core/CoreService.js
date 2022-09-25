'use strict';

const Service = require('egg').Service;
class CoreService extends Service {
  /**
   * 服务调用成功
   * @param {*} param0
   */
  success({ data = null, err_code = 0, err_msg = 'success' } = {}) {
    const result = {
      err_code,
      err_msg,
      data,
    };

    if (!result.data) {
      delete result.data;
    }

    return result;
  }

  /**
   * 服务调用失败
   * @param {*} param0
   */
  failed({ data = null, err_code = -1, err_msg = 'failed' } = {}) {
    const result = {
      err_code,
      err_msg,
      data,
    };

    if (!result.data) {
      delete result.data;
    }
    return result;
  }
}

module.exports = CoreService;
