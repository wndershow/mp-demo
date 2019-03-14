'use strict';

import http from '../utils/http';
import config from '../config/index';
import regeneratorRuntime, { async } from '../vendor/runtime';

let auth = {
  wxLogin: async () => {
    wx.showNavigationBarLoading();
    let res = await new Promise((resolve, reject) => {
      wx.login({
        success: res => {
          resolve(res);
        },
        fail: err => {
          reject(err);
        },
        complete: () => {
          wx.hideNavigationBarLoading();
        }
      });
    });
    return res;
  },
  login: async code => {
    // 发送 res.code 到后台换取token
    let loginRequest = {
      code: code
    };
    let res = await http.post(
      `${config.backendService.baas4tUrl}/api/v1/login`,
      loginRequest
    );
    return res;
  },
  checkAuthrization: async () => {
    wx.showNavigationBarLoading();
    let res = new Promise(function(resolve, reject) {
      // 获取用户信息
      wx.getSetting({
        success: res => {
          resolve(res);
        },
        fail: err => {
          reject(err);
        },
        complete: () => {
          wx.hideNavigationBarLoading();
        }
      });
    });
    return res;
  },
  getUserInfo: async () => {
    wx.showNavigationBarLoading();
    let res = new Promise(function(resolve, reject) {
      wx.getUserInfo({
        success: res => {
          resolve(res);
        },
        fail: err => {
          reject(err);
        },
        complete: () => {
          wx.hideNavigationBarLoading();
        }
      });
    });
    return res;
  }
};

export default auth;
