const PROPERTIES = ['data', 'onLoad', 'onReady', 'onShow', 'onHide', 'onUnload', 'onPullDownRefresh', 'onReachBottom', 'onShareAppMessage', 'onPageScroll', 'onTabItemTap']

let native = Page;
Page = (obj) => {
  let {mixins = []} = obj;
  Reflect.deleteProperty(obj, "mixins");
  let pageData = mixins.length <= 0 ? obj : merge(obj, ...mixins);
  native(pageData);
}

const merge = (rootObj, ...objs) => {
  let root = {};
  objs.forEach((el) => {
      root = recursive(rootObj, el);
  })
  return root;
}

const recursive = (rootObj, obj) => {
  for(let attr in obj){
    if(rootObj[attr] === undefined){
      rootObj[attr] = obj[attr];
    } else if (isObject(obj[attr])){
      merge(rootObj[attr],obj[attr])
    } else{
      if (!PROPERTIES.includes(attr)) {
        rootObj[attr] = obj[attr];
        return
      }

      let o = obj[attr]
      let r = rootObj[attr]
      rootObj[attr] = function (...args) {
        o.call(this, ...args)
        return r && r.call(this, ...args)
      }
    }
  }
  return rootObj;
}

const isObject = (obj) => {
  return Object.prototype.toString.call(obj).includes("Object");
}
