'use strict';

import React from 'react';
import { PixelRatio } from 'react-native';
import Dimensions from 'Dimensions';

default export class Util {

  //单位像素
  static pixel = 1 / PixelRatio.get();

  //屏幕尺寸
  static size = {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height
  };

  //Key
  static key = 'HSHHSGSGGSTWSYWSYUSUWSHWBS-REACT-NATIVE';

  //post请求
  static get(url, callback) {
    const fetchOptions = {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    };

    fetch(url, fetchOptions)
      .then((response) => response.text())
      .then((responseText) => {
        callback(JSON.parse(responseText));
      });
  };

  //post请求
  static post(url, data, callback) {
    const fetchOptions = {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    };

    fetch(url, fetchOptions)
      .then((response) => response.text())
      .then((responseText) => {
        callback(JSON.parse(responseText));
      });
  };

}
