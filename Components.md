## 组件说明

components是基于sui进行的封装，主要是一些常用的页面组件

### 1.iheader

iheader是定义的头部的组件，用法如下：

    <iheader>
        <back></back>
        <h1 class="title">标题</h1>
    </iheader>

### 2.back

back是返回按钮(<)组件，**依赖父组件iheader**, 接收url，ng-click
默认返回上一页
```
    <back></back>
    <back url="/tabs/home"></back>
    <back ng-click="goNext('tabs.home')"></back>
```

### 3.content

content是内容容器组件，其他的内容写在其中
```
    参数：
        class
        hastabs(不区分大小写) 任意值 是否有底部导航栏

    用法示例：
        <content>
            <div>....
        </content>

        <content class="home" hasTabs="true">
            <div>....
        </content>
```

### 4.imarquee

imarquee 是上下滚动的组件，当前存在数据较少的时候停止滚动的问题
```
    参数说明：
        scrollDelay             时长，即倒计时刷新的频率，越小越快 默认是20ms

    使用：
        <imarquee>
            <li class="row" ng-repeat="item in list_wins" ></li>
        </imarquee>
```

### 5.tabs

tabs 是首页底部的5个导航菜单
```
    <tabs></tabs>
```


### 6.tab
tab是tabs的子元素，依赖tabs,支持传参
```
    参数说明：
        icon: 菜单图标对应的classname
        title: 菜单文字
        href: 跳转的路由地址
```

```
    <tabs>
        <tab icon="icon-home" title="首页" href="/tabs/home"></tab>
        <tab icon="icon-gouwuche fs28" title="购彩" href="/tabs/buy"></tab>
        <tab icon="icon-kaijiangx" title="开奖" href="/tabs/open"></tab>
        <tab icon="icon-zhudanx" title="注单" href="/tabs/order"></tab>
        <tab icon="icon-wodex" title="个人中心" href="/tabs/my"></tab>
    </tabs>
```

### 6.carousel

轮播
```
    轮播的使用标签为:
        <carousel>
            <carousel-item ng-repeat="x in carousel">
                <a ng-href="{{x.url}}"><img ng-src="{{x.pic}}" /></a>
            </carousel-item>
        </carousel>

    其中carousel-item依赖父组件carousel

    carousel支持如下参数：
        autoPlay: 默认为true，是否自动轮播
        dots: 默认为true，是否显示下面的点点
```

### 7.pull-refresh

下拉刷新，上拉加载更多，
需要注意的是：
    1.**父容器为绝对定位**
    2.**refresh和loadMore方法需要返回一个Promise对象供组件使用**
```
    pull-refresh为属性指令，即写在标签内的指令
    实现下拉刷新，需要传refresh参数，为function，需要返回Promise
    实现加载更多，需要传load-more参数，为function 需要返回Promise

    具体方法需要根据实际需求实现，可以参考order.controller.js的实现：
        <div
            class="list"
            ng-if="!isEmpty"
            pull-refresh
            refresh="refresh()"
            load-more="loadMore()"
        >
        <div>

        需要注意的是，所在容器list需要position：absolute

        Controller 中：

            //为公用的请求方法
            reqData(type, page) {
                this.$scope.type = type
                const params = page ? {
                    type,
                    page
                } : {type}
                //返回一个Promise的请求
                return this.Core.get('user/bet_record/get_list', params, (json) => {
                    var c = angular.fromJson(json)
                    if (c.code == 200) {
                        if ((!c.data.rows || !c.data.rows.length) && this.$scope.orderItems.length == 0) {
                            this.$scope.isEmpty = true
                        } else {
                            this.$scope.isEmpty = false
                            if(!this.$scope.orderItems || !this.$scope.orderItems.length) {
                                this.$scope.orderItems = c.data.rows
                            }
                        }
                    }
                }, false)
            }

            //这里是实现刷新的方法
            refresh() {
                const { type = 0 } = this.$scope
                //改刷新方法返回一个Promise对象供指令去准确执行回调
                return this.reqData(type).then((json) => {
                    //重置数据
                    this.$scope.orderItems = json.data.rows
                    //重置页数
                    this.$scope.page = 1
                })
            }

            //加载更多方法
            loadMore() {
                const { type = 0, page = 1 } = this.$scope
                //返回一个Promise对象供组件准确执行回调
                return this
                        .reqData(type, Number(page) + 1)
                        .then((json) => {
                            const c = json.data.rows
                            if( c && c.length>0 ) {
                                //数据请求完毕更新当前页数
                                this.$scope.page = page + 1
                                //执行数据更新
                                this.$scope.orderItems = this.$scope.orderItems.concat(c)
                            }
                        })
            }
```

### 10. slide-tabs

购彩页面，规则页组件
```
    组件默认根据slide-tab数据生成头部标签，主要操作数据在子组件slide-tab中
    参数：
        auto-hide:  是否各个滑动容器主动隐藏
```

### 11. slide-tab

slide-tabs子组件
```
    依赖：slide-tabs
    参数：
        bar-title:    头部bar标题
        bar-img:      头部图片图标， 非必填
        type:         哪种类型，必填，会根据此类型去定位

    使用：
        购彩页：
            <slide-tabs>
                <slide-tab
                    ng-repeat="lottery in lotterys"
                    bar-title="{{lottery.name}}"
                    bar-img="{{lottery.img}}"
                    type="{{lottery.type}}"
                >
                    <div class="item-wrap">
                    </div>
                </slide-tab>
            </slide-tabs>

        规则页：
            <slide-tabs auto-hide="true">
                <slide-tab ng-repeat="game in games" bar-title="{{game.label}}" bar-img="{{game.img}}" type="{{game.value}}">
                    <div ng-bind-html="game.html"></div>
                </slide-tab>
            </slide-tabs>
```

### 12.lazy-img 懒加载图片
```
    参数：
        url: 图片加载使用的路径
        wrap: 指定作用的父容器 默认是content
```

### toast(吐丝)，modal（弹窗），confirm（确定弹出框），popup, popupFromUrl的使用

modal和toast是一级方法，confirm, popup,popupFromUrl基于modal实现

#### toast（**单例**）的使用
```
   Toast 接受两个参数, msg (弹出信息), cd（关闭倒计时，非必传，默认2秒关闭）
    在相关的controller的constructor中引用该service
    例：
        //为某个controller类
        export default class {
            //该controller的构造函数
            constructor(Layer, $scope) {
                this.L = Layer //将this的L指向Layer

                //将this的test绑定至$scope上
                $scope.text = this.text.bind(this)
            }

            text() {
                this.L.toast('你好，吐丝')
                this.L.toast('你好，吐丝', 5)
            }
        }

        <button ng-click="test()"></button>
```

#### modal（**暂时建议不直接使用，推荐使用popup，popupFromUrl, confirm等**）的使用

返回zepto包装的改modal对象
参数params:
```
    {
        maskClose: boolean 默认为true，遮罩点击关闭
        content: html或字符串
        single: boolean 默认为true，是否单例
        style: object 样式，作用于弹窗
        cb: function 回调函数
    }

    modal返回$modal 【zepto包装对象】

    建议不直接使用modal，具体用法参照confirm的实现
```

#### popup (弹出层)的使用 **返回该对象**

参数params:
```
    {
        scope: $scope, 非必传，如果传此参数，将按照angular模板去处理
        tpl: html,
        cb: function 回调函数
        style: {} 样式对象
    }

    使用示例：
    1. html：

        //为某个controller类
        export default class {
            //该controller的构造函数
            constructor(Layer, $scope) {
                this.L = Layer //将this的L指向Layer

                //将this的test绑定至$scope上
                $scope.test = this.test.bind(this)
            }

            test() {
                const html = '<div>test</div>'
                const $modal = this.L.popup({
                    content: html,
                    style: {width: '120px', height: '10px'},
                    //关闭点击遮罩关闭
                    maskClose: false,
                })

                //手动关闭modal
                this.L.mclose($modal)
            }
        }

    2.带ng的html：
        //为某个controller类
        export default class {
            //该controller的构造函数
            constructor(Layer, $scope) {
                this.scope = $scope
                this.L = Layer //将this的L指向Layer

                //将this的test绑定至$scope上
                $scope.test = this.test.bind(this)
            }

            test() {
                const _this = this
                this.scope.data = {name: 'zhangsan', age: 22}
                const html = '<div age="{{data.age}}">{{data.name}}</div>'
                this.L.popup({
                    content: html,
                    scope: _this.scope,
                    style: {width: '120px', height: '10px'}
                })
            }
        }
```

#### popupFromUrl(使用html模板的弹层) **返回该对象**

参数params:
```
    {
        url: url,
        style: {} object
        scope: $scope 必传
    }
    使用ng-template使用示例：

    在html中：
        <script id="test.html" type="text/ng-template">
            <div age="{{data.age}}">{{data.name}}</div>
        </script>

    controller:
        //为某个controller类
        export default class {
            //该controller的构造函数
            constructor(Layer, $scope) {
                this.L = Layer //将this的L指向Layer

                //将this的test绑定至$scope上
                $scope.test = this.test.bind(this)
            }

            test() {
                const _this = this
                const $modal = this.L.popup({
                    url: 'test.html',
                    style: {width: '120px', height: '10px'},
                    scope: _this.scope
                })
            }
        }
```

#### confirm 使用 （返回modal对象）
```
    {
        title: text
        msg: text
        yesFn: func
        noFn: func
    }
```
