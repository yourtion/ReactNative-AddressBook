'use strict';

const crypto = require('crypto');
const path = require('path');

module.exports = {

  guid: () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0,
        v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    }).toUpperCase();
  },

  md5: (password) => {
    const md5 = crypto.createHash('md5');
    const salt = '(!%$88hs@gophs*)#sassb9';
    return md5.update(password + salt).digest('hex');
  },

  getKey: () => {
    return 'HSHHSGSGGSTWSYWSYUSUWSHWBS-REACT-NATIVE';
  },

  getDatabaseFilePath: (name) =>{
    return path.resolve(__dirname, '../database/'+ name +'.json');
  }

};
