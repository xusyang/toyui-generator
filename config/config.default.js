/* eslint valid-jsdoc: "off" */

'use strict';

/**
 * @param {Egg.EggAppInfo} appInfo app info
 */
module.exports = appInfo => {
  /**
   * built-in config
   * @type {Egg.EggAppConfig}
   **/
  const config = (exports = {});

  config.proxy = true;

  // 加盐
  config.salt = 'DELOITTE_XUSYANG';

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_15628131228929_2313';

  // add your middleware config here
  config.middleware = ['appError'];

  // add your user config here
  const userConfig = {
    // myAppName: 'egg',
  };

  config.h5 = {};

  // 安全组
  config.security = {
    csrf: false,
    // eslint-disable-next-line array-bracket-spacing
    domainWhiteList: ['*'],
  };

  config.cors = {
    origin: '*',
    allowMethods: 'GET,HEAD,PUT,POST,DELETE,PATCH,OPTIONS',
  };

  // 微信相关的配置
  config.wx = {
    app_name: '',
    app_id: 'wxefeb138c98e4c65a',
  };

  /* 文件上传的解析 */
  exports.multipart = {
    mode: 'file',
  };

  config.bodyParser = {
    enable: true,
    encoding: 'utf8',
    formLimit: '10000kb',
    jsonLimit: '10000kb',
    strict: true,
    queryString: {
      depth: 5,
      arrayLimit: 100,
      parameterLimit: 1000,
    },
    enableTypes: ['json', 'form', 'text'],
    extendTypes: {
      text: ['text/xml', 'application/xml'],
    },
  };

  config.sequelize = {
    dialect: 'mysql',
    database: '',
    host: '',
    username: '',
    password: '',
    port: 3306,
    timezone: '+08:00',
    define: {
      freezeTableName: true,
      timestamps: true,
      paranoid: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
      deletedAt: 'deleted_at',
    },
  };

  return {
    ...config,
    ...userConfig,
  };
};
