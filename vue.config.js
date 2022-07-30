module.exports = {
  lintOnSave: false,
  runtimeCompiler: true,
  publicPath: "./",
  assetsDir: 'public',
  transpileDependencies: true,
  chainWebpack: config => {
    config
      .plugin('html')
      .tap(args => {
        args[0].title = 'Yao Online Judge'
        return args
      })
    config.module
      .rule('yaml')
      .test(/\.ya?ml?$/)
      .use('yaml-loader')
      .loader('yaml-loader')
  },
}