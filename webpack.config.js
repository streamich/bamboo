var webpack = require('webpack');
var nodeExternals = require('webpack-node-externals');
var WrapperPlugin = require('wrapper-webpack-plugin');


var globals_plugin = new webpack.DefinePlugin({
    __DEBUG__: JSON.stringify(JSON.parse(process.env.BUILD_DEBUG || true)),
    __BUILD_ASYNC_SYSCALL__: JSON.stringify(JSON.parse(process.env.BUILD_DEBUG || true)),
});


module.exports = {
    entry: {
        app: './index'
    },
    output: {
        path: './dist',
        filename: 'full.js'
    },
    resolve: {
        extensions: ['.js']
    },
    target: 'node',                 // in order to ignore built-in modules like path, fs, etc.
    // externals: [nodeExternals()]    // in order to ignore all modules in node_modules folder

    plugins: [
        new WrapperPlugin({
            header: 'var global = this;\n',
            footer: ''
        }),
        globals_plugin
    ]
};
