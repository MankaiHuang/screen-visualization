/*
 * @Descripttion:
 * @Author: cbz
 * @Date: 2020-07-02 18:48:06
 * @LastEditors: cbz
 * @LastEditTime: 2021-01-19 17:37:29
 */
export default (api) => {
  api.addHTMLHeadScript({
    type: "text/javascript",
    src: 'https://webapi.amap.com/maps?v=1.4.9&key=b1876df77766a9ea12e4e047fc3588fc',
  });
};