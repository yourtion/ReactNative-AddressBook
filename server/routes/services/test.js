'use strict';

const debug = require('debug')('rnad:routes:Test');

const Test = {
  init: function(app){
    debug('Init');
    app.get('/test/test', this.doTest);
    app.get('/test/show', this.doShow);
  },

  doTest: (req, res) => {
    debug('doTest');
    res.send({
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
