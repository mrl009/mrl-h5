# GCwap h5版 架构框架
>提示: 确保你正在使用node

### 目录结构说明
```
.
├── README.md
├── dist                     // 项目build目录
├── src                      // 生产目录
│   ├── assets               // 静态资源目录
│   ├── components           // 组件目录
│   ├── directive            // 自定义指令目录
│   ├── lottery              // 购彩目录
│   ├── service              // service文件目录
│   ├── config.js            // api url 配置
│   ├── index.html           // 生产环境模板
│   ├── routes.js            // 路由配置文件
│   └── stateHandler.js      // controller，tpl模板配置文件
│
├── .htaccess                // apache服务器配置文件
├── main.js                  // 入口文件
├── postcss.config.js        // postcss 补全配置文件
├── webapi.php               // php服务转发文件
├── webpack.common.js        // webpack 公共配置文件
├── webpack.dev.js           // 开发模式配置
└── webpack.prod.js          // 生产模式配置
.
```

### 快速开始

```
bash
# clone our repo
$ git clone xxx

# install the dependencies with npm
$ npm install

# start the server
$ npm start
```


## 启动

安装完所有依赖之后你可以执行以下脚本来启动程序:
```
npm start
```

使用本地服务`webpack-dev-server`监听，创建和热加载。
端口暂为3000`http://localhost:3000`

## 生产输出刷新404的解决办法

```
    apache: 生产产出有 .htaccess 文件，不会出现问题
    nginx: 需要在nginx 的配置中进行一下配置：
            location / {
                if (!-e $request_filename){
                    rewrite ^(.*)$ /index.html;
                }
            }
    express: 可以在app上进行路由配置：
            var express = require('express');
            var app = express();
            app.all('/*', function(req, res, next) {
                // Just send the index.html for other files to support HTML5Mode
                res.sendFile('index.html', { root: __dirname });
            });
```

#### 关于node版本的问题说明
>避免使用太新或太旧的版本

## 生产版本中如果出现tProvider undefined，在webpack.prod.js中的UglifyJsPlugin中的mangle加入该provider的名字

```
    mangle: {
      except: [
        '$state',
        '$stateParams',
        '$timeout',
        'Core',
        'Layer',
        'Util',
        '$location',
        '$rootScope',
        '$scope',
        '$stateProvider',
        '$urlRouterProvider',
        '$locationProvider',
        '$httpProvider',
        'IsDebug',
        '$httpParamSerializer',
        '$sce'
      ]
    }
```

### 关于倒计时的问题：

>我们应该尽可能的去避免使用setInterval 或者 $interval, 这个函数会占用大块资源，导致卡顿
>当前在Core中封装了loop函数，通过$timeout去实现循环
>根据实际需求可以进行功能扩展

### 关于图片引用的注意事项


>   webpack不擅长图片的处理
>   所以在页面上进行引用时，webpack不能将开发使用的文件复制到生产目录中，这里有两种解决方案：
>   1：
>   根据实际需要，将样式部分的图片写到css中，同时这也是切图规范的要求
>   2：
>   在相应的controller中引入该图片：
>   import img from '**/**/**.png|jpg|..'
>   将其赋值给scope，然后在页面中使用：
>   $scope.img = img
>   <img ng-src="{{img}}" />
>   这里我们应该尽量的去使用方法1，遵照切图的规范来操作，可以提升我们的css布局意识。


### 关于css命名的规范

>css命名有一些约定的规范，这里给出Airbnb的css命名规范，也是当前前端使用很广泛的规范：

[Airbnb前端规范](Standard.md)

## 关于组件的说明和使用文档

>重构的h5项目中脱离了ionic的使用，进行了对sui（阿里巴巴出品）的封装和借鉴
>其中具体说明在[组件库使用文档](Components.md) 中

## 关于controller使用类重构的说明：
```
    重构的h5项目中，针对controller数据交互复杂，初始化较多，代码杂乱的问题，
    进行了面向对象的处理，使用class去代替function的写法
    实际上代码风格更贴近后端语言（如PHP，Java等），也行之有效的解决了上述问题，
    针对class的写法有几点说明：
        1.构造器：
            每个class都有一个构造器函数constructor,会在里面执行一个初始化操作
        因为是导出的class，所以没有提供service或其他工具的地方，这里就通过构造器引入：
        export default class {
            constructor($scope, Core, $timeout) {
                this.Core = Core
                this.$scope = $scope
                this.$timeout = $timeout
            }
        }
        将service和工具引入后，指给当前的this，以供其他方法使用

        2.函数的bind：
            对于页面上要使用的函数，我们需要将内部方法bind至$scope：
            export default class {
                constructor($scope, Core, $timeout) {
                    //内部初始化方法
                    initFn()

                    //非初始化方法，通过bind的方式将该方法bind至$scope对象上，以便页面上调用
                    $scope.chooseTab = this.chooseTab.bind(this)
                    //需要注意的是，如果直接将$scope中的方法指向该方法，随着作用域的改变，该方法的this也指向了$scope,内部对this的指向就会发生改变
                    $scope.chooseTab = this.chooseTab               X这种直接指向的方式是无效的
                }

                chooseTab() {
                    this.test()
                }

                test() {
                    console.log('test')
                }
            }
```

### 关于对get post请求的改造说明

当前对Core中的get 和 post请求做了改动，当前get和post请求返回一个 **Promise** 对象，
并能在该Promise的后续调用中获取到请求返回的值：
```
    this
        .Core
        .get('xxxx', {params: obj}, function(json) {
            console.log(json)
        })
        .then((json) => {
            console.log(json)
        }
```

### 关于ES6 写法说明：

1. **...**
三个点可以列出数组的所有元素，极大的方面我们操作数据：
```
    例1：
    const a = [1,2,3]

    const b = [...a, 4]
    等同于
    const b = a.concat([4])
```

2. **const { a = 1 } = obj**
获取对象的属性，并赋予初始值
```
    es5:
        const a = obj.a || 1
        如果obj.a为false就会产生问题

    es6:
        const { a = 1 } = obj
        获取obj的属性a,初始值为1
```

3. **_ => {} 箭头函数**
箭头函数可以用于定义函数，需要注意的是，箭头函数的this **指向外部的域**
```
    es5:
        const a = function() {}

    es6:
        const a = () => {}

    例2：
        class {

            reqData() {
                return Promise()
            }

            test() {}

            refresh() {
                return this.reqData().then(function() {
                    console.log(this)    //this指向Promise的域
                    this.test()         //报错
                })
            }
        }

        class {

            reqData() {
                return Promise()
            }

            test() {}

            refresh() {
                return this.reqData().then(() => {
                    console.log(this)     //this 指向class的域
                    this.test()            // 执行test方法
                })
            }
        }

```


## 关于日期处理的说明:

>日期处理应避免使用new Date(string) 去转换，safari不支持部分格式，统一使用date-tool工具

### 关于ReqService的使用说明
所有的请求方法统一放在reqService中去管理，便于复用和修改，注册service名字为RS,
**需要注意的是,要想使用链式调用，必须将该请求返回，即返回一个Promise**
```
    //service中：
    getProduct: function(gid) {
        //这里将Promise返回
        return this.get(`games/products/${gid}`, {}, true)
    }

    //调用
    this.RS
        .getProduct(this.S.gid)
        .then((c) => {
            //这里的c类型根据service中的处理
            console.log(c)
        }）
```

### 关于模板导出的说明
> 在lottery部分存在动态加载模板的使用，因此需要将该部分模板生产至生产文件夹，这里同意使用.tple.html的后缀来识别

### 问题备忘录：
    3.登录失效后再次登录token被立即移除的问题

### 关于cookie和localstorage等缓存的使用建议
    在使用cookie(例如token)、localstorage(如首页缓存)的时候，对于使用频繁的缓存变量我们应当合理的管理起来，避免到处出现变量的问题，否则一旦我们需要改动该变量的key值，想想一下，那将会是场灾难。
    我们应该在统一的service中封装一个方法来管理这个变量，
    例如token的管理：
        Core:
            setToken(value) {
                cookies.set('token', value)
            }
            getToken() {
                return cookie.get('token')
            }
        这种情况下，当我们统一使用Core.setToken, Core.getToken时，当我们不得不改变key的时候，我们只需要轻松的在Core的两个方法中更改key的名字如：auth_token, 相当轻松，想想一下，如果在每个需要使用的地方都使用了'token', 改到'auth_token'的时候你会怎么样。
