import store from '../../store/index';
import create from '../../vendor/westore/create';

create(store, {
  data: {
    firstName: ''
  },
  handleTest() {
    this.store.data.firstName = 'xxxx';
    this.update();
  }
});
