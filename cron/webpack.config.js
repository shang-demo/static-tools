module.exports = {
  entry: './framework/packages.js',
  output: {
    filename: 'bundle.js',
    path: './lib',
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'babel-loader',
        query: {
          presets: ['es2015']
        }
      }
    ]
  },
};