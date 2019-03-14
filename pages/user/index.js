Page({
  onLoad() {
    console.info('Page user onLoad');
  },
  onShow() {
    console.info('Page user onShow');
  },
  onReady() {
    console.info('Page user onReady');
    let pages = getCurrentPages();
    console.info(pages);
  },
  onUnload() {
    console.info('Page user onUnload');
  }
});
