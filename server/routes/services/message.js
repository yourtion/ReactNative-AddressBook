'use strict';

const fs = require('fs');
const util = require('../util');
const debug = require('debug')('rnad:routes:Message');

const USER_PATH = util.getDatabaseFilePath('user');
const MESSAGE_PATH = util.getDatabaseFilePath('message');

const Message = {
  init: (route) => {
    route.get('/message', Message.getMessage);
    route.post('/message', Message.addMessage);
  },

  //获取公告消息
  getMessage: (req, res, next) => {
    const key = req.query['key'];
    debug('getMessage -  key:%s', key);

    if(key !== util.getKey()) return next(new Error('使用了没有鉴权的key'));

    fs.readFile(MESSAGE_PATH, (err, data) =>{
      if(err) return next(err);
      try{
        const obj = JSON.parse(data);
        return res.json({
          status: 1,
          data: obj
        });
      }catch(e){
        return next(e);
      }
    });
  },

  //增加公告消息
  addMessage: (req, res, next) => {

    const token =  req.query['token'];
    const message = req.body['message'];

    if(!token || !message) return next(new Error('token或者message不能为空'));

    //根据token查询
    fs.readFile(USER_PATH, function(err, data){
      if(err) return next(err);

      try{
        const obj = JSON.parse(data);
        for(const i in obj){
          if(obj.hasOwnProperty(i) && token === obj[i].token){
            //增加信息
            fs.readFile(MESSAGE_PATH, (err, data) =>{
              if(err) return next(err);
              const msgObj = JSON.parse(data);

              msgObj.push({
                messageid: util.guid(),
                userid: obj[i].userid,
                username: obj[i].username,
                time: new Date().getFullYear() + '-'
                +  (parseInt(new Date().getMonth()) + 1) + '-' +  new Date().getDate(),
                message: message
              });

              fs.writeFileSync(MESSAGE_PATH, JSON.stringify(msgObj));
              return res.send({
                status: 1
              });
            });
          }
        }

        return next(new Error('token认证失败'));
      }catch(e) {
        return next(e);
      }
    });
  }

};

module.exports = Message;
