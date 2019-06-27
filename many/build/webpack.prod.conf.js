const path = require('path'),
    webpack = require('webpack'),
    utils = require('./utils'),
    config = require('./config'),
    merge = require('webpack-merge'),
    baseWebpackConfig = require('./webpack.base.conf'),
    HtmlWebpackPlugin = require('html-webpack-plugin'),
    WebpackBar = require('webpackbar'),
    OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin'),
    AddAssetHtmlPlugin = require('add-asset-html-webpack-plugin');

const webpackConfig = {
    entry: {},
    output: {
        path: config.build.outputPath,
        publicPath: '/',
        filename: utils.assetsPath('js/[name].[chunkhash:8].js'),
        chunkFilename: utils.assetsPath('js/[name].[chunkhash:8].js')
    },
    mode: 'production',
    devtool: 'false',
    module: { rules: [] },
    optimization: {
        runtimeChunk: { //获取页面共同引用的代码 这里下面的html引用需要升级到html-webpack-plugin@4.0.0-alpha.2
            name: "manifest"
        },
        splitChunks: {
            chunks: 'initial',
            minChunks: 2,
            maxInitialRequests: 5, // The default limit is too small to showcase the effect
            minSize: 30000, //
            maxInitialRequests: 3,
            automaticNameDelimiter: '~',
            cacheGroups: {
                vendors: {
                    name: 'vendors',
                    test: /[\\/]node_modules[\\/]/,
                    priority: -10,
                    enforce: true,
                },
                default: {
                    test: /[\\/]src[\\/]/,
                    priority: -20,
                    reuseExistingChunk: true
                }
            }
        }
    },
    plugins: [
        new WebpackBar({
            minimal: false,
        }),
        //css压缩
        new OptimizeCssAssetsPlugin({
            assetNameRegExp: /\.css$/g,
            cssProcessor: require('cssnano'),
            cssProcessorOptions: { safe: true, discardComments: { removeAll: true } },
            canPrint: true
        }),
    ]
};

let entryObj = utils.getFileName();

Object.keys(entryObj).forEach((name) => {
    webpackConfig.entry[name] = entryObj[name];
    let plugin = new HtmlWebpackPlugin({
        chunks: ['manifest', name],
        filename: name + '.html',
        template: config.build.templatePath,
        inject: true,
        environment: 'resources',
        minify: {
            removeComments: true,
            collapseWhitespace: true,
            removeAttributeQuotes: false
        }
    });
    webpackConfig.plugins.push(plugin);
})

module.exports = merge(baseWebpackConfig, webpackConfig);