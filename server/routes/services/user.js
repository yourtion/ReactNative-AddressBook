'use strict';

const fs = require('fs');
const util = require('../util');
const debug = require('debug')('rnad:routes:User');

const USER_PATH = util.getDatabaseFilePath('user');

const User = {
  init: (router) => {
    router.get('/user', User.getUser);
    router.post('/user/create', User.addUser);
    router.post('/user/login', User.login);
    router.post('/user/login/token', User.loginByToken);
    router.post('/user/password/update', User.updatePassword);
    router.post('/user/delete', User.deleteUser);
  },

  getUser: (req, res, next) => {
    debug('getUser');
    const key = req.query['key'];
    const partment = req.param('partment');
    if (key !== util.getKey()) return next(new Error('使用了没有鉴权的key'));

    fs.readFile(USER_PATH ,(err, data) => {
      if (err) return next(err);
      try {
        const obj = JSON.parse(data);
        let newObj = [];
        for (const i in obj) {
          if (obj.hasOwnProperty(i) && obj[i].partment === partment) {
            delete obj[i]['password'];
            newObj.push(obj[i]);
          }
        }
        return res.json({
          status: 1,
          data: newObj
        });
      } catch (e) {
        return next(e);
      }
    });
  },

  addUser: (req, res, next) => {
    debug('addUser');
    const username = req.body['username'];
    const password = util.md5(req.body['password']);
    const tel = req.body['tel'];
    const email = req.body['email'];
    const partment =  req.body['partment'];
    const tag = req.body['tag'];
    const creater = req.body['creater'] || '';

    if(!username || !password || !tel || !email || !partment || !tag){
      return next(new Error('缺少必要参数'));
    }

    fs.readFile(USER_PATH, (err, data) => {
      if(err) return next(err);
      try{
        const content = JSON.parse(data);
        const obj = {
          "userid": util.guid(),
          "username": username,
          "password": password,
          "partment": partment,
          "tel": tel,
          "email": email,
          "tag": tag,
          "creater": creater,
          "time": new Date(),
          "token": ''
        };
        content.push(obj);
        fs.writeFileSync(USER_PATH, JSON.stringify(content));
        delete obj.password;
        return res.json({
          status: 1,
          data: obj
        });
      }catch(e){
        return next(e);
      }
    });
  },

  login: (req, res, next) => {
    debug('login');
    const email = req.body['email'];
    const password = util.md5(req.body['password']);
    const deviceId = req.body['deviceId'];
    const token = util.guid() + deviceId;

    fs.readFile(USER_PATH, (err, data) => {
      if(err) return next(err);
      try{
        const content = JSON.parse(data);
        for(const i in content) {
          //验证通过
          if(content.hasOwnProperty(i) && email === content[i].email && password === content[i].password){
            content[i]['token'] = token;
            //写入到文件中
            debug(content[i]);
            fs.writeFile(USER_PATH, JSON.stringify(content));
            //删除密码
            delete content[i].password;
            return res.json({
              status: 1,
              data: content[i]
            });
          }
        }
        return next('用户名或者密码错误');
      }catch(e){
        return next(e);
      }
    });
  },

  loginByToken: (req, res, next) => {
    debug('loginByToken');
    const token = req.body['token'];

    fs.readFile(USER_PATH, (err, data) => {
      if (err) return next(err);
      try{
        const content = JSON.parse(data);
        for(const i in content){
          if(content.hasOwnProperty(i) && token === content[i].token){
            delete content[i].password;
            return res.json({
              status:1,
              data: content[i]
            });
          }
        }
        return next(new Error('token失效'));
      }catch(e){
        return next(e);
      }
    });
  },

  updatePassword: (req, res, next) => {
    debug('updatePassword');

    const token = req.body['token'];
    const oldPassword = util.md5(req.body['oldPassword']);
    const password = util.md5(req.body['password']);

    fs.readFile(USER_PATH, (err, data) => {
      if (err) return next(err);
      try{
        const content = JSON.parse(data);
        for(const i in content){
          if(content.hasOwnProperty(i) &&  token === content[i].token && oldPassword === content[i].password){
            content[i].password = password;
            //写入到文件中
            fs.writeFileSync(USER_PATH, JSON.stringify(content));
            return res.json({
              status: 1,
              data: '更新成功'
            });
          }
        }
        return next(new Error('更新失败，没有找到该用户或者初始密码错误'));
      }catch(e){
        return next(e);
      }
    });

  },

  deleteUser: (req, res, next) => {
    debug('deleteUser');

    const token = req.body['token'];
    const email = req.body['email'];

    fs.readFile(USER_PATH, (err, data) => {
      if (err) return next(err);
      try{
        const content = JSON.parse(data);
        for (const i in content) {
          if (content.hasOwnProperty(i) && token === content[i].token) {
            //遍历查找需要删除的用户
            for (const j in content) {
              if (content.hasOwnProperty(j) && content[j].email === email) {
                content.splice(j, 1);
                //写入到文件中
                fs.writeFileSync(USER_PATH, JSON.stringify(content));
                return res.json({
                  status: 1,
                  info: content,
                  data: '删除成功'
                });
              }
            }
          }
        }
        return next(new Error('删除失败，没有找到该用户或者用户鉴权错误'));
      }catch(e){
        return next(e);
      }
    });
  }

};

module.exports = User;
