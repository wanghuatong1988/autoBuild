const path = require('path'),
    baseConfig = require('./config'),
    utils = require('./utils'),
    MiniCssExtractPlugin = require('mini-css-extract-plugin'),
    VueLoaderPlugin = require('vue-loader/lib/plugin'),
    HappyPack = require('happypack'),
    os = require('os'),
    happyThreadPool = HappyPack.ThreadPool({ size: os.cpus().length }),
    //利用多线程解决js loader编译过程耗时 除scss无法使用 css、vue都可使用 (webpack4本来就是多线程)
    createHappyPlugin = (id, loaders) => new HappyPack({
        id: id,
        loaders: loaders,
        threadPool: happyThreadPool,
        verbose: true, //允许 HappyPack 输出日志
    });

let config = {
        module: {
            noParse: /jquery|lodash/, // 忽略未采用模块化的文件，因此jquery或lodash将不会被下面的loaders解析
            rules: [
                { test: /\.vue$/, loader: 'vue-loader', },
                { test: /\.css$/, use: ['style-loader', 'css-loader'] },
                { test: /\.less$/, use: ['style-loader', 'css-loader', 'less-loader'] },
                { test: /\.scss$/, use: ['style-loader', 'css-loader', 'sass-loader'] },
                {
                    test: /\.js$/,
                    loader: !process.env.NODE_ENV ? 'happypack/loader?id=happy-babel' : 'babel-loader',
                    //loader: 'babel-loader',
                    exclude: /(node_modules|lib)/,
                    include: [ // 表示只解析以下目录，减少loader处理范围
                        path.resolve(__dirname, '../src'),
                    ],
                },
                {
                    test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
                    use: [{
                        loader: 'file-loader',
                        options: {
                            //生产环境真实路径
                            name: utils.assetsPath('fonts/[name].[hash:7].[ext]')
                        }
                    }]
                },
                {
                    test: /\.(png|jpe?g|gif|svg|webp)(\?.*)?$/,
                    use: {
                        loader: 'url-loader',
                        options: {
                            limit: 10000,
                            //生产环境真实路径
                            name: utils.assetsPath('image/[name].[hash:7].[ext]')
                        }
                    }
                },
            ]
        },
        plugins: [
            new VueLoaderPlugin(), //Vue-loader在15.*之后的版本都要加上
            createHappyPlugin('happy-babel', [{
                loader: 'babel-loader',
                options: {
                    babelrc: true,
                    cacheDirectory: true // 启用缓存
                }
            }]),
        ],
        resolve: {
            modules: [ // 指定以下目录寻找第三方模块，避免webpack往父级目录递归搜索
                path.resolve(__dirname, '../src'),
                path.resolve(__dirname, '../node_modules')
            ],
            //别名
            alias: {
                '@lib': path.resolve(__dirname, '../static/lib'),
                ...utils.getFiles(), //新增目录要重启dev 
            },
            //mainFields: ['index'], // 只采用index字段作为入口文件描述字段，减少搜索步骤
            // 省略后缀
            extensions: ['.js', '.json', '.vue', '.less', '.css', '.sass'],
        },
    }
    //生产环境才开启
if (!process.env.NODE_ENV) {
    for (let i = 1; i < 3; i++) {
        //使用mini-css-extract-plugin在生产环境要把style-loader覆盖，它们会有冲突
        config.module.rules[i].use[0] = {
            loader: MiniCssExtractPlugin.loader,
        };
        //自动添加样式补全放
        config.module.rules[i].use.splice(2, 0, 'postcss-loader');
    }

    //css样式合并
    config.plugins.push(
        new MiniCssExtractPlugin({
            filename: utils.assetsPath('css/[name].[chunkhash:8].css'),
        })
    )
}

//是否将px转换成rem
if (baseConfig.switchVal.to_rem) {
    for (let i = 0; i < 3; i++) {
        config.module.rules[i].use.push({
            loader: 'webpack-px2rem-loader',
            // 这个配置是可选的
            query: {
                // 1rem=npx 默认为 10
                basePx: 32, // 宽750
                // 只会转换大于min的px 默认为0
                // 因为很小的px（比如border的1px）转换为rem后在很小的设备上结果会小于1px，有的设备就会不显示
                min: 1,
                // 转换后的rem值保留的小数点后位数 默认为3
                floatWidth: 3
            }
        });
    }
}

//是否开启eslint
if (process.env.NODE_ENV && baseConfig.switchVal.to_eslint) {
    config.module.rules.push({ //本json是对js的eslint的检查
        test: /\.(js|vue)$/, //检查js文件和vue文件内的javascript代码的规范
        enforce: "pre", //在babel-loader对源码进行编译前进行lint的检查
        exclude: path.join(__dirname, 'node_module'),
        use: [{
            loader: "eslint-loader",
            options: {
                formatter: require('eslint-friendly-formatter') // 编译后错误报告格式
            }
        }]
    })
}

module.exports = config