/*
 * @Descripttion: 
 * @Author: cbz
 * @Date: 2020-10-16 14:36:45
 * @LastEditors: cbz
 * @LastEditTime: 2020-10-19 17:51:45
 */
import { loginByToken } from '@/services/login';
import { getCookie } from '@/utils/utils';

const UserModel = {
  namespace: 'user',
  state: {
    currentUser: JSON.parse(localStorage.getItem('currentUser')),
  },
  effects: {

    *fetchCurrent (data, { call, put }) {
      let { token, siteCode } = data.query || {};
      token = token || getCookie('token');
      siteCode = siteCode || getCookie('siteCode');

      if (token && siteCode) {
        const response = yield call(loginByToken, token, siteCode);
        yield put({
          type: 'saveCurrentUser',
          payload: response,
        });
      }
    },
  },
  reducers: {
    saveCurrentUser (state, action) {
      return { ...state, currentUser: action.payload || {} };
    },

  },
};
export default UserModel;
