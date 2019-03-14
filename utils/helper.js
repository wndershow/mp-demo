import dayjs from 'dayjs';
import * as _wechat from './wechat';

export const wait = time => {
  return new Promise((rs, rj) => {
    setTimeout(() => {
      rs();
    }, time);
  });
};

export const genNo = (randLen = 6) => {
  let cd = dayjs().format('YYYYMM');
  let rs = 'QWERTYUIOPASDFGHJKLZXCVBNM';
  let t = [];
  for (let i = 1; i <= randLen; i++) {
    let rn = random(rs.length - 1);
    t.push(rs[rn]);
  }
  return cd + t.join('');
};

export const random = max => {
  return Math.floor(Math.random() * Math.floor(max));
};

export const downloadFiles = (urls = []) => {
  if (!urls.length) return [];
  return Promise.all(urls.map(n => _wechat.downloadFile(n)));
};

export const isEmptyObj = obj => {
  return Object.keys(obj).length === 0 && obj.constructor === Object;
};
