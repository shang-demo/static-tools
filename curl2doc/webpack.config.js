const path = require('path');
const HappyPack = require('happypack');
const { WebPlugin } = require('web-webpack-plugin');

module.exports = {
  entry: {
    index: './src/index.js',
  },
  output: {
    filename: '[name]_[hash:8].js',// 给输出的文件名称加上 Hash 值
    path: path.resolve(__dirname, 'dist'),
    libraryTarget: 'window',
    // library: 'none'
  },
  devtool: 'cheap-module-eval-source-map',
  module: {
    rules: [
      {
        test: /\.js$/,
        include: path.resolve(__dirname, 'src'),
        use: ['happypack/loader?id=babel'],
      },
      {
        test: /\.css$/,
        use: ['happypack/loader?id=css'],
      },
    ]
  },
  plugins: [
    new HappyPack({
      id: 'babel',
      loaders: ['babel-loader?cacheDirectory'],
    }),
    new HappyPack({
      id: 'css',
      loaders: ['style-loader', 'css-loader'],
    }),
    new WebPlugin({
      template: './src/template.html', // HTML 模版文件所在的文件路径
      filename: 'index.html', // 输出的 HTML 的文件名称
      requires: ['index'],
    }),
  ],
  watchOptions: {
    // 不监听的文件或文件夹，支持正则匹配
    // 默认为空
    ignored: /node_modules/,
  },
};