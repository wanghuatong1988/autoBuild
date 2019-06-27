### 批处理
前端现在在做项目的时候大多数遇到的都是单页面应用，但有时需要做多页面的时候，会把单页拿过来修改成多页面，如果代码多了，对单页或多页的配置可能会混乱，那么有没有更好的方式能把单页面和多页面不同的配置代码分开，能更清楚的分辩他们的区别，这里是利用`批处理`对前端构建进行部署 目录分为三块
```
single //单页代码 
share // 共用代码 
many //多页代码
```
只需要用到`批处理`对其中两者进行合并就能生成想要的单页或多页应用，提示需要安装国内的[npm淘宝镜像](http://npm.taobao.org/)  
如果未安装的需要自行修改build.bat里的命令行`call cnpm install`为`call npm install`
如下所示：  
![Markdown](https://github.com/wanghuatong1988/autoBuild/raw/master/1.png)  
先选择存放路径，输入项目名，选择要生成的是单页还是多页  
![Markdown](https://github.com/wanghuatong1988/autoBuild/raw/master/2.png)  
这里以单页为示例，其实就是简单的对文件进行复制，复制完成后会自动安装依赖  
![Markdown](https://github.com/wanghuatong1988/autoBuild/raw/master/3.png)  
安装完依赖后还会自动运行项目 如上开启的项目端口为8080
目录如下  
![Markdown](https://github.com/wanghuatong1988/autoBuild/raw/master/4.png)  

### webpack4 共同配置(share)
这里用到了最新的webpack4.0，它简化了很多配置，多线程输出，更快的构建能力，大大提高了开发的效率
首先看下配置文件`config.js`
```
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
```
这里有开发环境下的接口代理，  
生产环境的目录名称和路径  
还有可选的是否转换页面字体为`rem`和`eslint`语法检测  
`eslint`校验是默认的规则校验  
它还有其它的[三种](https://blog.csdn.net/txl910514/article/details/76178988)通用规则  
可根据自身喜好去设置  

然后是`utils.js`工具方法
```
module.exports = {
    /***
     * 获取src一级目录
     */
    getFiles() {
        const files = glob.sync('src/**/'),
            arr = [];

        files.forEach((filepath) => {
            let name = filepath.split('/')[1];
            if (name) {
                arr.push(...[name]);
            }
        })

        let obj = {};
        if (arr.length) {
            [...new Set(arr)].map(item => {
                obj[`@${item}`] = path.join(__dirname, `../src/${item}`);
            })
        }

        return obj
    },
    /**
     *  多页面命名 获取每个多页对应的js名命名
     * **/
    getFileName() {
        let fileName = glob.sync('src/**/index.js');
        entryArr = {};
        fileName.forEach(function(path) {
            let arr = path.split('/');
            let name = arr[arr.length - 2];
            entryArr[name] = './' + path;
        })
        return entryArr;
    },
    /***
     * 静态目录存放路径
     */
    assetsPath(_path) {
        return path.posix.join(config.build.resourcesShortPath, _path);
    },
    copyDir(source, target) {
        rm('-rf', target);
        mkdir('-p', target);
        cp('-R', source, target);
    }
}
```
再来看在开发和生产共用的代码`webpack.base.conf.js`  
首先看下一些基本的对`vue、css、js`这些loader的操作
```
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
```
嗯都给了注释，要注意的是`css、less、scss`的loader顺序，不要写反因为他是从前往后这样编译的 如果找不到前面的后面的loader也就无法执行`js`的loader用了一段这个
```
!process.env.NODE_ENV ? 'happypack/loader?id=happy-babel' : 'babel-loader',
```
因为在生产环境下打包时`js`loader的编译会很慢，所以开启了多线程去处理`js`loader的编译
```
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
```
需要在`plugins`下加上下面这段
```
createHappyPlugin('happy-babel', [{
    loader: 'babel-loader',
    options: {
        babelrc: true,
        cacheDirectory: true // 启用缓存
    }
}]),
```
`happy-babel`就是找到上面loader的id,但因为webpack4本来就是多线程的，这样做可能多此一举，暂时没有测试过量大时编译效果
还有这个
```
new VueLoaderPlugin() 
```
在 `vue-loader`版本为15.0以后都要加上
其它在升级到webpack4.0后还是有不少的坑，
就比如4之前可用的合并加载文件
```
new webpack.optimize.MinChunkSizePlugin({minChunkSize: 30000}),
```
这个已经整合到`splitChunks`里面去了，再用的话就会冲突报错
因为之前没有留意 用3升4的过程中没有删除它，所以大家要重新配置4的时候还是重新一步步配置，否则很多报错都莫名其妙，接着往下看
```
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
```
在**生产环境**下原来是用`ExtractTextPlugin`插件现在都改成了`MiniCssExtractPlugin`  
for循环里面主要是把`vue、css、less、scss`的第一个数组`style-loader`覆盖成`MiniCssExtractPlugin`否则会有冲突，  
自动添加前缀的`postcss-loader`要放到最后面，这也是执行顺序的问题  
在项目最外层要增加一个`postcss.config.js`内容是  
```
module.exports = {
    plugins: [
        require('autoprefixer')({
            browsers: ['last 20 versions']
        })
    ]
}
```
require的是一个自动补全css前缀的插件`last 20 versions`指的是兼容主流浏览器最近的20个版本，当然如果想要兼容到某个浏览器的特定版本也可以这样写
```
'last 10 Chrome versions',
 'last 5 Firefox versions',
 'Safari >= 6', 
 'ie> 8
```
接下来是前面提过的`px转rem`和`eslint`语法检查，是否开启和关闭是在`config.js`里设置

`build.js`是这里生产打包，操作都是先清空原来的输出目录,复制静态文件到输出目录 然后打包
```
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
```
以上就是使用单页或多页共同的代码块

### webpack4 单页配置(single)
单页应用的目录结构主要是这样的，和一般开发中的`vue`项目结构一样
```
build
  --views
     --index.html
     --404.html
  --build.js
  --config.js
  --dev-server.js
  --utils.js
  --webpack.base.conf.js
  --webpack.dev.conf.js
  --webpack.prod.conf.js
 src
   --conponents
   --css
   --font
   --images
   --mixins
   --pages //页面目录
   --router
   --store
   --App.vue
   --index.js
 static
   --jquery
 mode_modules
```
看build里的配置文件，前面讲过了`build.js、config.js、utils.js、webpack.prod.conf.js`现在就先说下`webpack.dev.conf.js`
```
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
```
webpack4.0新增了一个`mode为development/production`,两种模式在不同环境下都做了优化操作,想要访问这两种模式还是需要用到
`process.env.NODE_ENV`
关于页面热加载直接使用webpack自带的热加载功能`HotModuleReplacementPlugin`然后和入口文件`src/index.js`做一个合并
```
["webpack-hot-middleware/client?noInfo=true&reload=true"].concat("./src/index.js")
```
后面的`noinfo`和`reload`是可配置的，如果想继续增加参数可往这里添加，[传送门](https://github.com/webpack-contrib/webpack-hot-middleware)  
然后开启热加载`devServer: { inline: true }`  
在`output`里的path路径我指向的是打包输出路径，webpack开发环境 是打包到内存的并不是真的打包，filename是给了个固定的`index.js`  
这个是要写到`html`里做为整个项目的入口，也就是说整个项目运行就靠这个`index.js`，  
在plugins里有一个`new Jarvis`这里的端口是1337，项目运行后可以打开这个端口来看下文件大小，项目运行是否出错等等, 这个可视化窗口功能还不错，适合有双屏的同学

接下来看下`webpack.prod.conf.js`
```
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
```
这里说下在output下的publicPath，如果要把打包后的文件指向一个相对路径要加上`/`要不然生成出来的的入口文件会变成`resources/js/xxx.js`而不是我们期待的`/resources/js/xxx.js` 再则图片的路径也会变成 `resources/image/...png`,这样是无效的路径，当然这还是要看你用的是相对路径还是绝对路径了
来看下`optimization`这个东西，这是webpack4新加的功能用于代码的合并策略，这里是对两个地方的js进行合并一个是npm包一个是项目下的代码
```
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
```
这是符合合并规则条件的共同设置
```
chunks: 'initial',
minChunks: 2,
maxInitialRequests: 5,
minSize: 30000, //
maxInitialRequests: 3,
automaticNameDelimiter: '~',
```
也可以把他们拎到具体的合并对象下去做单独的规则设置
然后在`plugins`下引用上面的合并后的js
```
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
```
`chunks`它有如下三个模式,可自行调整
> * async表示只从异步加载得模块（动态加载import()）里面进行拆分
> * initial表示只从入口模块进行拆分
> * all表示以上两者都包括

再看下`dev-server.js`启动项入口
```
let port = process.env.PORT || config.dev.port;
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.engine('html', ejs.__express);
app.set('view engine', 'html');
app.set('views', path.resolve(__dirname, 'views'));
app.use(compression()); //开启gzip
//webpack编译器
const compiler = webpack(webpackConfig);
//webpack-dev-server 中间件
const devMiddleware = require('webpack-dev-middleware')(compiler, {
    //这里必填 与webpack配置的路径相同
    publicPath: webpackConfig.output.publicPath,
    stats: {
        colors: true,
        chunks: false,
    }
})
//热更新中间件
const hotMiddleware = require('webpack-hot-middleware')(compiler);
//处理本地开发环境下的代理接口
Object.keys(config.dev.proxyTable).forEach(function(context) {
    const options = config.dev.proxyTable[context];
    if (typeof options === 'string') {
        options = {
            target: options
        }
    }
    if (~context.indexOf(',')) {
        context = context.split(',');
    }
    app.use(proxyMiddleware(context, options));
})
app.use(devMiddleware);
app.use(hotMiddleware);

// 静态资源目录 指向static目录
app.use(express.static('./static'));

app.get('/*', function(req, res) {
    res.render('index');
});
//无路由时跳转404
app.get('*', function(req, res) {
    res.render('404');
})
app.listen(port, function() {
    console.log('node启动 正在监听端口：', port)
})
```
这里利用`nodejs`调用模板进行页面渲染
```
app.set('views', path.resolve(__dirname, 'views'));
```
指向的是当前`build`下的`views`目录下的html文件,
开启热更新和开发接口代理
```
app.use(devMiddleware);
app.use(hotMiddleware);
```
`app.use(express.static('./static'));`指向本地的静态资源
比如本地的图片路径是`/images/jpge.jpg`,
在开发环境下访问就会变成`http://localhost:8080/static/images/jpge.jpg`,

```
app.get('/*', function(req, res) {
    res.render('index');
});
```
把所有路径直接指向到`views/index.html`下 文件内容如下
```
<body>
    <!--开发环境-->
    <div id="app"></div>
    <script type="text/javascript" src="lib/jquery/jquery.min.js"></script>
    <script type="text/javascript" src="lib/bootstrap/js/bootstrap.min.js"></script>
    <script type="text/javascript" src="index.js"></script>
</body>
```
`index.js`就是之前的入口文件，必须要写进html文件里的，因为没有用`HtmlWebpackPlugin`做模板的映射，当真正在开发环境下使用`(template.html)`模板是这样子的
```
<body>
    <!--生产环境-->
    <div id="app"></div>
    <script type="text/javascript" src="/resources/lib/jquery/jquery.min.js"></script>
    <script type="text/javascript" src="/resources/lib/bootstrap/js/bootstrap.min.js"></script>
</body>
```
所以分了两个模板去渲染页面

### webpack4 多页配置(single)
多页应用的目录结构
```
build
  --views
     --index.html
     --404.html
  --build.js
  --config.js
  --dev-server.js
  --utils.js
  --webpack.base.conf.js
  --webpack.dev.conf.js
  --webpack.prod.conf.js
 src
   --conponents
   --css
   --font
   --images
   --mixins
   --pages //页面目录
    --new
       --index.js //入口
       --new.vue
 static
   --jquery
 mode_modules
```
build目录下有三个文件有些改动
`dev-server.js`去掉了视图目录指向
因为是多页的，这里是获取src目录下的一级目录做为路由
```
//这个获取的是内存路径
app.get('/:viewname?', function(req, res, next) {
    var viewname = req.params.viewname ? req.params.viewname + '.html' : 'main.html';
    var filepath = path.join(compiler.outputPath, viewname);

    compiler.outputFileSystem.readFile(filepath, function(err, result) {
        if (err) {
            res.send('can\'t not find the file: ' + filepath).end;
            return;
        }
        res.set('content-type', 'text/html');
        res.send(result);
        res.end();
    });
});
```
然后是`webpack.dev.conf.js`里加了这一段
```
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
```
获取src目录下的每个文件做为入口进行模板渲染
同样在`webpackprod.conf.js`也需要加上
```
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
```
这里多了一个`environment`他是插入模板的一个变量，为区分开发和生产环境路径
```
<body>
    <!--生产环境-->
    <div id="app"></div>
    <script type="text/javascript" src="<%= htmlWebpackPlugin.options.environment %>/lib/jquery/jquery.min.js"></script>
    <script type="text/javascript" src="<%= htmlWebpackPlugin.options.environment %>/lib/bootstrap/js/bootstrap.min.js"></script>
</body>
```
