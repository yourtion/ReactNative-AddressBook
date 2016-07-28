'use strict';

import React, { Component } from 'react';
import Util from '../util';
var Service = require('../service');

import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
  AsyncStorage,
  } from 'react-native';

var ModifyUser = React.createClass({

  render: function(){
    return (
      <ScrollView>

        <View style={{height:35, marginTop:30,}}>
          <TextInput style={styles.input} password={true} placeholder="原始密码" onChangeText={this._getOldPassword}/>
        </View>

        <View style={{height:35,marginTop:5}}>
          <TextInput style={styles.input} password={true} placeholder="新密码" onChangeText={this._getNewPassword}/>
        </View>

        <View>
          <TouchableOpacity onPress={this._resetPassword}>
            <View style={styles.btn}>
              <Text style={{color:'#FFF'}}>修改密码</Text>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
    );
  },

  _getOldPassword: function(val){
    this.setState({
      oldPassword: val
    });
  },

  _getNewPassword: function(val){
    this.setState({
      password: val
    });
  },

  _resetPassword: function(){
    var path = Service.host + Service.updatePassword;
    console.log(this.state.password);
    //需要服务端确认login token
    AsyncStorage.getItem('token').then((data) => {
      Util.post(path, {
        password: this.state.password,
        oldPassword: this.state.oldPassword,
        token: data,
      }).then((data) => {
        if(data.status){
          Alert.alert('成功', data.data);
        }else{
          Alert.alert('失败', data.data);
        }
      }).catch(alert);
    }).catch(alert);
  }

});

var styles = StyleSheet.create({
  input:{
    flex:1,
    marginLeft:20,
    marginRight:20,
    height:35,
    borderWidth:1,
    borderColor:'#ddd',
    borderRadius:4,
    paddingLeft:5,
    fontSize:13,
  },
  btn:{
    justifyContent:'center',
    alignItems:'center',
    marginTop:20,
    backgroundColor:'#1DB8FF',
    height:38,
    marginLeft:20,
    marginRight:20,
    borderRadius:4,
  }
});

module.exports = ModifyUser;