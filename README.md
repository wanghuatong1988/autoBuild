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


