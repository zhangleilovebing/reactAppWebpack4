
const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin')
const autoprefixer = require('autoprefixer');

module.exports = {
  devtool: 'cheap-module-source-map',
  mode: 'development',
  entry: [
    './src/index.js',
    require.resolve('webpack-dev-server/client') + '?/',
    require.resolve('webpack/hot/dev-server'),
  ],
  output: {
    path: path.resolve(__dirname, 'build'),
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
        test: /\.css$/,
        use: [
          require.resolve('style-loader'),
          {
            loader: require.resolve('css-loader'),
            options: {
              importLoaders: 1,
            },
          },
          {
            loader: require.resolve('postcss-loader'),
            options: {
              ident: 'postcss',
              plugins: () => [
                require('postcss-flexbugs-fixes'),
                autoprefixer({
                  browsers: [
                    '>1%',
                    'last 4 versions',
                    'Firefox ESR',
                    'not ie < 9',
                  ],
                  flexbox: 'no-2009',
                }),
              ],
            },
          },
        ],
      },
      {
        test: /\.less$/,
        use: [
          require.resolve('style-loader'),
          require.resolve('css-loader'),
          {
            loader: require.resolve('postcss-loader'),
            options: {
              ident: 'postcss',
              plugins: () => [
                require('postcss-flexbugs-fixes'),
                autoprefixer({
                  browsers: [
                    '>1%',
                    'last 4 versions',
                    'Firefox ESR',
                    'not ie < 9',
                  ],
                  flexbox: 'no-2009',
                }),
              ],
            },
          },
          {
            loader: require.resolve('less-loader'),
            options: {

            },
          },
        ],
      }
    ]
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
    new HtmlWebpackPlugin({
      template: './dist/index.html',
      inject: true,
    })
  ]
};
