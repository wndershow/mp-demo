export const validataPhone = value => {
  var reg = /^\d{11}$/;
  return reg.test(value);
};

export const validataName = value => {
  var reg = /^[\u4e00-\u9fa5a-zA-Z0-9]{1,15}$/;
  return reg.test(value);
};
