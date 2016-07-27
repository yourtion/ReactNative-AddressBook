'use strict';

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  TabBarIOS,
  NavigatorIOS,
  Image,
  TextInput,
  StatusBar,
  ScrollView,
  TouchableHighlight,
  ActivityIndicatorIOS,
  AlertIOS,
  AsyncStorage,
} from 'react-native';
import Util from './views/util';

var Home = require('./views/home');
var About = require('./views/about');
var Manager = require('./views/manager');
var Message = require('./views/message');
var Service = require('./views/service');

StatusBar.setBarStyle('light-content');

class AddressBook extends Component {
  statics = {
    title: '主页',
    description: '选项卡'
  };

  constructor(props) {
    super(props);
    this.state = {
      selectedTab: 'home',
      showIndex: {
        height:0,
        opacity:0
      },
      showLogin:{
        flex:1,
        opacity:1
      },
      isLoadingShow: false
    };
  }

  componentDidMount() {
    var that = this;
    AsyncStorage.getItem('token', function(err, token){
      if(!err && token){
        var path = Service.host + Service.loginByToken;
        Util.post(path, {
          token: token
        },function(data){
          if(data.status){
            that.setState({
              showLogin: {
                height:0,
                width:0,
                flex:0,
              },
              showIndex:{
                flex:1,
                opacity:1
              },
              isLoadingShow: false
            });
          }
        });
      }else{
        that.setState({
          showIndex: {
            height:0,
            opacity:0
          },
          showLogin:{
            flex:1,
            opacity:1
          },
          isLoadingShow: false
        });
      }
    });

    var path = Service.host + Service.getMessage;
    var that = this;
    Util.post(path, {
      key: Util.key
    }, function(data){
      that.setState({
        data: data
      });
    });
  };

  _selectTab(tabName) {
    this.setState({
      selectedTab: tabName
    });
  };

  _addNavigator(component, title) {
    var data = null;
    if(title === '公告'){
      data = this.state.data;
    }
    return <NavigatorIOS
      style={{flex:1}}
      barTintColor='#007AFF'
      titleTextColor="#fff"
      tintColor="#fff"
      translucent={false}
      initialRoute={{
        component: component,
        title: title,
        passProps:{
          data: data
        }
      }}
    />;
  };

  _getEmail(val){
    var email = val;
    this.setState({
      email: email
    });
  };

  _getPassword(val) {
    var password = val;
    this.setState({
      password: password
    });
  };

  _login() {
    var email = this.state.email;
    var password = this.state.password;
    var path = Service.host + Service.login;
    var that = this;

    //隐藏登录页 & 加载loading
    that.setState({
      showLogin: {
        height:0,
        width:0,
        flex:0,
      },
      isLoadingShow: true
    });
    AdSupportIOS.getAdvertisingTrackingEnabled(function(){
      AdSupportIOS.getAdvertisingId(function(deviceId){
        Util.post(path, {
          email: email,
          password: password,
          deviceId: deviceId,
        }, function(data){
          if(data.status){
            var user = data.data;
            //加入数据到本地
            AsyncStorage.multiSet([
              ['username', user.username],
              ['token', user.token],
              ['userid', user.userid],
              ['email', user.email],
              ['tel', user.tel],
              ['partment', user.partment],
              ['tag', user.tag],
            ], function(err){
              if(!err){
                that.setState({
                  showLogin: {
                    height:0,
                    width:0,
                    flex:0,
                  },
                  showIndex:{
                    flex:1,
                    opacity:1
                  },
                  isLoadingShow: false
                });
              }
            });

          }else{
            AlertIOS.alert('登录', '用户名或者密码错误');
            that.setState({
              showLogin: {
                flex:1,
                opacity:1
              },
              showIndex:{
                height:0,
                width:0,
                flex:0,
              },
              isLoadingShow: false
            });
          }
        });
      }, function(){
        AlertIOS.alert('设置','无法获取设备唯一标识');
      });
    }, function(){
      AlertIOS.alert('设置','无法获取设备唯一标识，请关闭设置->隐私->广告->限制广告跟踪');
    });
  };

  render() {
    return(
      <View style={{flex:1}}>
        {this.state.isLoadingShow ?
          <View style={{flex:1, justifyContent:'center', alignItems:'center'}}>
            <ActivityIndicatorIOS size="small" color="#268DFF"></ActivityIndicatorIOS>
          </View>:null
        }
        {!this.state.isLoadingShow ?
          <View style={this.state.showIndex}>
            <TabBarIOS barTintColor="#FFF">
              <TabBarIOS.Item
                icon={require('./images/phone_s.png')}
                title="首页"
                selected={this.state.selectedTab === 'home'}
                onPress={this._selectTab.bind(this, 'home')}
              >
                {this._addNavigator(Home, '主页')}
              </TabBarIOS.Item>

              <TabBarIOS.Item
                title="公告"
                icon={require('./images/gonggao.png')}
                selected={this.state.selectedTab === 'message'}
                onPress={this._selectTab.bind(this, 'message')}
              >
                {this._addNavigator(Message, '公告')}
              </TabBarIOS.Item>

              <TabBarIOS.Item
                title="管理"
                icon={require('./images/manager.png')}
                selected={this.state.selectedTab === 'manager'}
                onPress={this._selectTab.bind(this, 'manager')}
              >
                {this._addNavigator(Manager, '管理')}
              </TabBarIOS.Item>

              <TabBarIOS.Item
                title="关于"
                icon={require('./images/about.png')}
                selected={this.state.selectedTab === 'about'}
                onPress={this._selectTab.bind(this, 'about')}
              >
                {this._addNavigator(About, '关于')}
              </TabBarIOS.Item>
            </TabBarIOS>
          </View> : null
        }
        <ScrollView style={[this.state.showLogin]}>
          <View style={styles.container}>
            <View>
              <Image style={styles.logo} source={require('./images/logo.png')}></Image>
            </View>

            <View style={styles.inputRow}>
              <Text>邮箱</Text><TextInput style={styles.input} placeholder="请输入邮箱" onChangeText={this._getEmail}/>
            </View>
            <View style={styles.inputRow}>
              <Text>密码</Text><TextInput style={styles.input} placeholder="请输入密码" password={true} onChangeText={this._getPassword}/>
            </View>

            <View>
              <TouchableHighlight underlayColor="#fff" style={styles.btn} onPress={this._login}>
                <Text style={{color:'#fff'}}>登录</Text>
              </TouchableHighlight>
            </View>
          </View>
        </ScrollView>

      </View>
    );
  };
}

const styles = StyleSheet.create({
  container:{
    marginTop: 50,
    alignItems: 'center',
  },
  logo:{
    width: 100,
    height: 100,
    resizeMode: Image.resizeMode.contain,
  },
  inputRow:{
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  input:{
    marginLeft: 10,
    width: 220,
    borderWidth: Util.pixel,
    height: 35,
    paddingLeft: 8,
    borderRadius: 5,
    borderColor: '#CCC',
  },
  btn:{
    marginTop: 10,
    width: 80,
    height: 35,
    backgroundColor: '#3BC1FF',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
  }
});

AppRegistry.registerComponent('AddressBook', () => AddressBook);
