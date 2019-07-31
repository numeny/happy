module.exports = {
  env: {
    NODE_ENV: '"production"'
  },
  defineConstants: {
    LOCATION_APIKEY: JSON.stringify('2GPBZ-LD5KF-Z6GJ4-N7G5P-2SVXQ-VFBQL'),
  },
  weapp: {},
  h5: {
    /**
     * 如果h5端编译后体积过大，可以使用webpack-bundle-analyzer插件对打包体积进行分析。
     * 参考代码如下：
     * webpackChain (chain) {
     *   chain.plugin('analyzer')
     *     .use(require('webpack-bundle-analyzer').BundleAnalyzerPlugin, [])
     * }
     */
  }
}
