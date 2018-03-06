import 'animate.css'
import './home.less'
import $ from 'zepto'
import angular from 'angular'
export default class {
	constructor($scope, $location, Core, $state, RS, Layer, $timeout, DB, $rootScope, $cookieStore) {
		this.$location = $location
		this.Core = Core
		this.$state = $state
		this.RS = RS
		this.Layer = Layer
        this.timeout = $timeout
        this.DB = DB
        this.$cookieStore = $cookieStore
        let pt = sessionStorage.getItem('playType')
		this.$scope = Object.assign($scope, {
			data: [],
            active: '',
            interval: 0,
	        new_notice: '',
	        list_wins: [],
	        balance: '',
	        carousel: [],
            games_gc_list: [],
            games_sc_list: [],
            showtip: 0,
            playType: pt? pt: '',
	        isLogin: Core.getToken(),
            is_d_show: $cookieStore.get('IS_NAV'),
            allauth: false,
            is_ios: $cookieStore.get('s')==1 ? false : true
		})
        if($rootScope.lottery_auth) {
            if($rootScope.cp_default == 1) {
                this.$scope.playType = 'sc'
            }else {
                this.$scope.playType = 'gc'
            }
            let cp = $rootScope.lottery_auth ? $rootScope.lottery_auth : '1,2'
            cp = cp.split(',')
            if($.inArray('1', cp)>-1 && $.inArray('2', cp)>-1) {
                this.$scope.allauth = true
            }else if($.inArray('1', cp)>-1) {
                this.$scope.playType = 'gc'
            }else if($.inArray('2', cp) >-1) {
                this.$scope.playType = 'sc'
            }
            let pt = sessionStorage.getItem('playType')
            this.$scope.playType = pt ? pt : this.$scope.playType
            this.initPlayList(this.$scope.playType)
            sessionStorage.removeItem('playType')
        }else {
            this.initHome()
        }
		this.initIntr()
		this.initAccount()
		// this.initPrize()
        this.pollRedPacket()
        if(/iPhone/i.test(navigator.userAgent)) {
            this.showLogo()
        }
        if(sessionStorage.getItem('tip')!=1) {
            this.inittip()
            sessionStorage.setItem('tip', 1)
        }
        $scope.goToNext = this.goToNext.bind(this)
        $scope.red_packet_click = this.red_packet_click.bind(this)
        $scope.getRedPacketList = this.getRedPacketList.bind(this)
        $scope.open_red_packet = this.open_red_packet.bind(this)
        $scope.close = this.close.bind(this)
        $scope.formatTime = this.formatTime.bind(this)
        $scope.initPlayList = this.initPlayList.bind(this)
        $scope.closered = this.closered.bind(this)
        $scope.zclose = this.zclose.bind(this)
    }

    initHome() {
	    const _ = this
        this.RS.getHomeData()
            .then((c) => {
                if (c.code == 200) {
                    if(c.data.cp_default == 1) {
                        _.$scope.playType = 'sc'
                    }else {
                        _.$scope.playType = 'gc'
                    }
                    let cp = c.data.lottery_auth ? c.data.lottery_auth : '1,2'
                    cp = cp.split(',')
                    if($.inArray('1', cp)>-1 && $.inArray('2', cp)>-1) {
                        _.$scope.allauth = true
                    }else if($.inArray('1', cp)>-1) {
                        _.$scope.playType = 'gc'
                    }else if($.inArray('2', cp) >-1) {
                        _.$scope.playType = 'sc'
                    }
                    let pt = sessionStorage.getItem('playType')
                    _.$scope.playType = pt ? pt : _.$scope.playType
                    _.initPlayList(_.$scope.playType)
                    sessionStorage.removeItem('playType')
                }
            })
    }

	goToNext(item) {
	    // const _this = this
        if(this.$scope.active != item.id) {
            this.$scope.active = item.id
            sessionStorage.setItem('playType', this.$scope.playType)
            this.$state.go(item.tmp, {type: item.tmp, gid: item.gid})
            //this.$state.go('tabs.buy', {type: 'pcdd'})
        }
	}

	//初始化代理号
	initIntr() {
		const { $$search } = this.$location
		$$search.intr && this.Core.setIntr($$search.intr)
	}

	//初始化账户信息
	initAccount() {
		if(this.$scope.isLogin) {
			this.RS.getBalance()
				.then((c) => {
					if (c.code == 200) {
	                    this.$scope.balance = c.data.balance
	                }
				})
		}
	}

	//main all
	initPlayList(type) {
	    const _this = this
        // if(type === _this.$scope.playType) {
	     //    return false
        // }
	    //sessionStorage.removeItem('playType')
        _this.$scope.active = ''
        _this.$scope.playType = type
	    let list = JSON.parse(sessionStorage.getItem('games_'+_this.$scope.playType+'_list'))
	        if(list) {
                _this.$scope['games_'+_this.$scope.playType+'_list'] = list
            }else {
                _this.$scope['games_'+_this.$scope.playType+'_list'] = []
                _this.RS.getGameList({ctg: _this.$scope.playType, new_hot: 1}).then((res) => {
                    if(res.code == 200) {
                        //let list = this.filter(res.data, 24, 25)
                        let list = res.data
                        _this.$scope['games_'+_this.$scope.playType+'_list'] = list
                        sessionStorage.setItem('games_'+_this.$scope.playType+'_list', JSON.stringify(list))
                    }else {
                        _this.$scope['games_'+_this.$scope.playType+'_list'] = []
                    }
                })
            }
	}
	filter(arr, id1, id2) {
	    if(!Array.isArray(arr)) {
	        return
	    }
        for(let i = 0, n = 0; i < arr.length; i++) {
            if(arr[i].gid == id1 || arr[i].gid == id2) {
	            n++
                if(n > 1) {
                    arr.splice(i, 1)
                    n--
                    i--
                }
            }
        }
        return arr
    }

	// // 中奖榜， 缓存
	// initPrize() {
	// 	this.RS
	// 		.getPrize()
	// 		.then((c) => {
	// 			if (c.code == 200) {
	//                 this.$scope.list_wins = c.data.rows
	//             }
	// 		})
	// }

    //初始化首页弹框
    inittip() {
	    const _ = this
        this.Core.get('rules/game_rules/get_game_article_content?id=68', function(json) {
            const c = angular.fromJson(json)
            if( c.code == 200 ) {
                let info = c.data[0].content
                if(info) {
                    let modal = _.Layer.modal({
                        content: `<h3 style="font-size: 1rem;text-align: center;padding-top: .5rem;">最新通知</h3>
                        <div style="padding:0 20px 0 20px;height: 82%;overflow:auto">${info}</div>
                        <button class="button-login fs16 main-w" style="width:100%;height: 2rem;"  type="botton">我知道了</button>`,
                        style: {
                            'max-width': '90%',
                            'height': '65%',
                            'border-radius': '5px'
                        }
                    })
                    modal.find('.button-login').on('click', function() {
                        modal.remove()
                    })
                }
            }
        })
    }

    //是否是手机端打开的safari
    checkSafariAgent() {
        var ua = navigator.userAgent
        // IOS系统
        if (/ OS \d/.test(ua)) {
            if (!~ua.indexOf('CriOS')) {
                if (!ua.indexOf('Mozilla')) {
                    // 结尾需为：Safari/xxx.x
                    if (/Safari\/[\d\.]+$/.test(ua)) {
                        return true
                    }
                }
            }
        }
        return false
    }
    showLogo() {
        if(!this.checkSafariAgent()) { //检测设备
            return false
        }

        if(window.navigator.standalone) { //已经加入了主屏幕
            return false
        }else {
            if(sessionStorage.getItem('hide_logo_wap')) {
                return false
            }

            setTimeout(() => {
                this.$scope.show_logo_wap = true
            }, 5000)
        }
        // if(sessionStorage.getItem('hide_logo_wap') || !this.checkSafariAgent() || navigator.standalone) {
        //     return false
        // }else {
        //     this.timeout(() => {
        //         this.$scope.show_logo_wap = true
        //     }, 3000)
        // }
    }
    zclose() {
        this.$scope.show_logo_wap = false
        sessionStorage.setItem('hide_logo_wap', true)
    }
    showRedPacket(start, server, end) {
	    let intTime = start - server
	    if(intTime <= 30*60) {
            this.$scope.interval = intTime
        }
        return (server >= start && server < end) || (intTime <= 30*60 && server < end)
    }
    //检查 是否可以抢红包
    checkRedPacket() {
        this.RS.checkRedPacket().then((res) => {
            if(res.code == 200 && res.data) {
                let data = res.data
                this.$scope.id = data.id
                this.$scope.showPacket = this.showRedPacket(data.start_time, data.server_time, data.end_time)
                // this.$scope.showPacket = this.showRedPacket(1512007811, 1512007237, 1512023791)
            }
        })
    }
    //每隔1分钟 检查一次
    pollRedPacket() {
        let timer = null
        this.$scope.$on('$destroy', () => {
            this.timeout.cancel(timer)
        })
        this.checkRedPacket()
        timer = this.timeout(() => {
            this.pollRedPacket()
            this.timeout.cancel(timer)
        }, 60000)
    }
    formatTime() {
	    let timer = null
        timer = this.timeout(() => {
            this.$scope.interval--
            this.$scope.countDown = [
                    parseInt(this.$scope.interval/60),
                    this.$scope.interval % 60
                ].map((v) => {return parseInt(v)<10? '0'+v: v})
            this.$scope.countDown = this.$scope.countDown.join(':')
            if(this.$scope.interval > 0) {
                this.formatTime()
            }
            this.timeout.cancel(timer)
        }, 1000)
    }
    close() {
	   $('.download').remove()
       this.$cookieStore.put('IS_NAV', '1')
       let tt = this.$cookieStore.get('IS_NAV')
       this.$scope.is_d_show = tt
    }
	//红包
	red_packet_click() {
        let _this = this

        this.createdHtml().then((modal) => {
            modal.find('.picker-close').on('click', function() {
                modal.remove()
            })
            if(modal.find('.p5-1')) {
                modal.find('.p5-1').on('click', function() {
                    modal.remove()
                    _this.getRedPacketList()
                })
            }
            if(modal.find('chai')) {
                this.$scope.$watch('interval', (val) => {
                    if(val <= 0) {
                        modal.find('.chai').on('click', () => {
                             modal.remove()
                             _this.open_red_packet()
                        })
                    }
                })
            }
        })
	}
	createdHtml() {
        let modal = ''
        if(!this.Core.getToken()) {
            return new Promise((resolve) => {
               modal = this.Layer.modal({
                    style: {
                        'max-width': '14rem',
                        'background': 0
                    },
                    content: `<div class="red-login container bg-white re fs14 animated bounce">		
                                <i class="iconfont fr picker-close m-r5">&#xe660;</i>
                                <p class="main-color text-center">请登录或注册账号再领取红包</p>
                                <div class="login-btn flex-space">
                                    <a class="go-login white-text bg-gray" href="/login/">登录</a>
                                    <a class="go-reg white-text main-w" href="/register">注册</a>
                                </div>
		                    </div>`
               })
               resolve(modal)
            })
        }else {
            return new Promise((resolve) => {
                this.RS.getRedNum(this.$scope.id).then((res) => {
                    if (res.code !== 200) {
                        this.Layer.toast(res.msg)
                        return
                    }
                    this.$scope.count = res.data.count
                    this.$scope.remain = res.data.total
                    this.formatTime(this.$scope.interval)
                    modal = this.Layer.popup({
                        scope: this.$scope,
                        tpl: `  <p class="p1 text-center">您昨天充值金额{{remain}}元</p>
                                <p class="p2 text-center">能抢{{count}}次</p>
                                <span class="ab chai"></span>
                                <p class="p3 text-center">{{ interval<= 0? '活动已经开始了': '离活动开始还有'}}</p>
                                <p class="p4 text-center">{{interval<= 0? '抢红包啦': countDown}}</p>
                                <p class="p5 fs14">
                                    <a class="p5-1">&lt;&lt;红包排行榜</a>
                                    <a class="p5-2" href="/question/38">红包说明&gt;&gt;</a>
                                </p>`,
                        wrap: (html) => {
                            return `<div class="red-info fs16 animated rubberBand">
                                        <p class="over">
                                            <i class="iconfont fr white-text picker-close">&#xe660;</i>
                                        </p>
                                        ${html || ''}
                                    </div>`
                        }
                    })
                    modal.find('.modal-content').css({
                        background: 'none'
                    })
                    resolve(modal)
                })
            })
        }
    }

    //拆红包
    open_red_packet() {
        if(this.$scope.count <= 0) {
	        this.Layer.toast('你的次数用完了!')
            return
        }
        this.RS.chaiRedPacket(this.$scope.id).then((res) => {
            if(res.code == 200) {
                this.$scope.count = res.data.surplus_num
                this.getRedPacketMoney(res.data.money)
            }else {
	            this.Layer.toast(res.msg)
            }
        })
    }
    closered() {
        $('.red-packet').hide()
    }
    //红包金额
    getRedPacketMoney(money) {
        let $modal = this.Layer.modal({
            style: {
                'max-width': '14rem',
                'background': 0
            },
            content: `<div class="red-packet-money animated shake re">
                         <i class="iconfont fr white-text picker-close ab">&#xe660;</i>   
                         <h4 class="text-center fs18 golden get-redPacket-title">恭喜你,抢到!</h4>
                         <span class="golden ab text-center packet-money">${money}元</span>
                         <button id="again" class="text-center lh40 radius5 ab"></button>
                      </div>`
        })
        $modal.find('.picker-close').on('click', function() {
            $modal.remove()
        })
        let $btn = $modal.find('#again')
        if($btn && this.$scope.count > 0) {
            $btn.html('再抢一次')
            $btn.on('click', () => {
                $modal.remove()
                this.open_red_packet()
            })
        }else if($btn && this.$scope.count <= 0) {
            $btn.html('次数已尽')
        }
    }
    //获取红包排行榜
    getRedPacketList() {
        this.RS.getRedPacketList().then((c) => {
            if (c.code == 200) {
                this.$scope.red_top_list = c.data || []
                let $modal = this.Layer.popup({
                    scope: this.$scope,
                    tpl: ` <imarquee class="red-top-list ab">
                              <li class="row golden fs14" ng-repeat="item in red_top_list">
                                   <span class="text-center col col-50 wins lh30">{{item.username}}</span>
                                   <span class="text-center col col-50 wins home-wins lh30">喜中 {{item.total}}元</span>
                              </li>
                          </imarquee>`,
                    wrap: function(html) {
                        return `<div class="red-top animated wobble re">
		                        <div class="red-top-line">
		                            <i class="iconfont ab picker-close white-text">&#xe660;</i>
                                    <p class="red-packet-result-top-title ab text-center golden">红包榜</p>
                                    ${html || ''}
                                </div>
                            </div>`
                    }
                })
                $modal.find('.modal-content').css({
                    background: 'none'
                })
                $modal.find('.picker-close').on('click', () => {
                    $modal.remove()
                    this.red_packet_click()
                })
            }
        })
	}
}
