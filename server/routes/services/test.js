'use strict';

const debug = require('debug')('rnad:routes:Test');


const Test = {
  init: (router) => {
    debug('Init');
    router.get('/test/test', Test.doTest);
    router.get('/test/show', Test.doShow);
  },

  doTest: (req, res) => {
    debug('doTest');
    res.json({
      status: 1,
      info: '测试服务doTest'
    });
  },

  doShow: (req, res) => {
    debug('doShow');
    res.json({
      status: 1,
      info: '测试服务doShow'
    });
  }
};

module.exports = Test;
