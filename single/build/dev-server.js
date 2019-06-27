const
    path = require('path'),
    express = require('express'),
    webpack = require('webpack'),
    child = require('child_process'),
    bodyParser = require('body-parser'),
    compression = require('compression'),
    ejs = require('ejs'),
    config = require('./config'),
    proxyMiddleware = require('http-proxy-middleware'),
    webpackConfig = require('./webpack.dev.conf');

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

//
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