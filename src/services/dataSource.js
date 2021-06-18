/*
 * @Descripttion: 
 * @Author: cbz
 * @Date: 2020-10-22 10:27:24
 * @LastEditors: cbz
 * @LastEditTime: 2020-12-11 10:21:06
 */
import request,{severUrl} from '@/utils/request';

export function queryDataSource (url, method, body) {
  return request(url, {
    method,
    data: body,
    prefix: ''
  });
}
export function initProxyCode () {
  return request(`${severUrl}/interface/proxys`, {
    method: 'get',
  });
}
export function initProxyPack ({ id }) {
  return request(`${severUrl}/interface/pack?id=${id}`, {
    method: 'get',
  });
}