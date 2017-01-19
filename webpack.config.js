const ExtractTextPlugin = require('extract-text-webpack-plugin');
const path = require('path');
const autoprefixer = require('autoprefixer');

var config = {
  entry: './src/index.jsx',
  output: {
    path: './dist',
    filename: 'app.js'
  },
  resolve: {
    extensions: ['', '.scss', '.js', '.json'],
    modulesDirectories: [
      'node_modules',
      path.resolve(__dirname, './node_modules')
    ]
  },
  module: {
    loaders: [
      {
        test: /\.(js|jsx)$/,
        loaders: ['babel'],
        exclude: /(node_modules)/
      },
      {
        test: /(\.scss|\.css)$/,
        loader: ExtractTextPlugin.extract('style', 'css?modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]!postcss!sass')
      }
    ]
  },
  devServer: {
    contentBase: './dist'
  },
  postcss: [autoprefixer],
  plugins: [
    new ExtractTextPlugin('app.css', { allChunks: true }),
  ]
}
module.exports = config;
