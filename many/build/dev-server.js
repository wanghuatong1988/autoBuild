const
    path = require('path'),
    express = require('express'),
    webpack = require('webpack'),
    config = require('./config'),
    proxyMiddleware = require('http-proxy-middleware'),
    webpackConfig = require('./webpack.dev.conf');

let port = process.env.PORT || config.dev.port;
const app = express();

//webpack编译器
const compiler = webpack(webpackConfig);
//webpack-dev-server 中间件
const devMiddleware = require('webpack-dev-middleware')(compiler, {
    publicPath: webpackConfig.output.publicPath,
    stats: {
        colors: true,
        chunks: false,
    }
})

//热更新中间件
const hotMiddleware = require('webpack-hot-middleware')(compiler, {
    path: '/__webpack_hmr',
    heartbeat: 2000,
});

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

app.listen(port, function() {
    console.log('node启动 正在监听端口：', port)
})