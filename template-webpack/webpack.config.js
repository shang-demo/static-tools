const path = require('path');
const HappyPack = require('happypack');
const WebpackCdnPlugin = require('webpack-cdn-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: {
    index: './src/index.js',
  },
  output: {
    filename: '[name]_[hash:8].js', // 给输出的文件名称加上 Hash 值
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
    ],
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
    new HtmlWebpackPlugin({
      template: 'src/template.html',
    }),
    new WebpackCdnPlugin({
      modules: [
        {
          name: 'jquery',
        },
        {
          name: 'bootstrap',
          style: 'dist/css/bootstrap.min.css',
          path: 'dist/js/bootstrap.min.js',
        }
      ],
      prod: false,
      publicPath: '/node_modules', // override when prod is false
    }),
  ],
  watchOptions: {
    // 不监听的文件或文件夹，支持正则匹配
    // 默认为空
    ignored: /node_modules/,
  },
};
