function isObj(x) {
  var toString = Object.prototype.toString;
  var prototype;
  return (
    toString.call(x) === "[object Object]" &&
    ((prototype = Object.getPrototypeOf(x)),
    prototype === null || prototype === Object.getPrototypeOf({}))
  );
}

function parsePath(str = "") {
  let list = [];
  const reg = /\[\d+\]/g;
  str.split(".").forEach(item => {
    let arr = item.split(reg).concat(item.match(reg));
    arr = arr.filter(item => !!item);
    arr = arr.map(item => {
      if (item.charAt(0) === "[" && item.charAt(item.length - 1) === "]") {
        return parseInt(item.slice(1, -1));
      } else {
        return item;
      }
    });
    list = list.concat(arr);
  });
  return list;
}

function setPath(obj, path, value) {
  const segs = parsePath(path);
  segs.reduce((deep, seg, i) => {
    return (deep[seg] =
      segs.length - 1 === i ? (deep[seg] = value) : deep[seg] || {});
  }, obj);
  return obj;
}

function computed(page) {
  if (!isObj(page)) {
    throw new TypeError("page has to be plain object");
  }
  const _onLoad = page.onLoad;
  page.onLoad = function() {
    let _data = page.data;
    const _setData = this.setData;
    Object.defineProperty(this, "setData", {
      configurable: true,
      enumerable: true,
      writable: false,
      value: (d, f) => {
        if (!isObj(d)) {
          throw new TypeError("param has to be plain object");
        }
        Object.keys(d).forEach(k => {
          setPath(_data, k, d[k]);
        });
        _setData.call(this, _data, f);
      }
    });
    _onLoad.apply(this, arguments);
  };
  return page;
}

module.exports = computed;
