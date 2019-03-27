App({
  onLaunch(options) {
    console.info('App onLaunch', options);
  },
  onShow(options) {
    console.info('App onShow', options);
  },
  onHide() {
    console.info('App onHide');
  },
  onError(msg) {},
  globalData: {}
});
