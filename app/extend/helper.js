'use strict';

module.exports = {
  async sendHttp({ url, method = 'POST', headers = null, data = null, contentType = 'application/x-www-form-urlencoded' }) {
    const res = await this.ctx.curl(url, {
      method,
      contentType,
      data,
      headers,
      dataType: 'json',
    });

    return res;
  },
};
