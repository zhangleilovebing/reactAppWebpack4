
const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

module.exports = {
  entry: [
    path.resolve(__dirname, '../src/index.js')
  ],
  output: {
    path: path.resolve(__dirname, '../public'),
    filename: 'js/[name].[hash].js',
    chunkFilename: 'js/[name].[chunkhash:8].chunk.js',
    publicPath: './'
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        include: path.resolve(__dirname, '../src'),
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader?cacheDirectory',
          options: {
            plugins: ["transform-decorators-legacy", ['import', [{ libraryName: "antd", style: true }]], ['syntax-dynamic-import']],
            presets: ['es2015', 'stage-0', 'react']
          }
        }
      },
      {
        test: /\.less|.css$/,
        loaders: ['style-loader', 'css-loader', 'less-loader']
      }
    ]
  },
  plugins: [
    //模板
    new HtmlWebpackPlugin({
      template: '../public/index.html',
      inject: true,
      minify: {
        minify: {
          removeComments: true,
          collapseWhitespace: true,
          removeRedundantAttributes: true,
          useShortDoctype: true,
          removeEmptyAttributes: true,
          removeStyleLinkTypeAttributes: true,
          keepClosingSlash: true,
          minifyJS: true,
          minifyCSS: true,
          minifyURLs: true,
        },
      }
    })
  ],
  //压缩js
  optimization: {
    minimizer: [
      new UglifyJsPlugin({
        uglifyOptions: {
          compress: false
        },
        parallel: true
      })
    ]
  }
};
