
const webpack = require('webpack');
const path = require('path');
const chalk = require('chalk');
const reactDevUtils = require('./react-dev-utils');
const config = require('../config/webpack.dev.config');
const compiler = reactDevUtils.createCompiler(webpack, config);
const WebpackDevServer = require('webpack-dev-server');
const isInteractive = process.stdout.isTTY;
const httpProxyMiddleware = require('http-proxy-middleware');
const devServer = new WebpackDevServer(compiler, {
    contentBase: path.resolve(__dirname, 'public'),
    hot: true,
    open: true,
    quiet: true,
    watchContentBase: true,
    compress: true,
    clientLogLevel: "none",
    proxy:{
        '/':{
            target:require(path.resolve(__dirname,'../package.json')).proxy,
            secure:false,
            changeOrigin:true,
            pathRewrite:{'^/api':''}
        }
    }
})

devServer.listen('8080', '0.0.0.0', err => {
    if (err) {
        return console.log(err);
    }
    if (isInteractive) {
        reactDevUtils.clearConsole();
    }
    console.log(chalk.cyan('Starting the development server...'))
})