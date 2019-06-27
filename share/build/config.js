const path = require('path'),
    config = {
        //开发环境配置
        dev: {
            port: 8080,
            // 接口代理
            proxyTable: {
                '/v2': {
                    target: 'https://api.douban.com',
                    changeOrigin: true
                },
            },
        },
        //生产环境配置
        build: {
            packName: 'myProjcet', //项目打包后名称
            outputPath: '', //打包后项目输出路径
            templatePath: 'template.html', //html模版路径,基于根路径下
            htmlShortPath: '/', //html文件输出路径, 基于outputPath
            resourcesPath: '', //最终打包路径
            resourcesShortPath: 'resources', //资源目录 {packName}/resources
        },
        switchVal: {
            to_rem: false, //是否开启px转rem
            to_eslint: false, //是否开启eslint语法检测
        },
    };

//输出的目录
config.build.outputPath = path.resolve(__dirname, '../../dist/', config.build.packName);
//最终输出目录项目存放路径
config.build.resourcesPath = path.join(config.build.outputPath, config.build.resourcesShortPath);

module.exports = config;