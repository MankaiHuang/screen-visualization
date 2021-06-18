/*
 * @Descripttion: 
 * @Author: cbz
 * @Date: 2020-10-22 10:27:24
 * @LastEditors: cbz
 * @LastEditTime: 2020-10-26 14:36:17
 */
import { queryDataSource, initProxyCode, initProxyPack } from '@/services/dataSource';
import { message } from "antd"

const ChartModel = {
  namespace: 'dataSource',
  state: {
    testdata: {},
    res: {}
  },
  effects: {
    *fetchData ({ url, method, body }, { call, put }) {
      const res = yield call(queryDataSource, url, method, body);
      if (res) {
        message.success('请求发送成功');
      }
      yield put({
        type: 'saveRes',
        payload: res,
      });
    },
    *getProxyCode ({ payload }, { call, put }) {
      const { data } = yield call(initProxyCode)
      return data
    },
    *getProxyPack ({ payload }, { call, put }) {
      const { data } = yield call(initProxyPack, payload)
      return data
    }
  },

  reducers: {
    saveRes (state, action) {
      return {
        ...state,
        res: action.payload || null
      };
    },
    clearRes (state, action) {
      return {
        ...state,
        res: {},
        testdata: {}
      };
    },
  },
};
export default ChartModel;
