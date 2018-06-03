var chalk = require('chalk');
var fs = require('fs-extra');
var path = require('path');
var webpack = require('webpack');
var config = require('../webpack.prod.config');

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
    
        if (stats.compilation.errors.length) {
          console.log('Failed to compile.', stats.compilation.errors);
          process.exit(1);
        }
    
        if (process.env.CI && stats.compilation.warnings.length) {
         console.log('Failed to compile. When process.env.CI = true, warnings are treated as failures. Most CI servers set this automatically.', stats.compilation.warnings);
         process.exit(1);
       }
    
        console.log(chalk.green('Compiled successfully.'));
        console.log();
    })
}
startBuild();