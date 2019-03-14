Page({
  onReady() {
    console.info('Page b onReady');
    let pages = getCurrentPages();
    console.info(pages);
  },
  goUser() {
    wx.reLaunch({
      url: '/pages/c/index'
    });
  }
});
