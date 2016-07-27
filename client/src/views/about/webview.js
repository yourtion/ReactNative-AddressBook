'use strict';

import React, { Component } from 'react';
import {
  WebView,
  ScrollView,
  Text,
  View,
} from 'react-native';

var webview = React.createClass({

  render: function(){
    return(
      <View style={{flex:1, marginBottom: 64}}>
        <WebView url={this.props.url}/>
      </View>
    );
  }

});

module.exports = webview;
