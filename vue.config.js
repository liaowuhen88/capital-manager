const CompressionWebpackPlugin = require('compression-webpack-plugin');

process.env.VUE_APP_NAME = require('./package.json').name.toLocaleUpperCase();
process.env.VUE_APP_VERSION = require('./package.json').version;

// cdn预加载使用
const externals = {
  vue: 'Vue',
  'vue-router': 'VueRouter',
  vuex: 'Vuex',
  axios: 'axios',
  dayjs: 'dayjs',
  lodash: '_',
  vant: 'vant',
};

const cdn = {
  // 开发环境
  dev: {
    css: [],
    js: [],
  },
  // 生产环境
  build: {
    css: [],
    js: [
      'https://cdn.jsdelivr.net/npm/vue@2.5.17/dist/vue.min.js',
      'https://cdn.jsdelivr.net/npm/vue-router@3.0.1/dist/vue-router.min.js',
      'https://cdn.jsdelivr.net/npm/vuex@3.0.1/dist/vuex.min.js',
      'https://cdn.jsdelivr.net/npm/axios@0.18.0/dist/axios.min.js',
    ],
  },
};

// 是否使用gzip
const productionGzip = true;
// 需要gzip压缩的文件后缀
const productionGzipExtensions = ['js', 'css'];

module.exports = {
  publicPath: process.env.BASE_URL,
  chainWebpack: config => {
    /**
     * 添加CDN参数到htmlWebpackPlugin配置中， 详见public/index.html 修改
     */
    config.plugin('html').tap(args => {
      if (process.env.NODE_ENV === 'production') {
        args[0].cdn = cdn.build;
      }
      if (process.env.NODE_ENV === 'development') {
        args[0].cdn = cdn.dev;
      }
      return args;
    });
  },
  configureWebpack: () => {
    const myConfig = {};
    if (process.env.NODE_ENV === 'production') {
      // 1. 生产环境npm包转CDN
      myConfig.externals = externals;

      myConfig.plugins = [];
      // 2. 构建时开启gzip，降低服务器压缩对CPU资源的占用，服务器也要相应开启gzip
      productionGzip &&
        myConfig.plugins.push(
          new CompressionWebpackPlugin({
            test: new RegExp('\\.(' + productionGzipExtensions.join('|') + ')$'),
            threshold: 8192,
            minRatio: 0.8,
          })
        );
    }
    if (process.env.NODE_ENV === 'development') {
      /**
       * 关闭host check，方便使用ngrok之类的内网转发工具
       */
      myConfig.devServer = {
        disableHostCheck: true,
      };
    }
    return myConfig;
  },
  productionSourceMap: false,
};
