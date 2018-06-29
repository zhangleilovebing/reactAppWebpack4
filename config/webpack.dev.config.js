
const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin')
const autoprefixer = require('autoprefixer');
const manifest = require('../vendor-manifest.json');
const HappyPack = require('happypack');
const os = require('os');
//线程
const happyThreadPool = HappyPack.ThreadPool({ size: os.cpus().length });

module.exports = {
  devtool: 'source-map',
  mode: 'development',
  entry: [
    path.resolve(__dirname, '../src/index.js'),
    require.resolve('webpack-dev-server/client') + '?/',
    require.resolve('webpack/hot/dev-server'),
  ],
  output: {
    path: path.resolve(__dirname, '../build'),
    filename: '[name].[hash].js',
    publicPath: '/'
  },
  resolve: {
    modules: ['node_modules'],
    extensions: ['.web.js', '.js', '.json', '.web.jsx', '.jsx'],
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
  devServer: {
    contentBase: path.resolve(__dirname, '../public'),
    historyApiFallback: true,
    hot: true,
    compress: true,
    host: 'localhost',
    port: 8080
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
    new HtmlWebpackPlugin({
      template: './public/index.html',
      inject: true,
    }),
    new webpack.DllReferencePlugin({
      //context:path.resolve(__dirname,'../public'),
      manifest
    }),
    new webpack.ProvidePlugin({
      $: 'jquery'
    }),
    new HappyPack({
      id: 'jsHappy',
      cache: true,
      threadPool: happyThreadPool,
      loaders: [{
        loader: 'babel-loader?cacheDirectory',
        options: {
          plugins: ["transform-decorators-legacy", ['import', [{ libraryName: "antd", style: true }]], ['syntax-dynamic-import']],
          presets: ['es2015', 'stage-0', 'react']
        }
      }]
    }),
    //如果有单独提取css文件的话
    // new HappyPack({
    //   id: 'lessHappy',
    //   loaders: ['style', 'css', 'less']
    // })
  ]
};
