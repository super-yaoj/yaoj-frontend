const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin')

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
    configureWebpack: {
      plugins: [
        new MonacoWebpackPlugin()
      ],
      optimization: {
        splitChunks: false
      },
    }
  }