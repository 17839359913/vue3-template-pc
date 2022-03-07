const AntdDayjsWebpackPlugin = require('antd-dayjs-webpack-plugin')
const HardSourceWebpackPlugin = require('hard-source-webpack-plugin')
module.exports = {
  productionSourceMap: true,
  configureWebpack: config => {
    config.plugins = [
      ...config.plugins,
      new AntdDayjsWebpackPlugin({
        preset: 'antdv3'
      })
    ]
  },
  chainWebpack: config => {
    // sentry的接入
    if (process.env.VUE_APP_SENTRY_ENV !== 'development') {
      
    }

    // HardSourceWebpackPlugin 启动加速
    config.plugin('HardSourceWebpackPlugin').use(HardSourceWebpackPlugin)

    // 修复HMR失效的情况
    config.resolve.symlinks(true)

    return config
  },
  css: {
    loaderOptions: {
      less: {
        modifyVars: {
          'primary-color': '#FF6600' // 主题色
        },
        javascriptEnabled: true
      }
    },
    requireModuleExtension: true
  }
}
