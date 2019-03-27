Page({
  onLoad(options) {
    console.info('page c onLoad options包含了与些页面有关的参数', options);
  },
  onShow(options) {
    console.info('page c onShow 页面显示时调用，这里并没有options', options);
    console.info('page c all pages', getCurrentPages());
  },
  onReady() {
    console.info('page c onReady 页面没被销毁前只会触发1次，表示页面已经准备妥当，在逻辑层就可以和视图层进行交互了。');
  },
  onHide() {
    console.info('page c onHide 页面进入后台时调用');
  },
  onUnload() {
    console.info('page c onUnload 页面从页面栈移出前调用。');
  }
});