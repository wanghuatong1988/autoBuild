require("shelljs/global");
const path = require("path"),
    fs = require("fs"),
    ora = require("ora"),
    webpack = require("webpack"),
    utils = require("./utils"),
    config = require("./config"),
    webpackConfig = require("./webpack.prod.conf");

const spinner = ora("开始构建生产环境.....");
spinner.start();

//清空输出目录
rm("-rf", config.build.outputPath);

//复制static到输出目录
utils.copyDir("./static/*", config.build.resourcesPath);
webpack(webpackConfig).run((err, stats) => {
    spinner.stop();
    if (err) throw err;

    // 输出编译结果
    process.stdout.write(stats.toString({
        colors: true,
        modules: false,
        children: false,
        chunks: false,
        chunkModules: false,
        timings: false
    }) + "\n\n");
});