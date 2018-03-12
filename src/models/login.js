import { routerRedux } from 'dva/router';
import { fakeAccountLogin } from '../services/api'; // api 调用
import { setAuthority } from '../utils/authority';  // 权限获取
import { reloadAuthorized } from '../utils/Authorized';  // some what ??

export default {
  namespace: 'login',

  state: {
    status: undefined,
  },


  // 异步调用都在这里
  effects: {
    *login({ payload }, { call, put }) {
      //call, put 貌似是redux-saga 的API
      //call 貌似 从api 异步获取数据
      //put 貌似 把数据 存到 store 里
      console.log(payload)
      console.log(call)
      console.log(put)
      const response = yield call(fakeAccountLogin, payload);
      yield put({
        type: 'changeLoginStatus', // 一个 type 代表 reducer 里的一个函数
        payload: response,
      });
      // Login successfully
      if (response.status === 'ok') {
        reloadAuthorized();
        yield put(routerRedux.push('/')); // router 的跳转
      }
    },
    *logout(_, { put, select }) {
      try {
        // get location pathname
        const urlParams = new URL(window.location.href);
        const pathname = yield select(state => state.routing.location.pathname);
        // add the parameters in the url
        urlParams.searchParams.set('redirect', pathname);
        window.history.replaceState(null, 'login', urlParams.href);
      } finally {
        yield put({
          type: 'changeLoginStatus',
          payload: {
            status: false,
            currentAuthority: 'guest',
          },
        });
        reloadAuthorized();
        yield put(routerRedux.push('/user/login'));
      }
    },
  },

  reducers: {
    changeLoginStatus(state, { payload }) {
      setAuthority(payload.currentAuthority);
      return {
        ...state,
        status: payload.status,
        type: payload.type,
      };
    },
  },
};

// 函数式的入门学习 刻不容缓啊
