/*
 * @Descripttion: 
 * @Author: cbz
 * @Date: 2020-10-10 09:57:15
 * @LastEditors: cbz
 * @LastEditTime: 2020-12-09 10:13:52
 */
import request, { severUrl } from '@/utils/request';

// export async function login ({ code, redirect_url }) {
//   return request(
//     `${severUrl}/auth?code=${code}&redirect_url=${redirect_url}`, {
//     method: 'get',
//   })
// }
export async function logout() {
    return request(
        `${severUrl}/auth/logout`, {
            method: 'get',
        })

}

/**
 * 使用token登陆
 * @param {*} token 
 * @param {*} siteCode 
 */
export async function loginByToken() {
    return request(`${severUrl}/auth/check`, {
        method: 'get'
    });
}

export async function loginByAdmin(loginName, passWord) {
    return request(`${severUrl}/stage/user/login?loginName=${loginName}&passWord=${passWord}`, {
        method: 'get'
    });
}
// 获取认证中心的相关配置
// export function getSsoConfig () {
//   return request(
//     `${severUrl}/auth/config`, {
//     method: 'get',
//   }
//   )
// }
// export async function loginFail ({ location }) {
//   return request(`${severUrl}/auth/login?location=${location}`, {
//     method: 'get',
//   });
// }