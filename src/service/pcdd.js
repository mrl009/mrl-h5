import angular from 'angular'
import $ from 'zepto'

export const Pcdd = (Core, Layer, Lottery, DB, RS, $state) => {
    return {
        //单击选号
        selBalls: function (pn, e) {
            var c = Lottery.arrBall(0).length
            if (e.sname == 'tmb3') {
                var _=$(pn)
                if(_.hasClass('active')) {
                    _.removeClass('active')
                    return 0
                } else {
                    if(c > 2) {
                        Layer.toast('只能选中三个号码')
                        return 1
                    } else {
                        _.addClass('active')
                        return c == 2 ? 1 : 0
                    }
                }
            }
            return Lottery.addActive(pn, c)
        },
        countNum: function (e) {
            var l0 = Lottery.arrBall(0)
            if (e.sname == 'tmb3') {
                return 1
            }
            return l0.length
        },
        //下注
        betSubmit: function (e, func) {
            if (e.tid == 2703 || e.tid == 2803) {
                this.allSubmit(e, func)
            } else {
                this.oneSubmit(e, func)
            }
        },
        //多个球一注
        allSubmit: function (e, func) {
            var ee = $('.balls').eq(0).find('.active')
            var pids = [], contents = [], names = [], rate = [], rebate = []
            $.each(ee, function (i, d) {
                var _ = $(d)
                pids.push(_.attr('pid'))
                contents.push(_.attr('code'))
                names.push(_.attr('name'))
                rate.push(_.attr('rate'))
                rebate.push(_.attr('rebate'))
            })
            DB.getData('lhccarts', function(carts) {
                var betArr = carts == null ? [] : JSON.parse(carts)
                betArr = Lottery.checkCart(e, betArr)
                var bet = {
                    gid: e.gid,
                    tid: e.tid,
                    price: e.suData.txtmoney,
                    counts: e.suData.sumbet,
                    price_sum: e.suData.txtmoney * e.suData.sumbet,
                    rate: e.lottery.rate == undefined ? rate.join() : e.lottery.rate, //玩法赔率不存在取球赔率
                    rebate: e.lottery.rebate == undefined ? rebate.join() : e.lottery.rebate,
                    pids: pids.join(),
                    contents: contents.join(),
                    names: names.join(),
                    atitle: e.playInfo.atitle,
                    btitle: e.playInfo.btitle
                }
                betArr.push(bet)
                DB.saveData({key: 'lhccarts', data: JSON.stringify(betArr)}, func)
            })
        },
        //一个球一注
        oneSubmit: function (e, func) {
            var ee = $('.balls').eq(0).find('.active')
            var bet = {}
            DB.getData('lhccarts', function(carts) {
                var betArr = carts == null ? [] : JSON.parse(carts)
                betArr = Lottery.checkCart(e, betArr)
                $.each(ee, function (i, d) {
                    bet = {
                        gid: e.gid,
                        tid: e.tid,
                        price: e.suData.txtmoney / e.suData.mtype,
                        counts: 1,
                        price_sum: e.suData.txtmoney / e.suData.mtype,
                        rate: $(d).attr('rate'),
                        rebate: $(d).attr('rebate'),
                        pids: $(d).attr('pid'),
                        contents: $(d).attr('code'),
                        names: $(d).attr('name'),
                        atitle: e.playInfo.atitle,
                        btitle: e.playInfo.btitle
                    }
                    betArr.push(bet)
                })
                DB.saveData({key: 'lhccarts', data: JSON.stringify(betArr)}, func)
            })
        },

        randomOne: function (e) {
            var baseBall = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9], r = []
            var sname = e.playInfo.sname
            if (sname == 'hh') {
                r = Core.randomOne(baseBall, false, 1)
                Lottery.setRandom(r, 1)
            } else if (sname == 'tm') {
                baseBall = Core.createArr(28)
                r = Core.randomOne(baseBall, false, 1)
                Lottery.setRandom(r, 1)
            } else if (sname == 'tmb3') {
                baseBall = Core.createArr(28)
                r = Core.randomOne(baseBall, false, 3)
                Lottery.setRandom(r, 3)
            } else if (sname == 'bs') {
                baseBall = [0, 1, 2]
                r = Core.randomOne(baseBall, false, 1)
                Lottery.setRandom(r, 1)
            } else if (sname == 'bz') {
                $('.balls span').addClass('active')
            }
        },
        //获取默认玩法信息
        getPinfo(S, id) {
            S.onePlayId = id
            $.each(S.playlist.play, function (i, d) {
                if (id == d.id) {
                    S.playInfo = d
                    S.playInfo.bname = d.sname //大类英文标识
                    S.playInfo.atitle = d.name //购物车玩法名称
                    S.playInfo.cname = d.sname
                    S.playInfo.btitle = d.name //购物车玩法名称
                    S.playInfo.topTitle = d.name //顶部显示名称
                    if (d.sname == 'tm' || d.sname == 'tmb3') {
                        S.tmp = 'pcdd/tm.tple.html'
                    } else {
                        S.tmp = 'pcdd/xx.tple.html'
                    }
                    return false
                }
            })
        },
        //获取球号
        getPros (S, flag) {
            RS.getProduct(S.gid, flag)
                .then((c) => {
                    if (c.code == 200) {
                        S.pros = c.data
                        S.lottery = c.data[S.show]
                        S.rate = {
                            rate: S.lottery.rate,
                            rate_min: S.lottery.rate_min,
                            rebate: S.lottery.rebate,
                            volume: 0
                        }
                    }
                })
        },
        //选择玩法更新球
        getBall (S, id) {
            S.onePlayId = id
            S.lottery = S.pros[id] //根据玩法查询球列表
            S.rate = {
                rate: S.lottery.rate,
                rate_min: S.lottery.rate_min,
                rebate: S.lottery.rebate,
                volume: 0
            }
            this.getPinfo(S, id)
            S.tid = id //玩法ID
            S.suData.sumbet = 0
            S.suData.money = 0
        },
        //下注
        bet (scope) {
            if (scope.suData.sumbet == 0) {
                Layer.toast('请选择球号')
                return false
            }
            if (!Core.getToken()) {
                $state.go('login', {ret: angular.toJson({url: 'pcdd', params: {type: 'pcdd', gid: scope.gid}})})
                return false
            }
            scope.tid = scope.tid || scope.show

            /*******indexDB***********/
            this.betSubmit(scope, function () {
                $state.go('lhccart', {gid: scope.gid, type: scope.type})
            })
        }
    }
}
