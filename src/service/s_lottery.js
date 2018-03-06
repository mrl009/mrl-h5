import angular from 'angular'
/***********购彩公用方法**********************/
import $ from 'zepto'
export const S_lottery = function (Core, Layer, RS, DB, $timeout, Util, $state, $rootScope) {
    return {
        showPlaylist: function (scope, fn) {
            const type = scope.playlist.type
            const link = scope.playlist.aid>0 ? `${type}/${type}/${scope.playlist.aid}` : '#'
            const isshow = scope.playlist.aid>0
            let tt = ''
            if($rootScope.cp_default == '0') {
                tt = `
                        <div class="play-type" ng-if="${isshow}">
                            <div class="t1 fl">
                                 <span class="tt"><a href="${link}">${$rootScope.GF}</a></span>
                            </div>
                           
                            <div class="t2 fl">
                                 <span class="main-w tt">${$rootScope.BY}</span>
                            </div>
                        </div>`
            }else {
                tt = `
                        <div class="play-type" ng-if="${isshow}">
                            <div class="t1 fl">
                                 <span class="main-w tt">${$rootScope.BY}</span>
                            </div>
                            <div class="t2 fl">
                                 <span class="tt"><a href="${link}">${$rootScope.GF}</a></span>
                            </div>
                        </div>`
            }
            if($rootScope.lottery_auth.indexOf('1,2') < 0) {
                tt = ''
            }
            let tpl = `
               <div class="play-btns">
                   ${tt}
                   <ul>
                       <li
                           ng-repeat="v in playlist.play"
                           ng-class="{true: 'active', false: ''}[v.id == onePlayId]"
                           ng-click="getBall(v.id, v.sname)">{{v.name}}
                       </li>
                   </ul>
               </div>`
            return Layer.popup({
                tpl: tpl,
                scope,
                cb: fn,
                style: {
                    maxWidth: '100%',
                    top: '2.2rem',
                    transform: 'translateY(0)'
                }
            })
        },
        showOpenlist: function (scope, fn) {
            return Layer.popup({
                tpl: `<div class="lottery-records open-list" ng-class="{'lhc-ol': type=='lhc'}">
                    <div class="row" ng-repeat="v in lottery_log[gid]">
                        <span class="issue">{{v.kj_issue}}期：</span>
                        <div class="divider" ></div>
                    <!--正常-->
                        <div class="item col-center main-w"
                            ng-repeat="cell in v.number track by $index" ng-if="type != 's_lhc' && type != 's_pk10' && type != 's_pcdd' && type != 's_k3'">
                            {{cell}}
                        </div>
                        <div class="item col-center open-win-ball-cell" codepk="{{cell}}"
                            ng-repeat="cell in v.number track by $index" ng-if="type == 's_pk10'">
                            {{cell}}
                        </div>
                        <div class="item col-center" ng-class="['k3-1', 'k3-2', 'k3-3', 'k3-4', 'k3-5','k3-6'][cell-1]"
                            ng-repeat="cell in v.number track by $index" ng-if="type == 's_k3'">
                        </div>
                     <!--PCDD   -->
                        <div class="i-block" ng-if="type == 's_pcdd'">
                            <div class="col-center flex-middle" ng-repeat="num in v.number track by $index">
                                <div class="item col-center main-w"
                                ng-if="$index !== 3">{{num}}
                                </div>
                                <div class="item col-center open-win-ball-cell"
                                     codepcdd="{{num}}"
                                     ng-if="$index === 3">{{num}}
                                </div>
                                <div  class="fs14 text-center bold"
                                      ng-if="$index == 0 || $index == 1"> + </div>
                                <div   class="fs14 text-center bold"
                                      ng-if="$index == 2"> = </div>
                            </div>
                        </div>
                  
                        <div ng-if="type == 's_lhc'">
                            <div class="item col-center" ng-repeat="cell in v.number track by $index">
                                <div class="symbol" ng-if="$index==6">+</div>
                                <div class="cell open-win-ball-cell" code="{{cell}}">
                                    {{cell}}
                                </div>
                                <div class="cell-sx fs14">{{v.shengxiao[$index]}}</div>
                            </div>
                        </div>
                    </div>
                </div>`,
                scope,
                cb: fn,
                style: {
                    maxWidth: '100%',
                    top: '6.2rem',
                    transform: 'translateY(0)'
                }
            })
        },
        dropMenu: function (scope, target) {
            const tpl = `
            <ul class="drop-menu pseudoClass radius5 fs14">
                <li class="text-left">
                    <a href="/trend/${scope.gid}/${scope.type}">
                        <span class="iconfont fs24">&#xe617;</span>
                        <span class="dm-text">走势图</span>
                    </a>
                </li>
                <li class="text-left">
                    <a ng-click="openLottery()">
                        <span class="iconfont fs24">&#xe612;</span>
                        <span class="dm-text">近期开奖</span>
                    </a>
                </li>
                <li class="text-left">
                    <a href="/tabs/order">
                        <span class="iconfont fs24">&#xe609;</span>
                        <span class="dm-text">购彩记录</span>
                    </a>
                </li>
                <li class="text-left">
                    <a href="/rule/${scope.type}">
                        <span class="iconfont fs20">&#xe61a;</span>
                        <span class="dm-text">玩法说明</span>
                    </a>
                </li>
            </ul>`

            let dm = Layer.popup({
                tpl,
                scope,
                style: {
                    top: 0
                }
            })

            $('.modal-overlay')
                .css({
                    height: 0,
                    width: '7.5rem',
                    left: 'auto',
                    right: 0
                })

            $(target).click(function () {
                if ($('.drop-menu').length) {
                    dm && dm.close()
                    dm = null
                }
            })

            return dm
        },
        getOpen: function (gid, S, needLoading) {
            S.lottery_log = S.lottery_log || {}
            S.lastest = S.lastest || {}
            return RS
                .getOpen(gid, needLoading)
                .then((c) => {
                    if (c.code == 200) {
                        c.data.rows.forEach((d, i) => {
                            c.data.rows[i].number = d.number.split(',')
                            if (S.type == 's_lhc') {
                                c.data.rows[i].shengxiao = d.shengxiao.split(',')
                                c.data.rows[i].color = d.color.split(',')
                            }
                        })
                        S.lottery_log[gid] = c.data.rows
                    }
                    return c
                })
        },
        initPage: function (S, flag) {
            RS.initPage(S.gid, flag)
                .then((c) => {
                    if (c.code == 200) {
                        $rootScope.topTitle = c.data.name
                        S.ctg = c.data.ctg
                        S.scCpType = c.data.type
                        S.show = c.data.show //默认玩法ID
                        S.playlist = c.data //玩法列表
                        if (S.show == 0) {
                            S.show = S.playlist.play[0].id
                        }
                        this.getPinfo(S.show, S) //查找默认玩法内容
                        this.getPros(S, flag) //获取球号
                    }
                })
        },
        getPinfo: function (id, S) {
            S.onePlayId = id
            $.each(S.playlist.play, function (i, d) {
                if (id == d.id) {
                    S.twoPlayId = id
                    S.playInfo = d
                    S.playInfo.bname = d.sname//大类英文标识
                    S.playInfo.atitle = d.name//购物车玩法名称
                    S.playInfo.cname = d.sname
                    S.playInfo.btitle = d.name//购物车玩法名称
                    S.playInfo.topTitle = d.name //顶部显示名
                    //console.log(S.playInfo)
                }
            })
        },
        setTmp: function (S, sname) {
            console.log(sname)
            if (S.type == 's_11x5') {
                if (sname) {
                    if (sname == 'rx' || sname == 'zx') {
                        S.tmp = 's_11x5/rx.tple.html'
                    } else if(sname == 'zhx') {
                        S.tmp = 's_11x5/zhx.tple.html'
                    }else {
                        S.tmp = 's_11x5/normal.tple.html'
                    }
                }
            }
        },
        ro (scope) {
            scope.service.randomOne(scope)
            scope.suData.sumbet = 1
            scope.suData.money = scope.suData.sumbet * scope.suData.txtmoney
        },
        getPros: function (S, flag) {
            RS.getProduct(S.gid, flag)
                .then((c) => {
                    if (c.code == 200) {
                        S.pros = c.data
                        S.lottery = c.data[S.show]
                        this.getConvertCell(S)
                        S.threePlayId = S.show
                    }
                })
        },
        getConvertCell: function (S, sname) {
            S.sname = sname
            let lottory = []
            for (let i = 0; i < S.playInfo.play.length; i++) {
                for (let key in S.pros) {
                    if (key == S.playInfo.play[i].id) {
                        if (sname == 'lma' || sname == 'rx' || sname == 'zx' || sname == 'zhx') {
                            var cell = {
                                name: S.playInfo.play[i].name,
                                balls: S.pros[key].balls,
                                rate: S.pros[key].rate,
                                rebate: S.pros[key].rebate
                            }
                        } else {
                            var cell = {
                                name: S.playInfo.play[i].name,
                                balls: S.pros[key].balls
                            }
                        }
                        lottory[i] = cell
                    }
                }
            }
            S.lottery = lottory
        },
        getBall: function (id, sname, S) {
            S.twoPlayId = id
            S.lottery = S.pros[id] //根据玩法查询球列表
            this.getPinfo(id, S)
            this.getConvertCell(S, sname)
            S.tid = id //玩法ID
            S.ssname = S.oneSname
            S.lastSname = sname
            S.suData.sumbet = 0
            S.suData.money = 0
            this.setTmp(S, sname)
            console.log(S.lottery)
            S.pl && S.pl.close()
        },

        /***********操作选号**********************/
        //后退
        goBack: function (scope) {
            DB.getData('carts', function (c) {
                if (scope.suData.sumbet || c) {
                    Layer.confirm({
                        title: '提示',
                        msg: '是否放弃所选号码?',
                        yesFn: function () {
                            DB.deleteOneData('carts', function () {
                                history.go(-1)
                            })
                        }
                    })
                } else {
                    history.go(-1)
                }
            })
        },
        selBalls(event, scope) {
            scope.suData.sumbet = scope.service.selBalls(event.target, scope.playInfo)
            scope.suData.money = scope.suData.sumbet * scope.suData.txtmoney
        },
        //选择
        addActive: function (pn, c) {
            var _ = $(pn)
            if (_.attr('code') == undefined) {
                _ = _.parent()
            }
            if (_.hasClass('active')) {
                _.removeClass('active')
                //_.addClass('main-color')
                return c ? c - 1 : c
            } else {
                _.removeClass('main-color')
                _.addClass('active')
                return c + 1
            }
        },
        arrBall: function () {
            var arr = []
            var e = $('.balls').find('.active')
            $.each(e, function (i, d) {
                arr.push($(d).attr('name'))
            })
            return arr
        },
        setRandom: function (r, n) {
            n = n == undefined ? 0 : n
            $('.balls div').removeClass('active')
            $.each(r, function (i, d) {
                if (d.length) {
                    $.each(d, function (ii, dd) {
                        $('.lot-wrap').find('.balls').find('span').eq(dd - n).parent('div').addClass('active')
                    })
                }
            })
        },
        clearItems: function (scope) {
            const self = this
            DB.getData('carts', function (c) {
                if (scope.suData.sumbet || c) {
                    const cf = Layer.confirm({
                        title: '提示',
                        msg: '是否放弃所选号码?',
                        yesFn: function () {
                            DB.deleteOneData('carts', function () {
                                cf.close()
                            })
                            scope.suData.sumbet = self.allClear()
                            scope.suData.money = 0
                        },
                        yesCd: 5
                    })
                }
            })
        },
        getCart: function (scope) {
            DB.getData('carts', function (c) {
                scope.carts = angular.fromJson(c)
            })
        },
        getKithe: function (gid, scope, needLoading) {
            scope.kithe = scope.kithe || {}
            scope.syTimeCc = scope.syTimeCc || {}
            scope.locks = scope.locks || {}
            return RS.getKithe(gid, needLoading)
                .then((c) => {
                    if (c.code == 200) {
                        if (c.data[0].is_open == 1) {
                            const dddd = c.data[0]
                            scope.kithe[gid] = {
                                number: dddd.number.split(','),
                                kithe: dddd.kithe,
                                kithe_time_second: dddd.kithe_time_second,
                                kithe_time_stamp: dddd.kithe_time_stamp,
                                up_close_time: dddd.up_close_time
                            }
                            scope.orderTitle = c.data[0].name
                            if(scope.locks[gid]) {
                                return
                            }
                            this.updateKithe(gid, scope)
                        } else {
                            scope.syTimeCc[gid] = '未开盘'
                        }
                    }
                })
        },
        timerCache: [],
        updateKithe: function (gid, scope) {
            const self = this
            const kithe = scope.kithe[gid]
            const start = function (m) {
                let str = Core.ShowCountDown(m)
                //  console.log('====>>> 倒计时监听')
                if (str != 'end') {
                    scope.syTimeCc && (scope.syTimeCc[gid] = str)
                    const _t = $timeout(function () {
                        start(m)
                        $timeout.cancel(_t)
                    }, 1000)
                    self.timerCache.push(_t)
                } else {
                    //开始重新查询结果的倒计时
                    const _t = $timeout(() => {
                        self.getKithe(gid, scope, false)
                        scope.locks[gid] = true
                        $timeout.cancel(_t)
                    }, kithe.up_close_time * 1000 * 1.5)
                    self.timerCache.push(_t)
                    //开始新一轮的数据请求
                    const t1 = $timeout(function() {
                        self.getKithe(gid, scope, false)
                        scope.locks[gid] = false
                    }, 5000)
                    self.timerCache.push(t1)
                    //开始新一轮的数据请求
                    const t2 = $timeout(function() {
                        self.getKithe(gid, scope, false)
                        scope.locks[gid] = true
                    }, 8000)
                    self.timerCache.push(t2)
                }
            }
            start(parseInt(new Date().getTime()) + kithe.kithe_time_second * 1000)
        },
        clearCds: function () {
            Util.clearCd(this.timerCache)
            this.timerCache = []
        },
        bet: function (scope) {
            if (scope.suData.sumbet <= 0) {
                scope.lr.toast('请选择球号')
                return false
            }
            if (!Core.getToken()) {
                $state.go('login', {ret: angular.toJson({url: scope.type, params: {type: scope.type, gid: scope.gid}})})
                return false
            }
            // //获取赔率
            // var rates = [], rates_min = []
            // scope.betType = 'one' //单注分开
            // var ee = $('.balls').eq(0).find('.active')
            // $.each(ee, function (i, d) {
            //     rates.push($(d).attr('rate'))
            //     rates_min.push($(d).attr('rate_min'))
            //     scope.rate.rebate = $(d).attr('rebate')
            // })
            // scope.rate.rate = rates.join()
            // scope.rate.rate_min = rates_min.join()
            this.betSubmit(scope, function () {
                //$state.go('cart', {gid: scope.gid})
                $state.go('cart', {gid: scope.gid, type: scope.type})
            })
        },
        //切换元角分
        unit: function () {
            return
        },
        //保存选择彩票到本地-
        saveBet: function (e, func) {
            var _ = this
            var ll = $('.balls').length
            DB.getData('carts', function (carts) {
                var betArr = carts == null ? [] : JSON.parse(carts)
                betArr = _.checkCart(e, betArr)
                if (e.betType == 'all') { //--组合
                    var a_pids = [], a_contents = [], a_names = [], rates = []
                    for (var i = 0; i < ll; i++) {
                        var ee = $('.balls').eq(i).find('.active')
                        var names = [], contents = [], pids = []
                        $.each(ee, function (i, d) {
                            var _ = $(d)
                            pids.push(_.attr('pid'))
                            contents.push(_.attr('code'))
                            names.push(_.attr('name'))
                            var rate = _.attr('rate')
                            if (rate != undefined && rate > 0) {
                                rates.push(rate)
                            }
                        })
                        a_pids.push(pids.join())
                        a_contents.push(contents.join())
                        a_names.push(names.join())
                    }
                    var bet = {
                        gid: e.gid,
                        tid: e.playInfo.id,
                        price: e.suData.txtmoney / e.suData.mtype,
                        counts: e.suData.sumbet,
                        price_sum: e.suData.txtmoney * e.suData.sumbet / e.suData.mtype,
                        rate: e.orate.join(),
                        rebate: e.rate.volume,
                        pids: a_pids.join('|'),
                        contents: a_contents.join('|'),
                        names: a_names.join('|'),
                        atitle: e.playInfo.atitle,
                        btitle: e.playInfo.btitle
                    }
                    betArr.push(bet)
                } else {//单注
                    for (var i = 0; i < ll; i++) {
                        var ee = $('.balls').eq(i).find('.active')
                        var bet = {}
                        $.each(ee, function (i, d) {
                            bet = {
                                gid: e.gid,
                                tid: e.playInfo.id,
                                price: e.suData.txtmoney / e.suData.mtype,
                                counts: 1,
                                price_sum: e.suData.txtmoney / e.suData.mtype,
                                rate: e.orate[i],
                                rebate: e.rate.volume,
                                pids: $(d).attr('pid'),
                                contents: $(d).attr('code'),
                                names: $(d).attr('name'),
                                atitle: e.playInfo.atitle,
                                btitle: e.playInfo.btitle
                            }
                            betArr.push(bet)
                        })
                    }
                }
                DB.saveData({key: 'carts', data: JSON.stringify(betArr)}, func())
            })
        },
        //删除购物车一项
        delItem: function (id, func) {
            DB.getData('carts', function (carts) {
                var betArr = carts == null ? [] : JSON.parse(carts)
                var newArr = [], total = 0, orderNum = 0
                $.each(betArr, function (i, d) {
                    if (id != i) {
                        newArr.push(d)
                        total += parseFloat(d.price_sum)
                        orderNum += parseInt(d.counts)
                    }
                })

                DB.saveData({key: 'carts', data: JSON.stringify(newArr)}, func(total, orderNum, newArr))
            })
        },

        oneSubmit: function (e, func) {
            const _this = this
            const ee = $('.balls').find('.active')
            let bet = {}
            DB.getData('carts', function(carts) {
                let betArr = carts == null ? [] : JSON.parse(carts)
                betArr = _this.checkCart(e, betArr)
                $.each(ee, function (i, d) {
                    bet = {
                        gid: e.gid,
                        tid: $(d).attr('tid'),
                        price: e.suData.txtmoney / e.suData.mtype,
                        counts: 1,
                        price_sum: e.suData.txtmoney / e.suData.mtype,
                        rate: $(d).attr('rate'),
                        rebate: $(d).attr('rebate'),
                        pids: $(d).attr('pid'),
                        contents: $(d).attr('code'),
                        names: $(d).attr('name'),
                        atitle: e.playInfo.atitle,
                        btitle: $(d).attr('btitle')
                    }
                    betArr.push(bet)
                })
                console.log(betArr)
                DB.saveData({key: 'carts', data: JSON.stringify(betArr)}, func)
            })
        },
        // 11x5任选、组选
        rxSubmit: function (e, func, num, plus, flag = false) {
            const _this = this
            const count = e.sname == 'lma' ? e.suData.sumbet : 1
            let ee, bet, tid, rate, rebate, btitle, names, contents, pids
            DB.getData('carts', function(carts) {
                let betArr = carts == null ? [] : JSON.parse(carts)
                betArr = _this.checkCart(e, betArr)
                for (let i = 0; i < num; i++) {
                    ee = $('.balls').eq(i).find('.active')
                    names = []
                    contents = []
                    pids = []
                    if (ee.length == i + plus || flag) {
                        $.each(ee, function (i, d) {
                            tid = $(d).attr('tid')
                            rate = $(d).attr('rate')
                            rebate = $(d).attr('rebate')
                            btitle = $(d).attr('btitle')
                            pids.push($(d).attr('pid'))
                            contents.push($(d).attr('code'))
                            names.push($(d).attr('name'))
                        })
                        bet = {
                            gid: e.gid,
                            tid: tid,
                            price: e.suData.txtmoney / e.suData.mtype,
                            counts: count,
                            price_sum: e.suData.txtmoney / e.suData.mtype * count,
                            rate: rate,
                            rebate: rebate,
                            pids: pids.join(','),
                            contents: contents.join(','),
                            names: names.join(','),
                            atitle: e.playInfo.atitle,
                            btitle: btitle
                        }
                        betArr.push(bet)
                    }
                }
                console.log(betArr)
                DB.saveData({key: 'carts', data: JSON.stringify(betArr)}, func)
            })
        },
        // 11x5直选
        zhxSubmit: function (e, func) {
            const _this = this
            let bet
            const ee1 = $('.balls').eq(0).find('.active')
            const ee2 = $('.balls').eq(1).find('.active')
            const ee3 = $('.balls').eq(2).find('.active')
            const ee4 = $('.balls').eq(3).find('.active')
            const ee5 = $('.balls').eq(4).find('.active')
            DB.getData('carts', function(carts) {
                let betArr = carts == null ? [] : JSON.parse(carts)
                betArr = _this.checkCart(e, betArr)
                if (ee1.length == 1 && ee2.length == 1) {
                    bet = {
                        gid: e.gid,
                        tid: $(ee1).attr('tid'),
                        price: e.suData.txtmoney / e.suData.mtype,
                        counts: 1,
                        price_sum: e.suData.txtmoney / e.suData.mtype,
                        rate: $(ee1).attr('rate'),
                        rebate: $(ee1).attr('rebate'),
                        pids: $(ee1).attr('pid') + '|' + $(ee2).attr('pid'),
                        contents: $(ee1).attr('code') + '|' + $(ee2).attr('code'),
                        names: $(ee1).attr('name') + '|' + $(ee2).attr('name'),
                        atitle: e.playInfo.atitle,
                        btitle: $(ee1).attr('btitle')
                    }
                    betArr.push(bet)
                }
                if (ee3.length == 1 && ee4.length == 1 && ee5.length == 1) {
                    bet = {
                        gid: e.gid,
                        tid: $(ee3).attr('tid'),
                        price: e.suData.txtmoney / e.suData.mtype,
                        counts: 1,
                        price_sum: e.suData.txtmoney / e.suData.mtype,
                        rate: $(ee3).attr('rate'),
                        rebate: $(ee3).attr('rebate'),
                        pids: $(ee3).attr('pid') + '|' + $(ee4).attr('pid') + '|' + $(ee5).attr('pid'),
                        contents: $(ee3).attr('code') + '|' + $(ee4).attr('code') + '|' + $(ee5).attr('code'),
                        names: $(ee3).attr('name') + '|' + $(ee4).attr('name') + '|' + $(ee5).attr('name'),
                        atitle: e.playInfo.atitle,
                        btitle: $(ee3).attr('btitle')
                    }
                    betArr.push(bet)
                }
                console.log(betArr)
                DB.saveData({key: 'carts', data: JSON.stringify(betArr)}, func)
            })
        },
        //提交到下注接口
        betSubmit: function (scope, func) {
            if (scope.type == 's_11x5' && scope.sname == 'rx') {
                this.rxSubmit(scope, func, 8, 1)
            } else if (scope.type == 's_11x5' && scope.sname == 'zx') {
                this.rxSubmit(scope, func, 2, 2)
            } else if (scope.type == 's_11x5' && scope.sname == 'zhx') {
                this.zhxSubmit(scope, func)
            } else if (scope.type == 's_kl10' && scope.sname == 'lma') {
                this.rxSubmit(scope, func, 1, 0, true)
            } else {
                this.oneSubmit(scope, func)
            }
        },
        checkCart: function (e, betArr) {
            if (betArr[0] != undefined && betArr[0].gid != e.gid) {
                return []
            }
            return betArr
        },
        //全清
        allClear: function () {
            $('.balls .s-ball-no').removeClass('active')
            $('.balls .s-block-no').removeClass('active')
            // $('.balls span').addClass('main-color')
            return 0
        },
        showTips: function(scope) {
            if(scope.ctg === 'sc') {
                $state.go('rule', {type: scope.type})
                return
            }
            // if(scope.type == 'pcdd' || scope.type == 'lhc') {
            //     $state.go('rule', {type: scope.type})
            //     return
            // }
            this.getTip(scope.tid || scope.show)
                .then((json) => {
                    if(json.code ==200 && json.data.rows) {
                        var _data = json.data.rows
                        scope.rules = [{
                            title: '玩法提示',
                            content: _data[0]
                        }, {
                            title: '中奖说明',
                            content: _data[1]
                        }, {
                            title: '范例',
                            content: _data[2] + _data[3]
                        }]
                    }
                })
                .then(() => {
                    Layer.popup({
                        tpl: `<div class="desc-wrap">
                            <div class="desc-item" ng-repeat="rule in rules">
                                <div class="desc-item-head">{{rule.title}}</div>
                                <div class="desc-item-content">{{rule.content}}</div>
                            </div>
                        </div>`,
                        style: {
                            width: `${325/375*100}%`,
                            fontSize: '0.7rem'
                        },
                        scope,
                        clazz: 'tip-wrap'
                    })
                })
        },

        getTip(tid) {
            return RS.getTip(tid)
        }
    }
}
