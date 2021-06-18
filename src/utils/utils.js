import { parse } from 'querystring';
import pathRegexp from 'path-to-regexp';
import Item from 'antd/lib/list/Item';

const { PI } = Math
/* eslint no-useless-escape:0 import/prefer-default-export:0 */
const reg = /(((^https?:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+(?::\d+)?|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)$/;
export const isUrl = path => reg.test(path);

export const getPageQuery = () => parse(window.location.href.split('?')[1]);
/**
 * props.route.routes
 * @param router [{}]
 * @param pathname string
 */

export const getAuthorityFromRouter = (router = [], pathname) => {
  const authority = router.find(
    ({ routes, path = '/' }) =>
      (path && pathRegexp(path).exec(pathname)) ||
      (routes && getAuthorityFromRouter(routes, pathname)),
  );
  if (authority) return authority;
  return undefined;
};
export const getRouteAuthority = (path, routeData) => {
  let authorities;
  routeData.forEach(route => {
    // match prefix
    if (pathRegexp(`${route.path}/(.*)`).test(`${path}/`)) {
      if (route.authority) {
        authorities = route.authority;
      } // exact match

      if (route.path === path) {
        authorities = route.authority || authorities;
      } // get children authority recursively

      if (route.routes) {
        authorities = getRouteAuthority(path, route.routes) || authorities;
      }
    }
  });
  return authorities;
};

/**
 * 替换当前地址中的REQUEST_IP 通配符
 * @param {*} url
 * @param {*} origin
 */
export function replaceRequestConf (url, origin = window.location.hostname) {
  origin = origin.replace('localhost', '172.16.131.74');
  if (!url) return undefined;
  if (url.indexOf('${REQUEST_IP}') === -1) {
    return url;
  }
  return url.replace(/\$\{REQUEST_IP\}/g, origin);
}

/**
 * 获取cookie
 * @param name
 * @returns {*}
 */
export function getCookie (name) {
  let arr;
  const cookieReg = new RegExp(`(^| )${name}=([^;]*)(;|$)`);
  if ((arr = document.cookie.match(cookieReg))) {
    return unescape(arr[2]);
  }
  return null;
}

// 获取随机GUID
export function getGuid () {
  const S4 = function () {
    return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
  };
  return `${S4() + S4()}-${S4()}-${S4()}-${S4()}-${S4()}${S4()}${S4()}`;
}

/**
 * 函数防抖
 * @param {*} func
 * @param {*} wait
 * @param {*} params // 传递给fn的参数
 */
export const debounce = (() => {
  let timer = null;
  return (fn, duration) => function (...args) {
    if (typeof timer === 'number') clearTimeout(timer);
    timer = setTimeout(() => {
      fn(...args);
      timer = null;
    }, duration);
  }
})();


export function formatJson (json, options) {
  let reg = null;
  let formatted = '';
  let pad = 0;
  const PADDING = '    '; // one can also use '\t' or a different number of spaces
  options = options || {};
  options.newlineAfterColonIfBeforeBraceOrBracket =
    options.newlineAfterColonIfBeforeBraceOrBracket === true;
  options.spaceAfterColon = options.spaceAfterColon !== false;
  if (typeof json !== 'string') {
    json = JSON.stringify(json);
  }
  json = JSON.parse(json);
  json = JSON.stringify(json);
  reg = /([\{\}])/g;
  json = json.replace(reg, '\r\n$1\r\n');
  reg = /([\[\]])/g;
  json = json.replace(reg, '\r\n$1\r\n');
  reg = /(\,)/g;
  json = json.replace(reg, '$1\r\n');
  reg = /(\r\n\r\n)/g;
  json = json.replace(reg, '\r\n');
  reg = /\r\n\,/g;
  json = json.replace(reg, ',');
  if (!options.newlineAfterColonIfBeforeBraceOrBracket) {
    reg = /\:\r\n\{/g;
    json = json.replace(reg, ':{');
    reg = /\:\r\n\[/g;
    json = json.replace(reg, ':[');
  }
  if (options.spaceAfterColon) {
    reg = /\:/g;
    json = json.replace(reg, ': ');
  }
  json.split('\r\n').map(node => {
    let i = 0;
    let indent = 0;
    let padding = '';
    if (node.match(/\{$/) || node.match(/\[$/)) {
      indent = 1;
    } else if (node.match(/\}/) || node.match(/\]/)) {
      if (pad !== 0) {
        pad -= 1;
      }
    } else {
      indent = 0;
    }
    for (i = 0; i < pad; i++) {
      padding += PADDING;
    }
    formatted += `${padding + node}\r\n`;
    pad += indent;
  });
  return formatted;
}
// 获取时间 fmt传格式如 'yyyy-MM-dd HH:mm:ss'
export function getNowTime (fmt) {
  const date = new Date();
  const o = {
    'M+': date.getMonth() + 1, // 月份
    'd+': date.getDate(), // 日
    'H+': date.getHours(), // 小时
    'm+': date.getMinutes(), // 分
    's+': date.getSeconds(), // 秒
    'q+': Math.floor((date.getMonth() + 3) / 3), // 季度
    S: date.getMilliseconds(), // 毫秒
  };
  if (/(y+)/.test(fmt))
    fmt = fmt.replace(RegExp.$1, `${date.getFullYear()}`.substr(4 - RegExp.$1.length));
  for (const k in o)
    if (new RegExp(`(${k})`).test(fmt))
      fmt = fmt.replace(
        RegExp.$1,
        RegExp.$1.length == 1 ? o[k] : `00${o[k]}`.substr(`${o[k]}`.length),
      );
  return fmt;
}
// blob 转base64
export function blobToBase64 (blob) {
  return new Promise((resolve, reject) => {
    const fileReader = new FileReader();
    fileReader.onload = (e) => {
      resolve(e.target.result);
    };
    // readAsDataURL
    fileReader.readAsDataURL(blob);
    fileReader.onerror = () => {
      reject(new Error('blobToBase64 error'));
    };
  });
}

export function objectUrlEval (data, type, isEdit, result = '') {
  // 此方法的用法:
  // 若存在 此数据结构的数据 ps: a: { b: c: { d: { name: 'xx'}} }
  // 调用此方法仅需 objectUrlEval(a, 'b.c.d.name',false) 即可返回 'xx'
  // 若  objectUrlEval(a, 'b.c.d.name',true, 'yy') 可修改name的值为 'yy'
  // 第一个参数是数据源 第二个参数是对象的路径 第三个若传则为此路径赋值
  if (data !== undefined) {
    const temp = type.split('.');
    const tempLength = temp.length; // 路径的长度
    let tempA = data;
    for (let i = 0; i < tempLength; i++) {
      if (i === tempLength - 1) {
        if (isEdit) {
          tempA[temp[i]] = result // 赋值
          // 如果想要监听数组变化用set
          // this.$set(tempA, temp[i], result);
          break;
        } else {
          // if (typeof tempA[temp[i]] === 'object') {
          //     return JSON.stringify(tempA[temp[i]])
          // }
          return tempA[temp[i]]; // 获取值返回
        }
      }
      if (typeof tempA[temp[i]] === 'object') {
        tempA = tempA[temp[i]];
        continue;
      }
    }
  }
}
export function findGroupForId (nowGroupId, templateList) {
  // 根据组id获取组
  let nowGroupTemplate = null
  const find = (node) => { // 匿名函数防止this指向错误
    node.some(item => {
      const { type, elementId } = item.property
      if (type === 'group' && elementId === nowGroupId) {
        nowGroupTemplate = item;
        return true
      } if (type === 'group') {
        // 去组里面找看是否为组嵌套
        find(item.property.children)
      }
    })
  }
  find(templateList)
  return nowGroupTemplate
}
/**
*  求partArr数组中不包含allArr的数组
*  @param allArr：全数组
*  @param partArr：缺省数组
* */
export function getDifferentArr (allArr, allArrKey, partArr, partArrKey) {
  for (let i = allArr.length - 1; i >= 0; i--) {
    for (let j = 0; j < partArr.length; j++) {
      if (allArr[i][allArrKey] === partArr[j][partArrKey]) {
        partArr.splice(j, 1);
        break;
      }
    }
  }
  return partArr;
}
/**
 * @name: 
 * @param {*} e
 * @param {*} setSpinning 设置spin
 * @param {*} setSpinText 设置spin文字
 * @param {*} spinText  spin文字
 * @param {*} successCallback 成功回调
 * @param {*} errorCallback 失败回调
 * @return {*}
 */
export function inputUploadImg (e, setSpinning, setSpinText, spinText, successCallback, errorCallback) {
  if (e.file.status === 'uploading') {
    setSpinning(true)
    setSpinText(spinText)
    return;
  }
  if (e.file.status === 'error') {
    setSpinning(false)
    errorCallback()
  }
  if (e.file.status === 'done') {
    if (e.file.response.code === 200) {
      successCallback()
    } else {
      errorCallback()
    }
    setSpinning(false)
  }
}
function transformlat (lng, lat) {
  var lat = +lat;
  var lng = +lng;
  let ret = -100.0 + 2.0 * lng + 3.0 * lat + 0.2 * lat * lat + 0.1 * lng * lat + 0.2 * Math.sqrt(Math.abs(lng));
  ret += (20.0 * Math.sin(6.0 * lng * PI) + 20.0 * Math.sin(2.0 * lng * PI)) * 2.0 / 3.0;
  ret += (20.0 * Math.sin(lat * PI) + 40.0 * Math.sin(lat / 3.0 * PI)) * 2.0 / 3.0;
  ret += (160.0 * Math.sin(lat / 12.0 * PI) + 320 * Math.sin(lat * PI / 30.0)) * 2.0 / 3.0;
  return ret
}
function transformlng (lng, lat) {
  var lat = +lat;
  var lng = +lng;
  let ret = 300.0 + lng + 2.0 * lat + 0.1 * lng * lng + 0.1 * lng * lat + 0.1 * Math.sqrt(Math.abs(lng));
  ret += (20.0 * Math.sin(6.0 * lng * PI) + 20.0 * Math.sin(2.0 * lng * PI)) * 2.0 / 3.0;
  ret += (20.0 * Math.sin(lng * PI) + 40.0 * Math.sin(lng / 3.0 * PI)) * 2.0 / 3.0;
  ret += (150.0 * Math.sin(lng / 12.0 * PI) + 300.0 * Math.sin(lng / 30.0 * PI)) * 2.0 / 3.0;
  return ret
}

function out_of_china (lng, lat) {
  var lat = +lat;
  var lng = +lng;
  // 纬度3.86~53.55,经度73.66~135.05
  return !(lng > 73.66 && lng < 135.05 && lat > 3.86 && lat < 53.55);
}

export function gcj02towgs84 (lng, lat) {
  const a = 6378245.0; //  a: 卫星椭球坐标投影到平面地图坐标系的投影因子。
  const ee = 0.00669342162296594323; //  ee: 椭球的偏心率。
  var lat = +lat;
  var lng = +lng;
  if (out_of_china(lng, lat)) {
    return [lng, lat]
  }
  let dlat = transformlat(lng - 105.0, lat - 35.0);
  let dlng = transformlng(lng - 105.0, lat - 35.0);
  const radlat = lat / 180.0 * PI;
  let magic = Math.sin(radlat);
  magic = 1 - ee * magic * magic;
  const sqrtmagic = Math.sqrt(magic);
  dlat = (dlat * 180.0) / ((a * (1 - ee)) / (magic * sqrtmagic) * PI);
  dlng = (dlng * 180.0) / (a / sqrtmagic * Math.cos(radlat) * PI);
  const mglat = lat + dlat;
  const mglng = lng + dlng;
  return [lng * 2 - mglng, lat * 2 - mglat]

}