const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const postcssNested = require('postcss-nested')
const postcssCssnext = require('postcss-cssnext')

module.exports = {
  entry: [
    'webpack-hot-middleware/client',
    'babel-polyfill',
    './index.jsx',
  ],
  output: {
    path: path.join(__dirname, '../dev'),
    filename: 'bundle.js',
    publicPath: '/',
  },
  resolve: {
    extensions: ['', '.jsx', '.js'],
  },
  module: {
    loaders: [{
      test: /(\.js|\.jsx)$/,
      exclude: /(node_modules)/,
      loader: 'babel',
    }, {
      test: /\.css$/,
      loader: 'style?sourceMap!css?sourceMap!postcss?sourceMap',
    }, {
      test: /\.(png|jpg|jpeg)$/,
      loader: 'url?limit=3072',
    }],
  },
  externals: {},
  postcss: [postcssNested, postcssCssnext],
  plugins: [
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new HtmlWebpackPlugin({
      title: 'reactmvc example',
      filename: 'index.html',
    }),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('development'),
    }),
  ],
  devtool: 'inline-source-map',
  resolveLoader: {
    root: path.join(__dirname, 'node_modules'),
  },
}
