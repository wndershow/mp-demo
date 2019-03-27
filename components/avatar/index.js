Component({
  options: {
    addGlobalClass: true
  },
  pageLifetimes: {
    show() {
      console.info('avatar page show');
    },
    hide() {
      console.info('avatar page hide');
    }
  },
  lifetimes: {
    attached() {
      console.info('avatar attached');
    },
    detached() {
      console.info('avatar detached');
    }
  }
});
