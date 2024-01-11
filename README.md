### 安装依赖
```
yarn
```
### OR
```
npm install
```

### 启动服务
```
npm run serve 
```
### OR
```
npm run dev
```

### 打包
```
npm run build
```

### eslint代码检测
```
npm run lint --fix 可选
```



### 文档引导

> - [按需引入 vant 组件](#vant)
> - [SVG 图标使用](#svg)
> - [路由缓存&命名注意⚠](#router)
> - [调试面板 eruda](#console)
> - [动态设置页面标题](#page-title)
> - [vw视口适配](#viewport)
> - [CDN加载依赖](#CDN)



### - <span id="vant">按需引入 vant 组件</span>

全量引入组件库太过臃肿，这里进行了按需引入，需要增加组件的话在`registerVant.js`中添加即可。

```js
// src/plugins/registerVant.js

// 下面示例增加 Tabbar、TabbarItem 这两个组件
import {
  // ...
  Tabbar,
  TabbarItem
} from 'vant'

const componentList = [
  // ...
  Tabbar,
  TabbarItem
]

// ...
```



### - <span id="svg">SVG 图标使用</span>

> 1. 将 svg 图标文件放在`src/icons/svg`目录下
> 2. 在项目中直接使用`<svg-icon icon-class="svg图标文件命名" />`即可

例如：

本项目`src/icons/svg`中放了个叫`check-in.svg`的图标文件，然后在组件`icon-class`属性中填入文件的命名即可，So easy~

```Vue
<svg-icon icon-class="check-in" />
```



### - <span id="router">路由缓存&命名注意⚠</span>

组件默认开启缓存，如某个组件需关闭缓存，在对应路由 routes meta 内的`noCache`字段赋值为`true`即可。

```js
{
  path: '/about',
  name: 'About',
  component: () => import('@/views/about'),
  meta: {
    noCache: true
  }
},
```

> PS. 为了保证页面能被正确缓存，请确保**组件**的`name`值和对应路由的`name`命名完全相同。



### - <span id="console">调试面板 eruda</span>

![](docs/assets/img/截屏2021-03-08_22.55.14.png)

为了方便移动端查看 log 信息和调试，开发环境引入了 eruda 调试面板的 cdn。如果你的开发环境不需要的话请在 `.env.development` 中修改值，并重启本地服务

```html
# .env.development

# 开发环境启用 eruda 调试台。若不启用，将 true 修改为 false 或其他任意值即可
VUE_APP_ENABLE_ERUDA = true
```



### - <span id="page-title">动态设置页面标题</span>

在路由全局前置守卫中：

```js
// src/router/index.js
// ...
router.beforeEach((to, from, next) => {
  // ...
  // 设置页面 title
  setPageTitle(to.meta.title)
  next()
})
```

具体实现方法见文件 `src/utils/set-page-title.js` 。



### - <span id="mock">开发环境Mock</span>

> 本项目 Mock 是在本地开启 server，如果开发环境不需要 mock 数据，请在 `vue.config.js` 中注释 `before` 字段 ，并重启项目。

```js
// vue.config.js
module.exports = {
  // ...
  devServer: {
    // 删除或注释 before 键值即可
    before: require('./mock/mock-server.js')
  }
}
```



### - <span id="viewport">vw视口适配</span>

使用 `postcss-px-to-viewport` 进行视口适配，相关配置见项目根目录下 `vue.config.js`，如修改内容，需修改后重启项目。

```js
// vue.config.js
module.exports = {
  // ...
  css: {
    loaderOptions: {
      postcss: {
        plugins: [
          autoprefixer(),
          pxtoviewport({
            viewportWidth: 375, // 根据设计稿设定
            minPixelValue: 1, // 最小的转换数值
            unitPrecision: 2 // 转化精度，转换后保留位数
          })
        ]
      }
    }
  },
}
```



### - <span id="CDN">CDN生产环境依赖</span>

本模板生产环境默认 CDN 加载依赖，依赖加载源见根目录 `dependencies-cdn.js` 文件。

**❗ PS.为避免打包后出现不可预估问题，请注意确保生产和开发环境的依赖版本一致！**

> 如需关闭 CDN 依赖，在根目录生产环境变量文件 `.env.production` 中修改 `VUE_APP_CDN_DEPS` 的值为 `false` ，重新打包即可。