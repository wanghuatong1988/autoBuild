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
    entry: { index: './src/index.js' }, //webpack4默认会去查找./src/index.js
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
        runtimeChunk: { //获取页面共同引用的代码
            name: "manifest"
        },
        splitChunks: {
            chunks: 'initial',
            minChunks: 2,
            maxInitialRequests: 5,
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
        new HtmlWebpackPlugin({
            filename: path.join(config.build.htmlShortPath, 'index.html'),
            template: config.build.templatePath,
            inject: true,
            chunks: ['manifest', 'index'], // 引入index.js
            minify: {
                removeComments: true,
                collapseWhitespace: true,
                removeAttributeQuotes: false
            }
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
module.exports = merge(baseWebpackConfig, webpackConfig);