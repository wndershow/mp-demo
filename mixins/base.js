const APP = getApp();
import * as ex from '../utils/media-ex';
import * as pageUtils from '../utils/pageUtils';

module.exports = {
  data: {
    loginer: {
      id: 0,
      role: ''
    },
    role: ''
  },
  $tip: null,
  $confirm: null,
  loginer: null,
  onShow() {
    ex.reset();
    this.genLoginer();
  },
  onLoad() {
    this.$tip = this.selectComponent('#tip');
    this.$confirm = this.selectComponent('#confirm');
    this.genLoginer();
  },
  genLoginer() {
    this.loginer = wx.getStorageSync('userInfo');
    if (this.loginer.role) {
      this.loginer.isTeacher = this.loginer.role === 'TEACHER';
    }
    this.setData({
      loginer: this.loginer
    });
  },
  getParams() {
    return pageUtils.getParams();
  },
  needIndexBar() {
    let { from } = pageUtils.getParams();
    return !!from && (from === 'share' || from === 'notification');
  },
  isFromShare() {
    let { from } = pageUtils.getParams();
    return !!from && from === 'share';
  }
};
