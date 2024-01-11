/**
 * Created by PanJiaChen on 16/11/18.
 * https://github.com/PanJiaChen/vue-element-admin/blob/master/src/utils/index.js
 */

/**
 * Parse the time to string
 * @param {(Object|string|number)} time
 * @param {string} cFormat
 * @returns {string | null}
 */
export function parseTime(time, cFormat = '{y}-{m}-{d} {h}:{i}:{s}') {
  if (arguments.length === 0) {
    return null;
  }
  const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}';
  let date;
  if (typeof time === 'object') {
    date = time;
  } else {
    if (typeof time === 'string' && /^[0-9]+$/.test(time)) {
      time = parseInt(time);
    }

    if (typeof time === 'string' && !/^[0-9]+$/.test(time)) {
      // ios终端
      const isiOS = /(iPhone|iPad|iPod|iOS|Safari)/i.test(navigator.userAgent);

      if (isiOS) {
        time = time.replace(/-/g, '/');
      }
    }
    if (typeof time === 'number' && time.toString().length === 10) {
      time = time * 1000;
    }
    date = new Date(time);
  }
  if (cFormat === 'getTime') {
    return date.getTime();
  }
  const formatObj = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay()
  };
  return format.replace(/{([ymdhisa])+}/g, (result, key) => {
    const value = formatObj[key];
    // Note: getDay() returns 0 on Sunday
    if (key === 'a') {
      return ['日', '一', '二', '三', '四', '五', '六'][value];
    }
    return value.toString().padStart(2, '0');
  });
}

/**
 * @param {number} time
 * @param {string} option
 * @returns {number}
 */
export function formatTime(time, option = 'd') {
  if (!time) return 0;
  if (Number(time)) {
    if (('' + time).length === 10) {
      time = parseInt(time) * 1000;
    } else {
      time = +time;
    }
  }
  const d = new Date(time);
  const now = Date.now();

  const diff = (now - d) / 1000;

  switch (option) {
    case 'd':
      return Number(diff / 3600 / 24);
    case 'h':
      return Number(diff / 3600);
    case 'm':
      return Number(diff / 60);
    case 's':
      return Number(diff);
    default:
      return Number(diff / 3600 / 24);
  }
}

/**
 * @param {string} url
 * @returns {Object}
 */
export function getQueryObject(url) {
  url = url == null ? window.location.href : url;
  const search = url.substring(url.lastIndexOf('?') + 1);
  const obj = {};
  const reg = /([^?&=]+)=([^?&=]*)/g;
  search.replace(reg, (rs, $1, $2) => {
    const name = decodeURIComponent($1);
    let val = decodeURIComponent($2);
    val = String(val);
    obj[name] = val;
    return rs;
  });
  return obj;
}

/**
 * @param {string} input value
 * @returns {number} output value
 */
export function byteLength(str) {
  // returns the byte length of an utf8 string
  let s = str.length;
  for (var i = str.length - 1; i >= 0; i--) {
    const code = str.charCodeAt(i);
    if (code > 0x7f && code <= 0x7ff) s++;
    else if (code > 0x7ff && code <= 0xffff) s += 2;
    if (code >= 0xdc00 && code <= 0xdfff) i--;
  }
  return s;
}

/**
 * @param {Array} actual
 * @returns {Array}
 */
export function cleanArray(actual) {
  const newArray = [];
  for (let i = 0; i < actual.length; i++) {
    if (actual[i]) {
      newArray.push(actual[i]);
    }
  }
  return newArray;
}

/**
 * @param {Object} json
 * @returns {string}
 */
export function param(json) {
  if (!json) return '';
  return cleanArray(
    Object.keys(json).map(key => {
      if (json[key] === undefined) return '';
      return encodeURIComponent(key) + '=' + encodeURIComponent(json[key]);
    })
  ).join('&');
}

/**
 * @param {string} url
 * @returns {Object}
 */
export function param2Obj(url) {
  const search = url.split('?')[1];
  if (!search) {
    return {};
  }
  return JSON.parse(
    '{"' +
      decodeURIComponent(search)
        .replace(/"/g, '\\"')
        .replace(/&/g, '","')
        .replace(/=/g, '":"')
        .replace(/\+/g, ' ') +
      '"}'
  );
}

/**
 * @param {string} val
 * @returns {string}
 */
export function html2Text(val) {
  const div = document.createElement('div');
  div.innerHTML = val;
  return div.textContent || div.innerText;
}

/**
 * Merges two objects, giving the last one precedence
 * @param {Object} target
 * @param {(Object|Array)} source
 * @returns {Object}
 */
export function objectMerge(target, source) {
  if (typeof target !== 'object') {
    target = {};
  }
  if (Array.isArray(source)) {
    return source.slice();
  }
  Object.keys(source).forEach(property => {
    const sourceProperty = source[property];
    if (typeof sourceProperty === 'object') {
      target[property] = objectMerge(target[property], sourceProperty);
    } else {
      target[property] = sourceProperty;
    }
  });
  return target;
}

/**
 * @param {HTMLElement} element
 * @param {string} className
 */
export function toggleClass(element, className) {
  if (!element || !className) {
    return;
  }
  let classString = element.className;
  const nameIndex = classString.indexOf(className);
  if (nameIndex === -1) {
    classString += '' + className;
  } else {
    classString = classString.substr(0, nameIndex) + classString.substr(nameIndex + className.length);
  }
  element.className = classString;
}

/**
 * @param {string} type
 * @returns {Date||number}
 */
export function getTime(type) {
  if (type === 'start') {
    return new Date().getTime() - 3600 * 1000 * 24 * 90;
  } else {
    return new Date(new Date().toDateString());
  }
}

/**
 * @param {Function} func
 * @param {number} wait
 * @param {boolean} immediate
 * @return {*}
 */
export function debounce(func, wait, immediate) {
  let timeout, args, context, timestamp, result;

  const later = function() {
    // 据上一次触发时间间隔
    const last = +new Date() - timestamp;

    // 上次被包装函数被调用时间间隔 last 小于设定时间间隔 wait
    if (last < wait && last > 0) {
      timeout = setTimeout(later, wait - last);
    } else {
      timeout = null;
      // 如果设定为immediate===true，因为开始边界已经调用过了此处无需调用
      if (!immediate) {
        result = func.apply(context, args);
        if (!timeout) context = args = null;
      }
    }
  };

  return function(...args) {
    context = this;
    timestamp = +new Date();
    const callNow = immediate && !timeout;
    // 如果延时不存在，重新设定延时
    if (!timeout) timeout = setTimeout(later, wait);
    if (callNow) {
      result = func.apply(context, args);
      context = args = null;
    }

    return result;
  };
}

/**
 * This is just a simple version of deep copy
 * Has a lot of edge cases bug
 * If you want to use a perfect deep copy, use lodash's _.cloneDeep
 * @param {Object} source
 * @returns {Object}
 */
export function deepClone(source) {
  if (!source && typeof source !== 'object') {
    throw new Error('error arguments');
  }
  const targetObj = source.constructor === Array ? [] : {};
  Object.keys(source).forEach(keys => {
    if (source[keys] && typeof source[keys] === 'object') {
      targetObj[keys] = deepClone(source[keys]);
    } else {
      targetObj[keys] = source[keys];
    }
  });
  return targetObj;
}

/**
 * @param {Array} arr
 * @returns {Array}
 */
export function uniqueArr(arr) {
  return Array.from(new Set(arr));
}

/**
 * @returns {string}
 */
export function createUniqueString() {
  const timestamp = +new Date() + '';
  const randomNum = parseInt((1 + Math.random()) * 65536) + '';
  return (+(randomNum + timestamp)).toString(32);
}

/**
 * Check if an element has a class
 * @param {HTMLElement} elm
 * @param {string} cls
 * @returns {boolean}
 */
export function hasClass(ele, cls) {
  return !!ele.className.match(new RegExp('(\\s|^)' + cls + '(\\s|$)'));
}

/**
 * Add class to element
 * @param {HTMLElement} elm
 * @param {string} cls
 */
export function addClass(ele, cls) {
  if (!hasClass(ele, cls)) ele.className += ' ' + cls;
}

/**
 * Remove class from element
 * @param {HTMLElement} elm
 * @param {string} cls
 */
export function removeClass(ele, cls) {
  if (hasClass(ele, cls)) {
    const reg = new RegExp('(\\s|^)' + cls + '(\\s|$)');
    ele.className = ele.className.replace(reg, ' ');
  }
}

const u_token = 'token';
const u_userInfo = 'userInfo';
const u_agentInfo = 'agentInfo';

// token
export function setToken(token) {
  return localStorage.setItem(u_token, token);
}

export function getToken() {
  return localStorage.getItem(u_token);
}

export function removeToken() {
  return localStorage.removeItem(u_token);
}

// userInfo
export function setUserInfo(userInfo) {
  return localStorage.setItem(u_userInfo, userInfo);
}

export function getUserInfo() {
  return JSON.parse(localStorage.getItem(u_userInfo));
}

export function removeUserInfo() {
  return localStorage.removeItem(u_userInfo);
}

// agentInfo
export function setAgentInfo(agentInfo) {
  return localStorage.setItem(u_agentInfo, JSON.stringify(agentInfo));
}

export function getAgentInfo() {
  return JSON.parse(localStorage.getItem(u_agentInfo));
}

export function removeAgentInfo() {
  return localStorage.removeItem(u_agentInfo);
}

/**
 * 手机号处理
 */
export function phoneHandling(row) {
  let str = String(row);
  str = str.substring(0, 3) + '****' + str.substring(str.length - 4, str.length);
  return str;
}

/**
 * 处理银行卡号
 */
export function dealWithCardNumber(row) {
  const str = String(row);
  const str1 = str.substring(0, 4);
  const str2 = str.substring(str.length - 4, str.length);
  return str1 + ' **** **** ' + str2;
}

export function toFixed2(row, isNum = true) {
  const str = Number(row);
  if (str >= 100000000) {
    return (isNum ? Number((str / 100000000).toFixed(2)) : (str / 100000000).toFixed(2)) + '亿';
  } else if (str >= 10000) {
    return (isNum ? Number((str / 10000).toFixed(2)) : (str / 10000).toFixed(2)) + '万';
  } else {
    const r = str || str === 0 ? str.toFixed(2) : row;
    return r;
  }
}

export function priceToFixed(price) {
  const str = Number(price);
  return str || str === 0 ? str.toFixed(2) : price;
}

/**
 * 跳转三方平台
 */
export function jumpBClient(data) {}

/**
 * 过滤除数字和小数点之外的字符
 * 只能输入数字和小数，小数且只能输入2位，第一位不能输入小数点
 */
export function priceFormatter(value) {
  return value
    .replace(/[^\d.]/g, '')
    .replace(/\.{2,}/g, '.')
    .replace('.', '$#$')
    .replace(/\./g, '')
    .replace('$#$', '.')
    .replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3')
    .replace(/^\./g, '');
}

/**
 * 过滤除数字和小数点之外的字符
 * 只能输入数字和小数，小数且只能输入2位，第一位不能输入小数点
 */
export function priceFormatter0(value) {
  if (value) {
    const val = value
      .replace(/[^\d.]/g, '')
      .replace(/\.{2,}/g, '.')
      .replace('.', '$#$')
      .replace(/\./g, '')
      .replace('$#$', '.')
      .replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3')
      .replace(/^\./g, '')
    return parseInt(val)
  } else {
    return ''
  }
}
