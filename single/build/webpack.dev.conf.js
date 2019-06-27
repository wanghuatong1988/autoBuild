const
    webpack = require("webpack"),
    config = require("./config"),
    merge = require("webpack-merge"),
    baseWebpackConfig = require("./webpack.base.conf"),
    Jarvis = require("webpack-jarvis");

const webpackConfig = merge(baseWebpackConfig, {
    mode: "development",
    entry: ["webpack-hot-middleware/client?noInfo=true&reload=true"].concat("./src/index.js"),
    devtool: "eval-source-map",
    output: {
        path: config.build.outputPath,
        filename: "index.js",
    },
    module: {
        rules: []
    },
    resolve: {},
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new Jarvis({
            port: 1337
        })
    ],
    devServer: { inline: true },
});

module.exports = webpackConfig;