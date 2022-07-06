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
    },
  }