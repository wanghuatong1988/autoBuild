const
    path = require('path'),
    webpack = require('webpack'),
    config = require('./config'),
    merge = require('webpack-merge'),
    utils = require('./utils'),
    baseWebpackConfig = require('./webpack.base.conf'),
    htmlWebpackPlugin = require('html-webpack-plugin'),
    Jarvis = require("webpack-jarvis");

let webpackConfig = merge(baseWebpackConfig, {
    mode: 'development',
    devtool: 'eval-source-map',
    entry: {},
    output: {
        path: config.build.outputPath,
        filename: '[name].js',
    },
    module: {
        rules: []
    },
    resolve: {

    },
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new Jarvis({
            port: 1337
        })
    ],
    devServer: { inline: true },
})

let entryObj = utils.getFileName();
Object.keys(entryObj).forEach((name) => {
    webpackConfig.entry[name] = ['webpack-hot-middleware/client?noInfo=true&reload=true'].concat(entryObj[name]);
    let plugin = new htmlWebpackPlugin({
        filename: name + '.html',
        template: config.build.templatePath,
        inject: true,
        chunks: [name]
    });
    webpackConfig.plugins.push(plugin);
})

module.exports = webpackConfig;