const chalk = require('chalk');
const isInteractive = process.stdout.isTTY;

function clearConsole() {
    process.stdout.write(process.platform === 'win32' ? '\x1B[2J\x1B[0f' : '\x1B[2J\x1B[3J\x1B[H');
}

function createCompiler(webpack, config) {
    let compiler;
    try {
        compiler = webpack(config);
    } catch (err) {
        console.log(chalk.red('Failed to compile.'));
        console.log();
        console.log(err.message || err);
        console.log();
        process.exit(1);
    }

    ///无效会被编辑
    compiler.plugin('invalid', () => {
        if (isInteractive) {
            clearConsole();
        }
        console.log('Compiling...');
    });

    let isFirstCompile = true;

    //完成之后触发.
    compiler.plugin('done', stats => {
        if (isInteractive) {
            clearConsole();
        }

        //打出警告日志
        const messages = formatWebpackMessages(stats.toJson({}, true));
        const isSuccessful = !messages.errors.length && !messages.warnings.length;
        if (isSuccessful) {
            console.log(chalk.green('Compiled successfully!'));
        }
        isFirstCompile = false;
        if (messages.errors.length) {
            if (messages.errors.length > 1) {
                messages.errors.length = 1;
            }
            console.log(chalk.red('Failed to compile.\n'));
            console.log(messages.errors.join('\n\n'));
            return;
        }

        if (messages.warnings.length) {
            console.log(chalk.yellow('Compiled with warnings.\n'));
            console.log(messages.warnings.join('\n\n'));
            console.log(
                '\nSearch for the ' +
                chalk.underline(chalk.yellow('keywords')) +
                ' to learn more about each warning.'
            );
            console.log(
                'To ignore, add ' +
                chalk.cyan('// eslint-disable-next-line') +
                ' to the line before.\n'
            );
        }
    });
    return compiler;
}

function isLikelyASyntaxError(message) {
    return message.indexOf(friendlySyntaxErrorLabel) !== -1;
}

function formatMessage(message, isError) {
    var lines = message.split('\n');

    if (lines.length > 2 && lines[1] === '') {
        // Remove extra newline.
        lines.splice(1, 1);
    }

    if (lines[0].lastIndexOf('!') !== -1) {
        lines[0] = lines[0].substr(lines[0].lastIndexOf('!') + 1);
    }

    lines = lines.filter(function (line) {
        return line.indexOf(' @ ') !== 0;
    });

    // line #0 is filename
    // line #1 is the main error message
    if (!lines[0] || !lines[1]) {
        return lines.join('\n');
    }

    // Cleans up verbose "module not found" messages for files and packages.
    if (lines[1].indexOf('Module not found: ') === 0) {
        lines = [
            lines[0],
            // Clean up message because "Module not found: " is descriptive enough.
            lines[1]
                .replace("Cannot resolve 'file' or 'directory' ", '')
                .replace('Cannot resolve module ', '')
                .replace('Error: ', '')
                .replace('[CaseSensitivePathsPlugin] ', ''),
        ];
    }

    // Cleans up syntax error messages.
    if (lines[1].indexOf('Module build failed: ') === 0) {
        lines[1] = lines[1].replace(
            'Module build failed: SyntaxError:',
            friendlySyntaxErrorLabel
        );
    }

    // Clean up export errors.
    // TODO: we should really send a PR to Webpack for this.
    var exportError = /\s*(.+?)\s*(")?export '(.+?)' was not found in '(.+?)'/;
    if (lines[1].match(exportError)) {
        lines[1] = lines[1].replace(
            exportError,
            "$1 '$4' does not contain an export named '$3'."
        );
    }

    lines[0] = chalk.inverse(lines[0]);

    message = lines.join('\n');
    message = message.replace(
        /^\s*at\s((?!webpack:).)*:\d+:\d+[\s)]*(\n|$)/gm,
        ''
    );

    return message.trim();
}

function formatWebpackMessages(json) {
    var formattedErrors = json.errors.map(function (message) {
        return formatMessage(message, true);
    });
    var formattedWarnings = json.warnings.map(function (message) {
        return formatMessage(message, false);
    });
    var result = {
        errors: formattedErrors,
        warnings: formattedWarnings,
    };
    if (result.errors.some(isLikelyASyntaxError)) {
        result.errors = result.errors.filter(isLikelyASyntaxError);
    }
    return result;
}

module.exports = {
    clearConsole,
    createCompiler
}