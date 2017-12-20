const path = require('path');
const webpack = require('webpack');
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
        loaders: [
            {test: /\.ts$/, loader: 'ts-loader'}
        ],
    },
    target: 'node', // in order to ignore built-in modules like path, fs, etc.
    plugins: [
        new WrapperPlugin({
            header: 'global = this;\n',
            footer: ''
        }),
        new webpack.DefinePlugin({
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
