import angular from 'angular'
/***********购彩公用方法**********************/
import $ from 'zepto'
export const Lottery = function (Core, Layer, RS, DB, $timeout, Util, $state, $rootScope, $interval, $location) {
    return {
        showPlaylist: function(scope, fn, p3) {
            let tpl
           /* if(scope.type == 'yb') {
                tpl = `<div class="playdialog">
                    <div class="left fl">
                        <ul>
                            <li ng-repeat="v in playlist.play"
                                ng-class="{true:'active',false:''}[v.id==onePlayId]"
                                ng-click="getPlay(v.id)">{{v.name}}
                            </li>
                        </ul>
                    </div>
                    <div class="center fl">
                      <ul>
                          <li ng-repeat="v in p2"
                            twoId="{{v.id}}"
                            ng-class="{true:'active',false:''}[v.id==twoPlayId]"
                            ng-click="get2Play(v.id,v.sname)">{{v.name}}</li>
                      </ul>
                    </div>
                    <div class="right fl">
                        <ul>
                            <li ng-repeat="v in p3"
                                ng-class="{true:'active',false:''}[v.id==threePlayId]"
                                ng-click="getBall(v.id,v.sname)">{{v.name}}</li>
                        </ul>
                    </div>
                </div>`
            } else */if (scope.type == 'ssc' || scope.type == 'pk10' || scope.type == '11x5' || scope.type == 'k3' || scope.type == 'yb') {
                const link = scope.playlist.aid>0 ? `s_${scope.type}/s_${scope.type}/${scope.playlist.aid}` : '#'
                const isshow = scope.playlist.aid>0
                let tt = ''
                if($rootScope.cp_default == '0') {
                    tt = `
                        <div class="play-type" ng-if="${isshow}">
                            <div class="t1 fl">
                                 <span class="main-w tt">${$rootScope.GF}</span>
                            </div>
                           
                            <div class="t2 fl">
                                 <span class="tt"><a href="${link}">${$rootScope.BY}</a></span>
                            </div>
                        </div>`
                }else {
                    tt = `
                        <div class="play-type" ng-if="${isshow}">
                            <div class="t1 fl">
                                 <span class="tt"><a href="${link}">${$rootScope.BY}</a></span>
                            </div>
                            <div class="t2 fl">
                                 <span class="main-w tt">${$rootScope.GF}</span>
                            </div>
                        </div>`
                }
                if($rootScope.lottery_auth.indexOf('1,2') < 0) {
                    tt = ''
                }
                tpl = `
                    <div class="new-play-btns ${scope.type}-play">
                    ${tt}
                    <div class="clearfix"></div>
                    <ul>
                        <li ng-repeat="v in playlist.play"
                            ng-class="{true: 'setBtnBgColor border-color', false: ''}[v.id == onePlayId]"
                            ng-click="getPlay(v.id)"
                        >
                            {{v.name}}
                        </li>
                        <div class="clearfix"></div>
                    </ul>
                    
                    <div class="twoplay">
                        <div class="tplist" ng-repeat="v in p2">
                            <div class="fl l1"></div>
                            <div class="b-order fl">
                                <div class="fl l">{{v.name}}</div>
                                <div class="fl r">
                                    <ul>
                                        <li ng-repeat="i in v.play"
                                            ng-class="{true:'active border-color',false:''}[i.id==threePlayId]"
                                            ng-click="getBall(i.id,i.sname)"
                                            >{{i.name}}
                                        </li>
                                    </ul>
                                </div>
                            </div>
                            <div class="clearfix"></div>
                        </div>
                       
                    </div>
                </div>`
            } else if (scope.type == 'pcdd' || scope.type == 'lhc') {
                tpl = `
                <div class="play-btns ${scope.type}-play">
                    <ul>
                        <li ng-repeat="v in playlist.play"
                            ng-class="{true: 'active border-color', false: ''}[v.id == onePlayId]"
                            ng-click="getBall(v.id)"
                        >
                            {{v.name}}
                        </li>
                    </ul>
                </div>`
            } else {
                tpl = `
                <div class="playdialog">
                    <div class="left fl">
                        <ul>
                            <li ng-repeat="v in playlist.play"
                                ng-class="{true:'active',false:''}[v.id==onePlayId]" ng-click="getPlay(v.id)">{{v.name}}
                            </li>
                        </ul>
                    </div>
                    <div class="center fl">
                        <ul>
                            <li ng-repeat="v in p2" ng-class="{true:'active',false:''}[v.id==twoPlayId]" ng-click="getBall(v.id,v.sname)">{{v.name}}</li>
                        </ul>
                    </div>
                    <div class="right fl">
                        <ul>
                        ${
                    p3 === true ?
                        '<li ng-repeat="v in p3" ng-class="{true:\'active\', false: \'\'}[v.id==threePlayId]" ng-click="getBall(v.id,v.sname)">{{v.name}}</li>':
                        ''
                    }
                        </ul>
                    </div>
                </div>`
            }
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
        showOpenlist: function(scope, fn) {
            return Layer.popup({
                tpl: `<div class="lottery-records open-list" ng-class="{'lhc-ol': type=='lhc'}">
                    <div class="row" ng-repeat="v in lottery_log[gid]">
                        <span class="issue">{{v.kj_issue}}期：</span>
                        <div class="divider" ></div>
                        <div class="item col-center main-w"
                            ng-repeat="cell in v.number track by $index" ng-if="type != 'lhc' && type != 'pk10' && type != 'pcdd' && type != 'k3'">
                            {{cell}}
                        </div>
                        <div class="item col-center open-win-ball-cell" codepk="{{cell}}"
                            ng-repeat="cell in v.number track by $index" ng-if="type == 'pk10'">
                            {{cell}}
                        </div>
                        <div class="item col-center" ng-class="['k3-1', 'k3-2', 'k3-3', 'k3-4', 'k3-5','k3-6'][cell-1]"
                            ng-repeat="cell in v.number track by $index" ng-if="type == 'k3'">
                        </div>
                     <!--PCDD   -->
                        <div class="i-block" ng-if="type == 'pcdd'">
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
                  
                        <div ng-if="type == 'lhc'">
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
        betSet: function(scope, fn) {
            const tpl = `
            <div class="bet-set">
                <div class="row2">
                    <div class="rowitem" ng-show="rateNum">
                        <span class="win-text fl">赔率：</span>
                        <span class="win-text warn-color">{{rateNum?rateNum:''}}</span>
                    </div>
                    <div class="rowitem fl">
                        <span class="win-text fl">返利：</span>
                        <span class="win-text warn-color">{{rate.volume}}%</span>
                    </div>
                </div>

                <div class="range range-dark">
                    <input type="range" name="volume" min="0" max="{{rate.rebate}}" step="0.1" ng-model="rate.volume">
                </div>
                <div class="pad container" ng-show="!rateNum">
                    <p ng-repeat="v in orate track by $index" class="fs12 fl over mg-rate">{{v}}</p>
                </div>
                <div class="row2">
                    <div class="rowitem">
                        <span class="win-text fl">单注金额</span>
                        <input min="1" maxlength="5" type="tel" class="money fl mText" ng-model="suData.txtmoney" onkeyup="value=value.replace(/[^\\d{1,}\\.\\d{1,}|\\d{1,}]|^0{1,}\\d{1,}|[\\,,\\|,\\{,\\}]{1,}/g,'')">
                        <div class="unit fl fs14" ng-class="{true:'main-w'}[moneytype=='y']" ng-click="unit('y')">元</div>
                        <div class="unit fl fs14" ng-class="{true:'main-w'}[moneytype=='j']" ng-click="unit('j')">角</div>
                        <div class="unit fl fs14" ng-class="{true:'main-w'}[moneytype=='f']" ng-click="unit('f')">分</div>
                    </div>
                </div>
                <div class="row2">
                    <div class="rowitem">
                        <span class="win-text fl">总额：</span>
                        <span class="win-text fs18 fl" ng-bind="suData.sumbet*suData.txtmoney/suData.mtype"></span>
                        <span class="win-text">元</span>
                    </div>
                    <div class="rowitem">
                        <span class="win-text fl">注数：</span>
                        <span class="win-text fs18 fl" ng-bind="suData.sumbet"></span>
                        <span class="win-text">注</span>
                    </div>
                </div>
                <div class="row2">
                    <div class="row">
                        <span class="win-text">若中奖，单注最高中：</span>
                        <span class="win-text fs18">{{suData.txtmoney*(orate[0])/suData.mtype  | number:2}}</span>
                        <span class="win-text">元</span>
                    </div>
                </div>
            </div>`
            return Layer.popupForm({
                tpl,
                scope,
                confirm: fn,
                title: '注单设定'
            })
        },
        dropMenu: function(scope) {
            const tpl = `
            <ul class="drop-menu pseudoClass radius5 fs14">
                <li class="text-left">
                    <a href=/trend/${scope.gid}/${scope.type}>
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
                        <span class="iconfont fs24">&#xe61a;</span>
                        <span class="dm-text">玩法说明</span>
                    </a>
                </li>
            </ul>`

            let dm = Layer.popup({
                tpl,
                scope,
                style: {
                    top: 0
                },
                clazz: 'dm-wrap'
            })

            return dm
        },
        getOpen: function(gid, S, needLoading) {
            const _this = this
            S.lottery_log = S.lottery_log || {}
            S.lastest = S.lastest || {}
            return RS.getOpen(gid, needLoading)
                .then((c) => {
                    if (c.code == 200) {
                        c.data.rows.forEach((d, i) => {
                            c.data.rows[i].number = d.number.split(',')
                            if(S.type == 'lhc') {
                                c.data.rows[i].shengxiao = d.shengxiao != undefined ? d.shengxiao.split(',') : []
                                c.data.rows[i].color = d.color != undefined ? d.color.split(',') : []
                            }else if(S.type == 'pcdd') {
                                c.data.rows[i].number = _this.collectBall(c.data.rows[i].number)
                            }
                        })
                        S.lottery_log[gid] = c.data.rows
                    }
                    return c
                })
        },
        initPage: function(S, flag) {
            RS.initPage(S.gid, flag)
                .then((c) => {
                    if (c.code == 200) {
                        let info = c.data
                        $rootScope.topTitle = info.name
                        S.show = info.show
                        S.playlist = info //玩法列表
                        if(S.type == 'pcdd' || S.type == 'yb' || S.type == 'lhc') {
                            S.service.getPinfo(S, S.show)
                            S.service.getPros(S, flag)
                        } else {
                            this.getPinfo(S.show, S) //查找默认玩法内容
                            this.getPros(S, flag)//获取球号
                        }
                    }
                })
        },
        getPinfo: function(id, S) {
            if(sessionStorage.getItem('playInfo')) {
                console.log(sessionStorage.getItem('playInfo'))
                S.playInfo = JSON.parse(sessionStorage.getItem('playInfo'))
                S.gid = S.playInfo.gid
                S.show = S.playInfo.id
                sessionStorage.removeItem('playInfo')
                console.log(S.playInfo.sname)
                this.setTmp(S, S.playInfo.sname, S.playInfo)
                return
            }
            $.each(S.playlist.play, (i, d) => {
                $.each(d.play, (ii, dd) => {
                    if(dd.play == undefined) {
                        if(id == dd.id) { //没有二级三级
                            S.playInfo = dd
                            S.playInfo.bname = d.sname//大类英文标识
                            S.playInfo.atitle = d.name//购物车玩法名称
                            S.playInfo.cname = dd.sname
                            S.playInfo.btitle = d.name //购物车玩法名称
                            S.playInfo.topTitle = d.name //顶部显示名称
                            this.setTmp(S, d.sname, dd)
                            return false
                        }
                    } else {
                        $.each(dd.play, function(iii, ddd) {
                            if(id == ddd.id) {
                                S.playInfo = ddd
                                S.playInfo.bname = d.sname
                                S.playInfo.atitle = d.name
                                S.playInfo.cname = dd.sname
                                S.playInfo.btitle = ddd.name
                                S.playInfo.topTitle = d.name //顶部显示名称
                                console.log(S.playInfo)
                                return false
                            }
                        })
                    }
                })
            })
        },
        setTmp: function(S, sname, dd) {
            if(S.type == 'pk10') {
                if(dd) {
                    if (dd.sname == 'dx' || dd.sname == 'ds') {
                        S.tmp = 'pk10/dxds.tple.html'
                    } else {
                        S.tmp = 'pk10/xx.tple.html'
                    }
                }


                if(sname) {
                    if (sname == 'd1' || sname == 'd2' || sname == 'd3') {
                        S.tmp = 'pk10/dxds.tple.html'
                    } else {
                        S.tmp = 'pk10/xx.tple.html'
                    }
                }
            }

            if(S.type == 'ssc') {
                if(dd && dd.sname == 'hz') {
                    S.tmp = 'ssc/hz.tple.html'
                } else {
                    S.tmp = 'ssc/xx.tple.html'
                }

                if(sname) {
                    if(sname == 'zxhz') {
                        S.tmp = 'ssc/hz.tple.html'
                    }else{
                        S.tmp = 'ssc/xx.tple.html'
                    }
                }
            }

            if(S.type == 'k3') {
                if(dd && dd.sname=='hz') {
                    S.tmp = 'k3/hz.tple.html'
                } else {
                    S.tmp = 'k3/xx.tple.html'
                }

                if(sname) {
                    if(sname == 'hz') {
                        S.tmp = 'k3/hz.tple.html'
                    }else{
                        S.tmp = 'k3/xx.tple.html'
                    }
                }
            }
        },
        getPros: function(S, flag) {
            RS.getProduct(S.gid, flag)
                .then((c) => {
                    if (c.code == 200) {
                        S.pros=c.data
                        S.lottery=c.data[S.show]
                        S.rate = {
                            rate: S.lottery.rate,
                            rate_min: S.lottery.rate_min,
                            rebate: S.lottery.rebate,
                            volume: 0
                        }
                        this.getPlay(S.playInfo.pid, S)
                        S.threePlayId = S.show
                        S.lastSname = S.playInfo.sname
                    }
                })
        },
        //第一级玩法联动
        getPlay: function(pid, S) {
            S.onePlayId = pid
            /*$.each(S.playlist.play, (i, d) => {
                if(pid == d.id) {
                    S.p2 = d.play
                    S.oneSname = d.sname
                    this.get2Play4Ssc(d.play[0].id, d.play[0].sname, 1, S)

                    return false
                }
            })*/
            $.each(S.playlist.play, (i, d) => {
                if (pid == d.id) {
                    //this.get2Play4Ssc(d.play[0].id, d.play[0].sname, 1, S)
                    S.oneSname = d.sname
                    if (d.play[0].play == undefined && d.sname !== 'tmab') {
                        S.p2 = {d}
                    } else {
                        S.p2 = d.play
                    }
                    //快三
                    if (S.oneSname == '2th') {
                        var tmp = S.p2[1]
                        S.p2[1].play = {tmp}
                    }
                    return
                }
            })
        },
        //第二级玩法联动 时时彩
        get2Play4Ssc: function(tid, sname, t, S) {
            S.twoPlayId = tid
            $.each(S.p2, (i, d) => {
                if(tid == d.id) {
                    S.twoSname = d.sname
                    S.p3 = d.play
                    if(S.p3 == undefined) {
                        if( t!=1 ) {this.getBall(tid, sname, S)}
                    }
                    return false
                }
            })
        },
        get2Play: function(tid, S) {
            $.each(S.p2, (i, d) => {
                if(tid == d.id) {
                    S.twoSname = d.sname
                    S.p3 = d.play
                    if(S.p3 == undefined) {
                        S.p3 = S.p2
                    }
                    S.threePlayId = ''
                    return false
                }
            })
        },
        getBall: function (id, sname, S) {
            if(S.type == 'ssc' || S.type == 'yb') {
                S.threePlayId = id
            } else {
                S.twoPlayId = id
            }

            S.lottery = S.pros[id] //根据玩法查询球列表
            S.rate = {
                rate: S.lottery.rate,
                rate_min: S.lottery.rate_min,
                rebate: S.lottery.rebate,
                volume: 0
            }
            if(S.type!= 'yb') {
                this.getPinfo(id, S)
            } else {
                S.service.getPinfo(S, id)
            }
            S.tid = id //玩法ID
            S.ssname = S.oneSname
            S.lastSname = sname
            S.suData.sumbet = 0
            S.suData.money = 0
            this.setTmp(S, sname)

            S.pl && S.pl.close()
        },

        /***********操作选号**********************/
        toolOper: function(target, scope, fn) {
            scope.suData.sumbet = this[fn](target, scope.playInfo, scope.service, scope.type)
            scope.suData.money = scope.suData.sumbet * scope.suData.txtmoney
        },
        tq (event, scope) {
            this.toolOper(event.target, scope, 'toolQuan')
        },

        td (event, scope) {
            this.toolOper(event.target, scope, 'toolDa')
        },

        tx (event, scope) {
            this.toolOper(event.target, scope, 'toolXiao')
        },

        tDan (event, scope) {
            this.toolOper(event.target, scope, 'toolDan')
        },

        ts (event, scope) {
            this.toolOper(event.target, scope, 'toolShuang')
        },

        tc (event, scope) {
            this.toolOper(event.target, scope, 'toolClear')
        },
        ro (scope) {
            scope.service.randomOne(scope)
            scope.suData.sumbet = scope.service.countNum(scope.playInfo)
            scope.suData.money = scope.suData.sumbet * scope.suData.txtmoney
        },
        //全选
        toolQuan: function (pn, e, service) {
            var _ = $(pn)
            _.parent().parent().parent().find('li>span').addClass('active')
            return service.countNum(e)
        },
        //工具类
        tools: function (pn, e, arr, service) {
            var _ = $(pn).parent().parent().parent().find('li>span')
            _.removeClass('active')
            for (let i = 0; i < arr.length; i++) {
                _.eq(arr[i]).addClass('active')
            }
            return service.countNum(e)
        },
        //大
        toolDa: function (pn, e, service) {
            var arr = [5, 6, 7, 8, 9]
            return this.tools(pn, e, arr, service)
        },
        //小
        toolXiao: function (pn, e, service) {
            var arr = [0, 1, 2, 3, 4]
            return this.tools(pn, e, arr, service)
        },
        //单
        toolDan: function (pn, e, service, type) {
            var arr = type == 'ssc' || type == 'yb' ? [1, 3, 5, 7, 9] : [0, 2, 4, 6, 8]
            return this.tools(pn, e, arr, service)
        },
        //双
        toolShuang: function (pn, e, service, type) {
            var arr = type != 'ssc' && type != 'yb' ? [1, 3, 5, 7, 9] : [0, 2, 4, 6, 8]
            return this.tools(pn, e, arr, service)
        },
        //清
        toolClear: function (pn, e, service) {
            var arr = []
            return this.tools(pn, e, arr, service)
        },
        //全清
        allClear: function () {
            $('.balls span').removeClass('active')
            return 0
        },

        //后退
        goBack: function(scope) {
            DB.getData('carts', function(c) {
                if(scope.suData.sumbet || c) {
                    Layer.confirm({
                        title: '提示',
                        msg: '是否放弃所选号码?',
                        yesFn: function() {
                            DB.deleteOneData('carts', function() {
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
                return c ? c - 1 : c
            } else {
                _.addClass('active')
                return c + 1
            }
        },
        arrBall: function (v) {
            var arr = []
            var e = $('.balls').eq(v).find('.active')
            $.each(e, function (i, d) {
                arr.push($(d).attr('name'))
            })
            return arr
        },
        setRandom: function (r, n) {
            n = n == undefined ? 0 : n
            $('.balls span').removeClass('active')
            $.each(r, function (i, d) {
                if (d.length) {
                    $.each(d, function (ii, dd) {
                        $('.lot-wrap').find('.lot-number-wrap').eq(i).find('.balls').find('span').eq(dd - n).addClass('active')
                    })
                }
            })
        },
        clearItems: function(scope) {
            const self = this
            DB.getData('carts', function(c) {
                if(scope.suData.sumbet || c) {
                    const cf = Layer.confirm({
                        title: '提示',
                        msg: '是否放弃所选号码?',
                        yesFn: function() {
                            DB.deleteOneData('carts', function() {
                                cf.close()
                            })
                            scope.suData.sumbet = self.allClear()
                            scope.suData.money=0
                        },
                        yesCd: 5
                    })
                }
            })
        },
        getCart: function(scope) {
            DB.getData('carts', function(c) {
                scope.carts = angular.fromJson(c)
            })
        },
        //添加PC蛋蛋最后一个球
        collectBall(arr) {
            if(!Array.isArray(arr) && typeof arr != 'string') {
                return
            }
            if(typeof arr == 'string') {
                arr = arr.split(',')
            }
            arr = arr.map((v) => v*1)
            arr.push(arr.reduce((prev, cur) => {
                return prev + cur
            }))
            return arr
        },
        getKithe: function(gid, scope, needLoading, ss) {
            self.lay = ''
            const _this = this
            scope.kithe = scope.kithe || {}
            scope.syTimeCc = scope.syTimeCc || {}
            scope.locks = scope.locks || {}
            return RS.getKithe(gid, needLoading)
                .then((c) => {
                    if (c.code == 200) {
                        if(c.data[0].is_open == 1) {
                            const dddd = c.data[0]
                            let numbers = dddd.number.split(',')
                            if(dddd.tmp == 'pcdd') {
                                numbers = _this.collectBall(numbers)
                            }
                            scope.kithe[gid] = {
                                number: numbers,
                                kithe: dddd.kithe,
                                kithe_time_second: dddd.kithe_time_second,
                                kithe_time_stamp: dddd.kithe_time_stamp,
                                up_close_time: dddd.up_close_time,
                                kj_issue: dddd.kj_issue
                            }
                            console.log(scope.kithe[gid].number.length)
                            if((scope.kithe[gid].kithe - 1) != scope.kithe[gid].kj_issue || scope.kithe[gid].number.length<1) {
                                scope.kithe[gid].number = '正在开奖'
                            }
                            scope.orderTitle = c.data[0].name
                            if(scope.locks[gid]) {
                                return
                            }
                            if(ss != 'no') {
                                this.updateKithe(gid, scope, needLoading)
                            }
                        } else {
                            const dddd = c.data[0]
                            scope.kithe[gid] = {
                                number: dddd.number.split(','),
                                kithe: dddd.kithe
                            }
                            if((scope.kithe[gid].kithe - 1) != scope.kithe[gid].kj_issue || scope.kithe[gid].number.length<1) {
                                scope.kithe[gid].number = '正在开奖'
                            }
                            scope.syTimeCc[gid] = '未开盘'
                        }
                    }
                })
        },
        timerCache: [],
        openTimer: '',
        updateKithe: function(gid, scope, tt) {
            console.log(tt)
            const self = this
            const kithe = scope.kithe[gid]

            const start = function(m) {
                let str = Core.ShowCountDown(m)
                if(str != 'end') {
                    scope.syTimeCc && (scope.syTimeCc[gid] = str)
                    const _t = $timeout(function() {
                        start(m)
                        $timeout.cancel(_t)
                    }, 1000)
                    self.timerCache.push(_t)
                } else {
                    /*self.opening = $interval(function() {
                        let sj = []
                        angular.forEach(scope.kithe[gid].number, function () {
                            sj.push(Math.floor(Math.random() * 9))
                        })
                        scope.kithe[gid].number = ''
                        scope.kithe[gid].number = sj
                    }, 100)*/
                    if($location.url()!='/tabs/buy/') {
                        self.lay = Layer.confirm({
                            title: '提示',
                            msg: '当期已结束,是否要清除投注内容',
                            cancelText: '取消',
                            yesText: '确定',
                            yesFn: () => {
                                self.allClear()
                            }
                        })
                    }
                    scope.kithe[gid].number='正在开奖'
                    //开始重新查询结果的倒计时
                    const _t = $timeout( () => {
                        self.getKithe(gid, scope, false)
                        scope.locks[gid] = false
                        $timeout.cancel(_t)
                    }, 1000 * 1.5)
                    self.timerCache.push(_t)
                    //开始新一轮的数据请求
                    $interval.cancel(self.openTimer)
                    //if(tt != false) {
                    self.ttt = $timeout( () => {
                        self.openTimer = $interval(function () {
                            //刷新近期开奖
                            //self.getOpen(gid, scope, false)
                            self.getKithe(gid, scope, false, 'no')
                            if ((scope.kithe[gid].kithe - 1) == scope.kithe[gid].kj_issue && scope.kithe[gid].number != '正在开奖') {
                                $interval.cancel(self.openTimer)
                                $interval.cancel(self.opening)
                                self.getKithe(gid, scope, false, 'no')
                            }
                        }, 2 * 1000)
                    }, 5000)
                    //}
                }
            }
            start(parseInt(new Date().getTime()) + kithe.kithe_time_second * 1000)
        },
        clearCds: function() {
            Util.clearCd(this.timerCache)
            this.timerCache = []
            $interval.cancel(this.openTimer)
            $timeout.cancel(self.ttt)
            if(self.lay) {
                self.lay.close()
            }
        },
        //handleVolume
        hv(val) {
            let max = $('input[name="volume"]').attr('max')
            max = Number(max)
            let _percent = val / max * 100
            _percent = _percent == 0 ? _percent : _percent.toFixed(2)
            if($('#rangeStyle').length) {
                $('#rangeStyle').text(`
                    .range input::-webkit-slider-runnable-track {
                        background:linear-gradient(to right, #AC0D18 0%, #AC0D18 ${_percent}%,#ccc ${_percent}%, #ccc);
                        background-position: center;
                        background-size: 100% 2px;
                        background-repeat: no-repeat;
                        -webkit-appearance: none;
                    }
                `)
            } else {
                $(document.body).append(`
                    <style id="rangeStyle">
                    </style>
                `)
            }
        },
        bet: function (scope) {
            if(scope.suData.sumbet <= 0 ) {
                scope.lr.toast('请选择球号')
                return false
            }
            if(!Core.getToken()) {
                $state.go('login', { ret: angular.toJson({url: scope.type, params: {type: scope.type, gid: scope.gid}})})
                return false
            }
            console.log(scope.playInfo.play)
            //缓存playInfo
            delete scope.playInfo.play
            sessionStorage.setItem('playInfo', JSON.stringify(scope.playInfo))
            //获取赔率
            //下注方式默认组合
            scope.betType = 'all'
            var rates=[], rates_min=[]
            const flag = scope.type == 'k3' ? scope.playInfo.cname == 'hz' : scope.rate.rate == undefined
            if(flag) {//如果获取不到父级赔率则取本身赔率
                scope.betType = 'one' //单注分开
                var ee = $('.balls').eq(0).find('.active')
                $.each(ee, function(i, d) {
                    rates.push($(d).attr('rate'))
                    rates_min.push($(d).attr('rate_min'))
                    scope.rate.rebate = $(d).attr('rebate')
                })
                scope.rate.rate = rates.join()
                scope.rate.rate_min = rates_min.join()
            }

            scope.$watch('rate.volume', (newval) => {
                var arr = scope.rate.rate.split(',')
                var arrmin = scope.rate.rate_min.split(',')
                scope.orate = []
                for(var i=0; i < arr.length; i++) {
                    if(scope.rate.rebate == 0) {
                        scope.orate[i] = arr[i] - scope.rate.volume * (arr[i] - arrmin[i])
                    }else {
                        scope.orate[i] = arr[i] - scope.rate.volume * (arr[i] - arrmin[i])/scope.rate.rebate
                    }
                    scope.orate[i] = scope.orate[i].toFixed(3)
                }
                scope.rateNum = arr.length == 1 ? scope.orate[0] : false
                scope.luckey = 0

                this.hv(newval)
            })

            this.betSet(scope, () => {
                if(scope.suData.txtmoney <= 0) {
                    Layer.toast('请输入金额')
                    return false
                }
                /*******indexDB***********/
                this.saveBet(scope, function() {
                    $state.go('cart', {gid: scope.gid, type: scope.type})
                })
            })
        },
        //切换元角分
        unit: function(scope, t) {
            if(t =='y') {
                scope.suData.mtype = 1
                scope.moneytype = 'y'
                scope.suData.money = scope.suData.sumbet * scope.suData.txtmoney
            } else if (t == 'j') {
                scope.suData.mtype = 10
                scope.moneytype = 'j'
                scope.suData.money = scope.suData.sumbet * scope.suData.txtmoney / 10
            } else if (t == 'f') {
                scope.suData.mtype = 100
                scope.moneytype = 'f'
                scope.suData.money = scope.suData.sumbet * scope.suData.txtmoney / 100
            }
        },
        //保存选择彩票到本地-
        saveBet: function (e, func) {
            var _ = this
            var ll = $('.balls').length
            DB.getData('carts', function(carts) {
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
            DB.getData('carts', function(carts) {
                var betArr = carts == null ? [] : JSON.parse(carts)
                var newArr = [], total = 0, orderNum=0
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
        //提交到下注接口
        betSubmit: function (gid, type) {
            const key = type == 'lhc' || type == 'pcdd' ? 'lhccarts' : 'carts'
            DB.getData(key, function(c) {
                var bets = c
                var params = {bets}
                RS.orderBet(gid, params)
                    .then((c) => {
                        if (c.code == 200) {
                            DB.deleteOneData(key, function() {
                                Layer.toast('下注成功')
                                Util.late(function() {
                                    history.go(-1)
                                })
                            })
                        } else {
                            if (c.code == 401) {
                                Layer.toast('没有登录')
                                $state.go('login')
                            } else {
                                Layer.toast(c.msg)
                            }
                        }
                    })
            })
        },
        checkCart: function (e, betArr) {
            if (betArr[0] != undefined && betArr[0].gid != e.gid) {
                return []
            }
            return betArr
        },

        showTips: function(scope) {
            if(scope.type == 'pcdd' || scope.type == 'lhc') {
                $state.go('rule', {type: scope.type})
                return
            }
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
