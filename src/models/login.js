/*
 * @Descripttion: 
 * @Author: cbz
 * @Date: 2020-10-10 09:57:15
 * @LastEditors: cbz
 * @LastEditTime: 2021-03-12 11:19:57
 */
import { stringify } from 'querystring';
import { router } from 'umi';
import { loginByToken, logout } from '@/services/login';
// import { baseUrl } from '../../config/proxy.js';
import { baseUrl, severUrl } from '@/utils/request.js';

const Model = {
    namespace: 'login',
    state: {
        status: undefined,
        userInfo: {}
    },

    effects: {
        * login({}, { call, put }) {
            const response = yield call(loginByToken); // 通过token登录
            //debugger
            if (response.userId) {
                yield put({
                    type: 'changeLoginStatus',
                    payload: response,
                });

                // 成功登录后保存用户信息
                yield put({
                    type: 'user/saveCurrentUser',
                    payload: response,
                });
                // 成功登录 把当前登录状态保存到localStorage中方式刷新state消失
                localStorage.setItem('currentUser', JSON.stringify(response))
                localStorage.setItem('stageUserAdmin', response.stageUserAdmin) //接口控制
                localStorage.setItem('userRole', response.stageUserAdmin ? 'admin' : 'user') //界面控制
                return true; // 登录成功 返回true
            }
            // 登陆失败或者认证失败后
            window.location.href = `${baseUrl}${severUrl}/auth/login?location=${encodeURIComponent(window.location.href)}`;
            return false;
        },
        * logout({ payload }, { call, put }) {
            // const { redirect } = getPageQuery();
            yield call(logout)
            yield put({
                type: 'changeLoginStatus',
                payload: {},
            });
            yield put({
                type: 'user/saveCurrentUser',
                payload: {},
            });
            localStorage.setItem('currentUser', '{}')
            localStorage.setItem('userRole', '')

            const { origin } = window.location;
            // window.location.href = localStorage.getItem('loginOutUrl')
            // window.location.href = `${baseUrl}${severUrl}/auth/login`;
        },
    },

    reducers: {
        changeLoginStatus(state, { payload }) {
            return {
                ...state,
                status: payload.status,
                userInfo: payload
            };
        },
    },
};

export default Model;