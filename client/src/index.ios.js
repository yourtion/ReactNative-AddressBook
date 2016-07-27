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
  ActivityIndicator,
  Alert,
  AsyncStorage,
} from 'react-native';
import Util from './views/util';

const Home = require('./views/home');
const About = require('./views/about');
const Manager = require('./views/manager');
const Message = require('./views/message');
const Service = require('./views/service');

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
    AsyncStorage.getItem('token')
      .then((token) => {
        if(token){
          const path = Service.host + Service.loginByToken;
          Util.post(path, {
            token: token
          }).then((data) => {
            if(data.status){
              this.setState({
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
          }).catch(alert);
        }
      }).catch((err) => {
        this.setState({
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
    });

    const path = Service.host + Service.getMessage;
    Util.post(path, {
      key: Util.key
    }).then((data) => {
      this.setState({
        data: data
      });
    }).catch(alert);
  };

  _selectTab(tabName) {
    this.setState({
      selectedTab: tabName
    });
  };

  _addNavigator(component, title) {
    let data = null;
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
    this.setState({
      email: val
    });
  };

  _getPassword(val) {
    this.setState({
      password: val
    });
  };

  _login() {
    const email = this.state.email;
    const password = this.state.password;
    const path = Service.host + Service.login;

    //隐藏登录页 & 加载loading
    this.setState({
      showLogin: {
        height:0,
        width:0,
        flex:0,
      },
      isLoadingShow: true
    });
    Util.post(path, {
      email: email,
      password: password,
      deviceId: 'xxxx-1',
    }).then((data) => {
      if(data.status){
        const user = data.data;
        //加入数据到本地
        AsyncStorage.multiSet([
          ['username', user.username],
          ['token', user.token],
          ['userid', user.userid],
          ['email', user.email],
          ['tel', user.tel],
          ['partment', user.partment],
          ['tag', user.tag],
        ]).catch((err) => {
          this.setState({
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
        });
      }
    }).catch((err) => {
      Alert.alert('登录', '用户名或者密码错误');
      this.setState({
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
    });
  };

  render() {
    return(
      <View style={{flex:1}}>
        {this.state.isLoadingShow ?
          <View style={{flex:1, justifyContent:'center', alignItems:'center'}}>
            <ActivityIndicator size="small" color="#268DFF" />
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
              <Image style={styles.logo} source={require('./images/logo.png')} />
            </View>

            <View style={styles.inputRow}>
              <Text>邮箱</Text><TextInput style={styles.input} placeholder="请输入邮箱" onChangeText={this._getEmail.bind(this)} />
            </View>
            <View style={styles.inputRow}>
              <Text>密码</Text><TextInput style={styles.input} placeholder="请输入密码" password={true} onChangeText={this._getPassword.bind(this)} />
            </View>

            <View>
              <TouchableHighlight underlayColor="#fff" style={styles.btn} onPress={this._login.bind(this)}>
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
