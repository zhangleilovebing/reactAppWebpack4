const fs = require('fs-extra');
const path = require('path');
const webpack = require('webpack');
const config = require('../config/webpack.prod.config');

function startBuild(){
    fs.emptyDirSync(path.resolve('build'));
    console.log('Creating an optimized production build...');
    build();
}

function build(){
    webpack(config).run((err, stats) => {
        if (err) {
          console.log('Failed to compile.', [err]);
          process.exit(1);
        }
    })
}

startBuild();