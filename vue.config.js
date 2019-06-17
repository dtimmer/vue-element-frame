module.exports = {
  // 修改的配置
  // 将baseUrl: '/api',改为baseUrl: '/',
  publicPath: "/",
  outputDir: "docs",
  productionSourceMap: false,
  css: {
    // 是否使用css分离插件 ExtractTextPlugin
    extract: true,
    // 开启 CSS source maps?
    sourceMap: false,
    // css预设器配置项
    loaderOptions: {},
    // 启用 CSS modules for all css / pre-processor files.
    modules: false
  },
  // 压缩图片
  chainWebpack: config => {
    config.module
      .rule("images")
      .use("image-webpack-loader")
      .loader("image-webpack-loader")
      .options({
        bypassOnDebug: true
      })
      .end();
  }
  // devServer: {
  //   proxy: {
  //     "/api/v2": {
  //       // target: "http://smartpig-dev1.newhopecd.com",// 开发一
  //       // target:"http://smartpig-dev2.newhopecd.com",// 开发二
  //       // target:"http://web.dev4.smartpig.bajietong.net",// 开发四
  //       // target:"http://smartpig-test1.newhopecd.com",// 测试一
  //       // target:"http://smartpig-test2.newhopecd.com",// 测试二
  //       // target: "http://web.test4.smartpig.bajietong.net",  // 测试四
  //       // target: "http://uatsmart.pigkeeping.cn", // uat
  //       target: "localhost:8080/@/testData", // 本地测试数据
  //       changeOrigin: true,
  //       pathRewrite: {
  //         "^/api/v2": "/"
  //       }
  //     }
  //   }
  // }
};
