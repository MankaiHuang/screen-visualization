import { stringify } from 'querystring';
import { router } from 'umi';
import { loginByAdmin } from '@/services/login';
// import { baseUrl } from '../../config/proxy.js';
import { baseUrl, severUrl } from '@/utils/request.js';

const LoginModel = {
    namespace: 'adminLogin',
    state: {
        status: undefined,
        userInfo: {},
    },

    effects: {
        * login({ payload }, { call, put }) {
            const { loginName, passWord } = payload.params
            const response = yield loginByAdmin(loginName, passWord); // 通过admin登录
            if (response.data && response.data.token) {
                localStorage.setItem('adminToken', response.data.token)
                localStorage.setItem('userRole', 'admin') // 是否是管理员登陆
                response.data.userid = response.data.id;
                yield put({
                    type: 'changeLoginStatus',
                    payload: response.data,
                });

                // 成功登录后保存用户信息
                yield put({
                    type: 'user/saveCurrentUser',
                    payload: response.data,
                });
                // 成功登录 把当前登录状态保存到localStorage中方式刷新state消失
                localStorage.setItem('currentUser', JSON.stringify(response.data))
                const { origin } = window.location;
                window.location.href = `${origin}/#/screen/template`;
                return true; // 登录成功 返回true
            }
        },
    },

    reducers: {
        changeLoginStatus(state, { payload }) {
            return {
                ...state,
                status: payload.status,
                userInfo: payload,
            };
        },
    },
};

export default LoginModel;