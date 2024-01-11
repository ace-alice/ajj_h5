'use strict';
const autoprefixer = require('autoprefixer');
const pxtoviewport = require('postcss-px-to-viewport');
const cdnDependencies = require('./dependencies-cdn');
const CompressionWebpackPlugin = require('compression-webpack-plugin');

/**
 * @description 按需开启gzip压缩，压缩选取的文件类型
 */
const productinGzipExtensions = /\.(js|css|json|txt|html|ico|svg)(\?.*)?$/i;

const path = require('path');
function resolve(dir) {
  return path.join(__dirname, dir);
}

const defaultSettings = require('./src/settings.js');
const name = defaultSettings.title;

// 设置不参与构建的库
const externals = {};
cdnDependencies.forEach(pkg => {
  externals[pkg.name] = pkg.library;
});

// 引入文件的 cdn 链接
const cdn = {
  css: cdnDependencies.map(e => e.css).filter(e => e),
  js: cdnDependencies.map(e => e.js).filter(e => e)
};

module.exports = {
  lintOnSave: false,
  publicPath: './',
  outputDir: 'c_master_static_H5',
  productionSourceMap: false, // 去除生产环境.map文件
  configureWebpack: config => {
    const configNew = {
      name: name, // 设置 html 标题名
      resolve: {
        // 设置 alias
        alias: {
          '@': resolve('src')
        }
      }
    };
    if (process.env.NODE_ENV === 'production') {
      configNew.plugins = [
        // gzip
        new CompressionWebpackPlugin({
          filename: '[path].gz[query]',
          test: productinGzipExtensions,
          threshold: 10240,
          minRatio: 0.8,
          deleteOriginalAssets: false
        })
      ];
    }
    return configNew;
  },
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
  chainWebpack: config => {
    config.plugins.delete('prefetch');
    // CDN
    if (process.env.NODE_ENV === 'production' && process.env.VUE_APP_CDN_DEPS !== 'false') {
      config.externals(externals);
      // 添加 CDN 参数到 htmlWebpackPlugin 配置中
      const targetHtmlPluginNames = ['html'];
      targetHtmlPluginNames.forEach(name => {
        config.plugin(name).tap(options => {
          options[0].cdn = process.env.NODE_ENV === 'production' ? cdn : [];
          return options;
        });
      });
    }

    // 设置 svg-sprite-loader
    config.module
      .rule('svg')
      .exclude.add(resolve('src/icons'))
      .end();
    config.module
      .rule('icons')
      .test(/\.svg$/)
      .include.add(resolve('src/icons'))
      .end()
      .use('svg-sprite-loader')
      .loader('svg-sprite-loader')
      .options({
        symbolId: 'icon-[name]'
      })
      .end();

    // config.module
    //   .rule('fonts')
    //   .test(/\.(woffs?|eot|ttf|otf)(\?.*)?$/i)
    //   .use('url-loader')
    //   .options({
    //     limit: 20480,
    //     fallback: {
    //       loader: 'file-loader',
    //       options: {
    //         name: `@/assets/fonts/[name].[ext]`
    //       }
    //     }
    //   });
  },
  // devServer: {
  //   before: require('./mock/mock-server.js')
  // }
  devServer: {
    proxy: {
      '/api': {
        target: process.env.VUE_APP_BASE_API,
        // target: 'http://192.168.1.205:8123',
        // target: 'http://3.39.164.221',
        // target: 'http://admin.aijj.vip',
        pathRewrite: {
          '^/api': '/'
        },
        secure: false,
        changeOrigin: true
      }
    }
  }
};
