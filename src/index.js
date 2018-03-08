import '@babel/polyfill';
import 'url-polyfill';
import dva from 'dva';

import createHistory from 'history/createHashHistory';
// user BrowserHistory
// import createHistory from 'history/createBrowserHistory';
import createLoading from 'dva-loading';
import 'moment/locale/zh-cn';
import './rollbar';

import './index.less';
// 1. 初始化
const app = dva({
  history: createHistory(),
});

// 2. 插件
app.use(createLoading());

// 3. 注册全局 modal
app.model(require('./models/global').default);

// 4. 路由
app.router(require('./router').default);

// 5. 开始吧
app.start('#root');

export default app._store;  // eslint-disable-line
