import { createApp } from 'vue';
import router from './router/index.js';
import store from './store/index.js';
import App from './App.vue';

const app = createApp(App);

// normalize.css
import 'normalize.css/normalize.css';
// 全局样式
import '@/styles/index.less';
import mitt from 'mitt';
// 注册全局 event mitt方法
app.config.globalProperties.mittBus = mitt();

// 按需注册 vant 组件
import { registerVantComp } from '@/plugins/registerVant';
registerVantComp(app);

// svg-icon
import { registerSvgIconComp } from '@/plugins/registerSvgIcon.js';
registerSvgIconComp(app);

app
  .use(router)
  .use(store)
  .mount('#app');
