/* eslint-disable import/no-extraneous-dependencies */
const path = require('path');
const DefinePlugin = require('webpack/lib/DefinePlugin');
const ModuleConcatenationPlugin = require('webpack/lib/optimize/ModuleConcatenationPlugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HappyPack = require('happypack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const WebpackCdnPlugin = require('webpack-cdn-plugin');
const ProvidePlugin = require('webpack/lib/ProvidePlugin');
const webpackConstant = require('./constant');

const localPreview = process.env.NODE_ENV === 'local';

const config = {
  entry: {
    index: './src/index.js',
  },
  output: {
    filename: '[name]_[chunkhash:8].js', // 给输出的文件名称加上 Hash 值
    path: path.resolve(__dirname, '../dist'),
    publicPath: localPreview ? webpackConstant.publicPath.dev : webpackConstant.publicPath.prod,
    libraryTarget: 'window',
    // library: 'none'
  },
  resolve: {
    // 针对 Npm 中的第三方模块优先采用 jsnext:main 中指向的 ES6 模块化语法的文件
    mainFields: ['jsnext:main', 'browser', 'main'],
  },
  devtool: localPreview ? 'cheap-module-eval-source-map' : 'cheap-module-source-map',
  module: {
    rules: [
      {
        test: /\.js$/,
        include: path.resolve(__dirname, 'src'),
        loader: 'eslint-loader',
        enforce: 'pre',
      },
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        use: ['happypack/loader?id=babel'],
        include: path.resolve(__dirname, 'src'),
      },
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader'],
      },
    ],
  },
  plugins: [
    new ProvidePlugin(webpackConstant.provider),
    new DefinePlugin({
      // 定义 NODE_ENV 环境变量为 production 去除 react 代码中的开发时才需要的部分
      'process.env': {
        NODE_ENV: JSON.stringify('production'),
      },
    }),
    // 开启ScopeHoisting
    new ModuleConcatenationPlugin(),
    new HappyPack({
      // 用唯一的标识符 id 来代表当前的 HappyPack 是用来处理一类特定的文件
      id: 'babel',
      // babel-loader 支持缓存转换出的结果，通过 cacheDirectory 选项开启
      loaders: ['babel-loader?cacheDirectory'],
    }),
    new HappyPack({
      id: 'css',
      // 通过 minimize 选项压缩 CSS 代码
      loaders: ['css-loader?minimize'],
    }),
    new MiniCssExtractPlugin({
      // Options similar to the same options in webpackOptions.output
      // both options are optional
      filename: '[name].css',
      chunkFilename: '[id].css',
    }),
    new HtmlWebpackPlugin({
      template: 'src/index.html',
      title: webpackConstant.title.prod,
    }),
    new WebpackCdnPlugin(webpackConstant.cdn.prod),
  ],
};

module.exports = config;
