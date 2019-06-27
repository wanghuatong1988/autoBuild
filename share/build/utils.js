const
    glob = require('glob'),
    path = require('path'),
    config = require('./config');

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