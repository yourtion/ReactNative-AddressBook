'use strict';

import React, { Component } from 'react';
var Service = require('./../service');
import Util from '../util';

import {
  View,
  TextInput,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Image,
  Text,
  AsyncStorage
  } from 'react-native';

var PostMessage = React.createClass({

  render: function(){
    return (
      <ScrollView >
        <View>
          <TextInput multiline={true}
                     onChangeText={this._onChange}
                     style={styles.textinput}
                     placeholder="请输入公告内容"/>
        </View>
        <View style={{marginTop:20}}>
          <TouchableOpacity onPress={this._postMessage}>
            <View style={styles.btn}>
              <Text style={{color:'#fff'}}>发布公告</Text>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
    );
  },

  _onChange: function(val){
    if(val){
      this.setState({
        message: val
      });
    }
  },

  _postMessage: function(){
    AsyncStorage.getItem('token').then((token) => {
      Util.post(Service.host + Service.addMessage, {
        token: token,
        message: that.state.message
      }).then((data) => {
        if(data.status){
          alert('添加成功！');
        }else{
          alert('添加失败！');
        }
      }).catch(alert);
    }).catch((err) => {
      alert('权限失效，请退出APP，重新登录');
    });
  }

});

var styles = StyleSheet.create({
  textinput:{
    flex:1,
    height:100,
    borderWidth:1,
    borderColor:'#ddd',
    marginTop:30,
    marginLeft:20,
    marginRight:20,
    paddingLeft:8,
    fontSize:13,
    borderRadius:4
  },
  btn:{
    flex:1,
    justifyContent:'center',
    alignItems:'center',
    backgroundColor:'#1DB8FF',
    height:38,
    marginLeft:20,
    marginRight:20,
    borderRadius:4,
  }
});

module.exports = PostMessage;