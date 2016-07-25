'use strict';

const fs = require("fs");
const debug = require('debug')('rnad:routes');

module.exports = function(app, callback) {
  const FS_PATH_SERVICES = './routes/services/';
  const REQUIRE_PATH_SERVICES = './services/';

  fs.readdir(FS_PATH_SERVICES, (err, list) => {
    if(err) throw '没有找到该文件夹，请检查......';
    debug('List: ', list);
    for (let e; list.length && (e = list.shift());){
      const service = require(REQUIRE_PATH_SERVICES + e);
      debug('Service: ', service);
      service.init && service.init(app);
    }
  }, callback);
};
