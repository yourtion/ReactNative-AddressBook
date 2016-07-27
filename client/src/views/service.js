'use strict';

const Service = {
  host:'http://192.168.31.186:3000',
  login: '/user/login',
  loginByToken: '/user/login/token',
  getUser: '/user/get',
  createUser: '/user/create',
  getMessage: '/message/get',
  addMessage: '/message/add',
  updatePassword: '/user/password/update',
  deleteUser: '/user/delete'
};

module.exports = Service;
