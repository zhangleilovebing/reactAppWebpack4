const path = require('path');
const webpack = require('webpack');
const package = require('../package.json');

module.exports = {
    mode: 'development',
    entry:{
        'vendor':Object.keys(package.dependencies)
    },
    output:{
        filename:'[name].js',
        path:path.resolve(__dirname,'../public'),
        library:'[name]'
    },
    plugins:[
        new webpack.DllPlugin({
            path: path.join(__dirname, '../', '[name]-manifest.json'),
            name: '[name]'
        })
    ]
}