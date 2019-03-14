export const checkRecordSettingStatus = () => {
  return new Promise((resovle, reject) => {
    wx.getSetting({
      success(res) {
        if (res.errMsg !== 'getSetting:ok') {
          reject(new Error('check record setting error!'));
        }
        if (res.authSetting['scope.record'] === false) {
          resovle(-1);
        }
        if (res.authSetting['scope.record'] === true) {
          resovle(1);
        }
        resovle(0);
      },
      fail() {
        reject(new Error('check record setting error!'));
      }
    });
  });
};

export const authorizeRecord = () => {
  return new Promise((resovle, reject) => {
    wx.authorize({
      scope: 'scope.record',
      success(rs) {
        resovle(1);
      },
      fail(rs) {
        resovle(-1);
      }
    });
  });
};

export const openSetting = () => {
  return new Promise((resovle, reject) => {
    wx.openSetting({
      success(res) {
        resovle(res);
      },
      fail(res) {
        reject(new Error('open setting fail!'));
      }
    });
  });
};

export const chooseImage = () => {
  return new Promise((resovle, reject) => {
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      success(res, tempFiles) {
        resovle(res.tempFiles);
      },
      fail() {}
    });
  });
};

export const chooseVideo = () => {
  return new Promise((resovle, reject) => {
    wx.chooseVideo({
      sourceType: ['album', 'camera'],
      compressed: true,
      maxDuration: 60,
      camera: 'back',
      success(res) {
        resovle(res);
      },
      fail(error) {
        reject(error);
      }
    });
  });
};

export const downloadFile = url => {
  return new Promise((resovle, reject) => {
    if (!url) resovle('');
    wx.downloadFile({
      url,
      success(res) {
        if (res.statusCode === 200) {
          resovle(res.tempFilePath);
        } else {
          reject(res);
        }
      },
      fail(error) {
        reject(error);
      }
    });
  });
};

export const getNetworkType = () => {
  return new Promise((resolve, reject) => {
    wx.getNetworkType({
      success(res) {
        resolve(res.networkType);
      }
    });
  });
};

export const getSystemWidth = () => {
  return new Promise((resolve, reject) => {
    wx.getSystemInfo({
      success: res => {
        resolve(res.windowWidth);
      },
      fail: error => {
        reject(error);
      }
    });
  });
};

export const getSystemInfo = () => {
  return new Promise((resolve, reject) => {
    wx.getSystemInfo({
      success: res => {
        resolve(res);
      },
      fail: error => {
        reject(error);
      }
    });
  });
};
