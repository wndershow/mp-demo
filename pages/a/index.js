Page({
  data: {
    isShowAvatar: true
  },
  onLoad(options) {
    console.info('page a onLoad options包含了与些页面有关的参数', options);
  },
  onShow(options) {
    console.info('page a onShow 页面显示时调用，这里并没有options', options);
    console.info('page a all pages', getCurrentPages());
  },
  onReady() {
    console.info('page a onReady 页面没被销毁前只会触发1次，表示页面已经准备妥当，在逻辑层就可以和视图层进行交互了。');
  },
  onHide() {
    console.info('page a onHide 页面进入后台时调用');
  },
  onUnload() {
    console.info('page a onUnload 页面从页面栈移出前调用。');
  },
  handleToggleAvatar() {
    this.setData({
      isShowAvatar: !this.data.isShowAvatar
    });
  }
});
