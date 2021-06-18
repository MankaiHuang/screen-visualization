/*
 * @Descripttion: 
 * @Author: cbz
 * @Date: 2021-03-05 18:09:01
 * @LastEditors: cbz
 * @LastEditTime: 2021-03-12 11:33:34
 */
import { reloadAuthorized } from './Authorized'; // use localStorage to store the authority info, which might be sent from server in actual project.

export function getAuthority (str) {
    const authorityString =
        typeof str === 'undefined' && localStorage ? localStorage.getItem('userRole') : str; // authorityString could be admin, "admin", ["admin"]

    let authority;

    try {
        if (authorityString) {
            authority = JSON.parse(authorityString);
        }
    } catch (e) {
        authority = authorityString;
    }

    if (typeof authority === 'string') {
        return [authority];
    } // preview.pro.ant.design only do not use in your production.
    // preview.pro.ant.design 专用环境变量，请不要在你的项目中使用它。

    if (!authority) {
        return ['user'];
    }
    return authority;
}
export function setAuthority (authority) {
    const proAuthority = typeof authority === 'string' ? [authority] : authority;
    localStorage.setItem('antd-pro-authority', JSON.stringify(proAuthority)); // auto reload

    reloadAuthorized();
}