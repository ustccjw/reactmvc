import path from 'path'
import webpack from 'webpack'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import postCssnext from 'postcss-cssnext'

const env = process.env.NODE_ENV

const config = {
  entry: [
    'webpack-hot-middleware/client',
    'babel-polyfill',
    './index.jsx',
  ],
  output: {
    path: path.join(__dirname, '../dist'),
    filename: 'index.js',
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
    }],
  },
  externals: {},
  postcss: [postCssnext],
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.optimize.OccurenceOrderPlugin(),
    new HtmlWebpackPlugin({
      title: 'reactmvc example',
      filename: 'index.html',
    }),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(env),
    }),
  ],
  devtool: 'inline-source-map',
  resolveLoader: {
    root: path.join(__dirname, 'node_modules'),
  },
}

export default config
