import { createWebHashHistory, createRouter } from 'vue-router'
import routes from './routes'
import store from '../store'
import setPageTitle from '@/utils/set-page-title.js'
import { getToken } from '@/utils/index.js'

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

function UrlSearch() {
  let name, value;
  let str = location.href; // 取得整个地址栏
  let num = str.indexOf('?')
  str = str.substr(num + 1); // 取得所有参数 stringvar.substr(start [, length ]

  const arr = str.split('&'); // 各个参数放到数组里
  for (let i = 0; i < arr.length; i++) {
    num = arr[i].indexOf('=');
    if (num > 0) {
      name = arr[i].substring(0, num);
      value = arr[i].substr(num + 1);
      this[name] = value;
    }
  }
}

router.beforeEach((to, from, next) => {
  const Request = new UrlSearch();
  if (Request.code) {
    localStorage.setItem('requestCode', Request.code);
  }
  const token = getToken()
  if (to.meta.title) {
    // 路由缓存
    store.commit('cachedView/ADD_CACHED_VIEW', to)
  }
  // 设置页面 title
  setPageTitle('小艾竞技-' + to.meta.title)
  if (token) {
    if (to.name === 'Login' || to.name === 'Register') {
      next({ name: 'Home' })
    } else {
      if (to.meta.isAgent) {
        const isAgent = [1, 2].includes(
          Number(store.getters.getUserInfo.account_type)
        )
        isAgent ? next() : next('/join-us')
      } else {
        next()
      }
    }
  } else {
    to.meta.unLogin ? next() : next('/login')
  }
})

export default router
