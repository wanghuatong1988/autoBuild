module.exports = {
    root: true,
    //parser: "babel-eslint",
    "env": {
        "browser": true,
        "node": true,
        "commonjs": true,
        "es6": true, //至此es6语法检查
    },
    extends: ["eslint:recommended", "plugin:vue/recommended"], //表示使用默认的规则进行校验
    //此项是用来指定javaScript语言类型和风格，sourceType用来指定js导入的方式，默认是script，此处设置为module，指某块导入方式
    parserOptions: {
        "ecmaVersion": 6, //对es6语法支持
        "parser": "babel-eslint",
        sourceType: "module",
    },
    plugins: [
        "html", //检查.html中的javascript中的语法错误
        "vue",
    ],
    rules: {
        //规则有3个等级：off(0)、warn(1)和error(2)。off表示禁用这条规则，warn表示给出警告，并不会导致检查不通过，而error则会导师检查不通过
        "quotes": [2, "double"], //字符串的引用使用双引号
        "semi": [2, "always"], //检查分号semicolons
        "eol-last": 0, //强制文件最后一行为空行，关闭
        "eqeqeq": [1, "allow-null"], //要求使用 === 和 !==，但允许 == null
        "no-var": 2, //要求使用 let 或 const 而不是 var
        "no-empty": 1, //空的代码块
        "no-undef": 2, //不允许使用未申明变量
        "no-alert": 2, //禁用 alert、confirm 和 prompt
        "no-unused-vars": 1, //变量定义后未使用
        "no-use-before-define": 1, //不允许在变量定义之前使用它们
        "no-console": 1 //不检查console.log的语法，忽略它
    },
    "globals": { //声明在代码中自定义的全局变量
        "document": true,
        "navigator": true,
        "window": true,
        "Vue": true,
        "_": true, //检查lodash的语法，否则会产生 '_'is no-undef
        "$": true, ////添加支持jquery语法检查，不然会出现 '$'is no-undef,这也可以在env中添加“jquery:true”解决
    },
};