'use strict';

const Service = require('egg').Service;
const Exceptions = require('./../exception');

class UserService extends Service {
  async getUserStatus(openid) {
    throw new Exceptions.AuthException();
  }
}

module.exports = UserService;
