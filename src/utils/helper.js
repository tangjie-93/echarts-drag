/**
 * 获取数据的类型
 * @param {any} obj
 */
export function toType(obj) {
    const toString = Object.prototype.toString;
    const type = typeof obj;
    return /^(object|function)/.test(type)
      ? toString
          .call(obj)
          .slice(8, -1)
          .toLowerCase()
      : type;
  }
  /**
   * 获取数据所有可遍历的属性
   * @param {Object} obj
   */
  export function getOwnProperty(obj) {
    if (obj == null) return [];
    return [...Object.keys(obj), ...Object.getOwnPropertySymbols(obj)];
  }
  /**
   * 数据浅拷贝
   * @param {any} objData
   */
  export function shallowCopy(objData) {
    const type = toType(objData);
    if (/^(number|string|boolean|symbol|bigint)$/.test(type)) return objData;
    if (/^(date|regexp)$/.test(type)) return new objData.consgtructor(objData);
    if (/^function$/.test(type)) return new objData.call(this, ...arguments);
    if (/^error$/.test(type)) return new objData.consgtructor(objData.message);
    if (/^(array|object)/.test(type)) {
      const res = type === "object" ? {} : [];
      const keys = getOwnProperty(objData);
      keys.forEach((key) => {
        res[key] = objData[key];
      });
      return res;
    }
  }
  /**
   * 数据深拷贝
   * @param {any} objData
   * @param {Set} cache
   */
  export function deepCopy(objData, cache = new Set()) {
    const type = toType(objData);
    if (!/^(array|object)$/.test(type)) return shallowCopy(objData);
    //避免调用自身出现死循环
    if (cache.has(objData)) return shallowCopy(objData);
    cache.add(objData);
    //只处理数组和对象
    const keys = getOwnProperty(objData);
    const res = type === "array" ? [] : {};
    return keys.reduce((obj, key) => {
      obj[key] = deepCopy(objData[key], cache);
      return obj;
    }, res);
  }
  /**
   * 函数防抖
   * @param {Function} fn
   * @param {Number} wait
   */
  export function debounce(fn, wait = 300) {
    let timer = null;
    return () => {
      timer && clearTimeout(timer);
      !timer && fn.call(this, ...arguments);
      timer = setTimeout(() => {
        timer = null;
      }, wait);
    };
  }
  /**
   * 函数节流
   * @param {Function} fn
   * @param {Number} wait
   */
  export function throtle(fn, wait = 300) {
    let timer = null;
    let previousTime = 0; //函数执行的上一个时间点
    return () => {
      let now = +new Date(); //获取当前时间戳
      let remain = now - previousTime; //表示等待的时间是否大于需要等待的时间
      if (remain > wait) {
        if (timer) {
          clearTimeout(timer);
          timer = null;
          previousTime = +new Date();
          fn.call(this, ...arguments);
        }
      } else {
        if (!timer) {
          timer = setTimeout(() => {
            timer = null;
            previousTime = +new Date();
            fn.call(this, ...arguments);
            //表示还需要等待多少时间才能实行函数
          }, wait - remain);
        }
      }
    };
  }