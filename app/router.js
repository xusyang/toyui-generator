'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;
  router.all('/genHaibao', controller.home.genHaibao);
  router.all('/getHaibao', controller.home.getHaibao);
};
