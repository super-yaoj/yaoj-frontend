
/**
 * @type {import('@vue/cli-service').ProjectOptions}
 */
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
    config.module.rule('vue').use('vue-loader').tap(options => ({
      ...options,
      compilerOptions: {
        isCustomElement: tag => tag.startsWith('ion-')
      },
    }))
  },
}