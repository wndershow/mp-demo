Component({
  options: {
    addGlobalClass: true
  },
  data: {
    fn: 'ding',
    ln: 'jiazhen'
  },
  lifetimes: {
    attached() {
      setTimeout(() => {
        console.info('xxxxx');
        this.setData({
          ln: 'xy'
        });
      }, 3000);
      console.info('attached');
    },
    detached() {
      console.info('detached');
    },
    error() {
      console.info('error');
    }
  },
  observers: {
    'fn, ln': function(fn, ln) {
      this.setData({
        fullName: fn + ln
      });
    }
  },
  methods: {
    xxx() {
      throw new Error('xxxx');
    }
  }
});
