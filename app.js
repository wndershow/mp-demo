'use strict';

import regeneratorRuntime from './vendor/runtime';
import config from './config/index';

App({
  onLaunch: async function(options) {
    console.info('App onLaunch');
  },
  onShow: async function(options) {
    console.info('App onShow');
  },
  onHide: function() {
    console.info('App onHide');
  },
  onError: function(msg) {},
  globalData: {},
  onPageNotFound() {
    wx.redirectTo({
      url: '/pages/404/index'
    });
  }
});
