const path = require('path');
const {DefinePlugin} = require('webpack');
const WrapperPlugin = require('wrapper-webpack-plugin');

module.exports = {
    entry: {
        bamboo: './src/index'
    },
    output: {
        path: path.join(__dirname, 'dist'),
        filename: '[name].js'
    },
    resolve: {
        extensions: ['.ts', '.js']
    },
    module: {
        rules: [
            {test: /\.ts$/, loader: 'ts-loader'},
            /*
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['babel-preset-es2015']
                    }
                }
            }
            */
        ],
    },
    target: 'node', // in order to ignore built-in modules like path, fs, etc.
    plugins: [
        new WrapperPlugin({
            header: 'global = this;\n',
            footer: ''
        }),
        new DefinePlugin({
            // DEBUG mode
            __DEBUG__: JSON.stringify(JSON.parse(process.env.BAMBOO_DEBUG || false)),
        
            // Whether to trace syscalls.
            __STRACE__: JSON.stringify(JSON.parse(process.env.BAMBOO_STRACE || false)),
        
            // `console.log()` will not print to terminal if `true`.
            __STRACE_BLOCK_STDOUT__: JSON.stringify(JSON.parse(process.env.BAMBOO_NO_STDOUT || false)),
        
            // Whether to create a thread pool to make async syscall function `process.asyscall`,
            // if it is ont provided by JavaScript runtime.
            __BUILD_ASYNC_SYSCALL__: JSON.stringify(JSON.parse(process.env.BAMBOO_ASYSCALL || true)),
        }),
    ]
};
