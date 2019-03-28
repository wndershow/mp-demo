'use strict';
import error_messages from '../messages/errors';
import config from '../config/index';
const API_ADDR = config.backendService.baas4tUrl;
let TOKEN = '';
const request = ({ method, url, data = null, header = {}, is3rdPartyRequest = false }) => {
  if (url.indexOf('://') < 0) {
    url = API_ADDR + url;
  }

  // auth token is required for baas4t requests.
  if (!is3rdPartyRequest) {
    let token = getToken();
    header = {
      Authorization: token,
      ...header
    };
  }

  return new Promise((resolve, reject) => {
    wx.showNavigationBarLoading();
    wx.request({
      url,
      header,
      method,
      data,
      success(res) {
        let resp = {
          statusCode: res.statusCode,
          data: res.data,
          errMsg: res.errMsg
        };
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve(resp);
        } else {
          reject(resp);
        }
      },
      fail(err) {
        reject(err);
      },
      complete() {
        wx.hideNavigationBarLoading();
      }
    });
  });
};

const getToken = () => {
  return wx.getStorageSync('authToken');
};

let http = {
  get: (url, header = {}, data = {}) => {
    return request({ method: 'GET', url, data, header });
  },
  post: (url, postBody = {}, header = {}) => {
    return request({ method: 'POST', url, data: postBody, header });
  },
  put: (url, postBody = {}, header = {}, is3rdPartyRequest = false) => {
    return request({ method: 'PUT', url, data: postBody, header, is3rdPartyRequest });
  },
  delete: (url, header = {}) => {
    return request({ method: 'DELETE', url, header });
  },
  head: (url, header = {}, is3rdPartyRequest = false) => {
    return request({ method: 'HEAD', url, header, is3rdPartyRequest });
  }
};

module.exports = http;
